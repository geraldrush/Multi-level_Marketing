import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create an agent
export const createAgent = async (req, res) => {
  const { userId, name, location, stock, sales, reviews } = req.body;
  try {
    const agent = await prisma.agent.create({
      data: {
        user: { connect: { id: userId } },
        name,
        location,
        stock,
        sales,
        reviews, // Include reviews in the creation data
      },
      include: {
        products: true,
        orders: true,
        chats: true,
        reviews: true, // Include reviews in the response
      },
    });
    res.status(201).render("agent", { agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        user: true,
        products: true,
        orders: true,
        chats: true,
        reviews: true, // Include reviews in the response
      },
    });
    res.render("agents", { agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one agent by id
export const getAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await prisma.agent.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        products: true,
        orders: true,
        chats: true,
        reviews: true, // Include reviews in the response
      },
    });
    if (agent) {
      res.render("agent", { agent });
    } else {
      res.status(404).json({ error: "Agent not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update an agent
export const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { name, location, stock, sales, reviews } = req.body;

  try {
    const agent = await prisma.agent.update({
      where: {
        id,
      },
      data: {
        name,
        location,
        stock,
        sales,
        reviews, // Include reviews in the update data
      },
      include: {
        user: true,
        products: true,
        orders: true,
        chats: true,
        reviews: true, // Include reviews in the response
      },
    });
    res.render("agent", { agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await prisma.agent.delete({
      where: {
        id,
      },
    });
    res.render("agent", { agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
