import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import userRoutes from "./routes/Users.js";
import productRoutes from "./routes/Product.js";
import ordersRoutes from "./routes/Order.js";
import agentsRoutes from "./routes/Agent.js";
import authRoutes from "./routes/auth.js";
import passport from "./utils/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    name: "mlm",
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
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

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("overlay"); // Render the overlay if the user is not authenticated
};

// Routes
app.use("/", authRoutes);
app.use("/users", ensureAuthenticated, userRoutes);
app.use("/products", ensureAuthenticated, productRoutes);
app.use("/orders", ensureAuthenticated, ordersRoutes);
app.use("/agents", ensureAuthenticated, agentsRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
