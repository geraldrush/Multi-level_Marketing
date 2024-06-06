import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/Users.js";
import dotenv from "dotenv";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

dotenv.config();

// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

const app = express();
const PORT = process.env.PORT;
// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production", // ensure secure cookies in production
      maxAge: 1000 * 60 * 60 * 24,
      name: "mlm", // 1 day
    },
  })
);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);

app.get("/test-session", (req, res) => {
  req.session.test = "Session is working";
  res.send("Session set");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
