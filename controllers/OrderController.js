import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create an order
export const createOrder = async (req, res) => {
  const { userId, agentId, productId, quantity } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        agent: { connect: { id: agentId } },
        product: { connect: { id: productId } },
        quantity,
      },
      include: {
        user: true,
        agent: true,
        product: true,
      },
    });
    res.status(201).render('order', { order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        agent: true,
        product: true,
      },
    });
    res.render('orders', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one order by id
export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        agent: true,
        product: true,
      },
    });
    if (order) {
      res.render('order', { order });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { quantity, status } = req.body;

  try {
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        quantity,
        status,
      },
      include: {
        user: true,
        agent: true,
        product: true,
      },
    });
    res.render('order', { order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.delete({
      where: {
        id,
      },
    });
    res.render('order', { order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
