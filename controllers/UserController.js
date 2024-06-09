import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const verificationCodes = {};

// Send verification code
export const sendVerificationCode = async (req, res) => {
  const { contactNumber } = req.body;

  if (!contactNumber) {
    return res.status(400).json({ error: "Contact number is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

  // Store the code temporarily (you can use a more persistent storage like Redis)
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
};

// Verify the code and create a user
export const createUser = async (req, res) => {
  const { name, gmail, contactNumber, password, code, role, location } =
    req.body;

  // Ensure either gmail or contactNumber is provided
  if (!gmail && !contactNumber) {
    return res
      .status(400)
      .json({ error: "Gmail or contact number is required" });
  }

  // Verify the code if contact number is provided
  if (contactNumber && verificationCodes[contactNumber] !== code) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  try {
    // Check if user already exists with the provided gmail or contact number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { gmail: gmail || undefined },
          { contactNumber: contactNumber || undefined },
        ],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({
          error: "User with this Gmail or contact number already exists",
        });
    }

    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        gmail,
        contactNumber,
        password: hashedPassword,
        role,
        location,
      },
    });

    // Remove the verification code after successful signup
    delete verificationCodes[contactNumber];

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

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
