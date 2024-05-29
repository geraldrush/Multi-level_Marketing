import express from "express";
import prisma from "../utils/prisma.js";

import {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

export default router;
