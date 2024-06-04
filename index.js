import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/Users.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
