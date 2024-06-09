import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./routes/auth.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import twilio from "twilio";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import { body, validationResult } from "express-validator";
import userRoutes from "./routes/Users.js";
import productRoutes from "./routes/Product.js";
import ordersRoutes from "./routes/Order.js";
import agentsRoutes from "./routes/Agent.js";
import "./routes/auth.js"; // Ensure this file properly configures passport

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma client
const prismaClient = new PrismaClient();

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const verificationCodes = {};

// Initialize Redis client and store
let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize session storage
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      name: "mlm",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware
app.use(bodyParser.json());

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prismaClient.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              role: "USER",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prismaClient.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Send verification code
app.post("/send-verification-code", async (req, res) => {
  const { contactNumber } = req.body;

  if (!contactNumber) {
    return res.status(400).json({ error: "Contact number is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
  verificationCodes[contactNumber] = code;

  try {
    await client.messages.create({
      body: `Your verification code is ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contactNumber,
    });

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

// Signup route for contact number with verification
app.post(
  "/signup",
  [
    body("name").not().isEmpty(),
    body("password").isLength({ min: 6 }),
    body("contactNumber").optional().isMobilePhone(),
    body("code").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, contactNumber, password, code } = req.body;

    if (!contactNumber) {
      return res.status(400).json({ error: "Contact number is required" });
    }

    if (verificationCodes[contactNumber] !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const existingUser = await prismaClient.user.findFirst({
      where: { contactNumber },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this contact number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
      data: {
        name,
        contactNumber,
        password: hashedPassword,
        role: "USER",
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    delete verificationCodes[contactNumber];

    res.status(201).json({ token });
  }
);

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/agents", agentsRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
