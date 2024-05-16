import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a payment
export const createPayment = async (req, res) => {
  const { userId, amount, method } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        user: { connect: { id: userId } },
        amount,
        method,
      },
      include: {
        user: true,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
      },
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one payment by id
export const getPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a payment
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method } = req.body;

  try {
    const payment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        amount,
        method,
      },
      include: {
        user: true,
      },
    });
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.delete({
      where: {
        id,
      },
    });
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
