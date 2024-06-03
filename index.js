/*import express from "express";
import bodyParser from "body-parser";

import usersRoutes from "./routes/Users.js";
//import menuRoutes from "./routes/menu.js";
//import categoryRoutes from "./routes/category.js";
//import favoriteRoutes from "./routes/favorite.js";
//import notificationRoutes from "./routes/notification.js";
//import orderRoutes from "./routes/order.js";
//import restaurantRoutes from "./routes/restaurant.js";

const app = express();
const port = 3000;

app.use("/users", usersRoutes);

//app.use("/menu", menuRoutes);
//app.use("/categories", categoryRoutes);
//app.use("/favorite", favoriteRoutes);
//app.use("/notifications", notificationRoutes);
//app.use("/orders", orderRoutes);
//app.use("/restaurants", restaurantRoutes);
//app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("<><><> API is running <><><>");
});

app.listen(port, () => {
  console.log("server running on port 3000");
});*/


import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

import usersRoutes from "./routes/Users.js";


// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { 
        orders: true,
        payments: true,
        agents: true,
        notifications: true,
        chats: true 
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;
    const user = await prisma.user.create({
      data: { name, email, password, location, role },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Create a new order
app.post('/orders', async (req, res) => {
  try {
    const { userId, agentId, productId, quantity } = req.body;
    const order = await prisma.order.create({
      data: { userId, agentId, productId, quantity },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, agent: true, product: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new payment
app.post('/payments', async (req, res) => {
  try {
    const { userId, amount, method } = req.body;
    const payment = await prisma.payment.create({
      data: { userId, amount, method },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Fetch all payments
app.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { user: true },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.get("/", (req, res) => {
  res.send("<><><> API is running <><><>");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
