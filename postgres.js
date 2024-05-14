import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mlm",
  password: "",
  port: "5432",
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    // Your code here
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL database:", error);
  });

export { pool };
