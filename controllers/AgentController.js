import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create an agent
export const createAgent = async (req, res) => {
  const { userId, name, location, stock, sales } = req.body;
  try {
    const agent = await prisma.agent.create({
      data: {
        user: { connect: { id: userId } },
        name,
        location,
        stock,
        sales,
      },
      include: {
        products: true,
        Order: true,
        Chat: true,
      },
    });
    res.status(201).json(agent);
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
        Order: true,
        Chat: true,
      },
    });
    res.json(agents);
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
        Order: true,
        Chat: true,
      },
    });
    if (agent) {
      res.json(agent);
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
  const { name, location, stock, sales } = req.body;

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
      },
      include: {
        user: true,
        products: true,
        Order: true,
        Chat: true,
      },
    });
    res.json(agent);
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
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
