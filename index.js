import express from "express";
import bodyParser from "body-parser";
import { pool } from "./postgres.js";

const app = express();
const port = 3000;

app.get("/users", (req, res) => {
  Pool.query("SELECT * FROM users")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log("server running on port 3000");
});
