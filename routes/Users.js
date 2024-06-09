import express from "express";
import {
  sendVerificationCode,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/send-verification-code", sendVerificationCode);
router.post("/signup", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
