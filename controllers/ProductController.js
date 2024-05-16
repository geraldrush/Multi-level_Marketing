import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a product
export const createProduct = async (req, res) => {
  const { name, description, price, commission, agentId } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        commission,
        Agent: agentId ? { connect: { id: agentId } } : undefined,
      },
      include: {
        Order: true,
        Agent: true,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Order: true,
        Agent: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one product by id
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        Order: true,
        Agent: true,
      },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, commission, agentId } = req.body;

  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        commission,
        Agent: agentId ? { connect: { id: agentId } } : undefined,
      },
      include: {
        Order: true,
        Agent: true,
      },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
