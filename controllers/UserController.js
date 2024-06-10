import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();



// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: true,
        payments: true,
        agents: true,
        notifications: true,
        chats: true,
      },
    });
    res.render("users", { users }); // Render the 'users' EJS view
    console.log(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one user by id
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        orders: true,
        payments: true,
        agents: true,
        notifications: true,
        chats: true,
      },
    });
    if (user) {
      res.render("user", { user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, gmail, contactNumber, password, role, location } = req.body;

  // Check if the provided role is valid
  if (role && !["USER", "AGENT", "ADMIN"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Hash the password if provided
    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        gmail,
        contactNumber,
        password: hashedPassword,
        role,
        location,
      },
      include: {
        orders: true,
        payments: true,
        agents: true,
        notifications: true,
        chats: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
