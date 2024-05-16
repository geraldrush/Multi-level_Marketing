import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a chat
export const createChat = async (req, res) => {
  const { userId, agentId, message } = req.body;
  try {
    const chat = await prisma.chat.create({
      data: {
        user: { connect: { id: userId } },
        agent: { connect: { id: agentId } },
        message,
      },
      include: {
        user: true,
        agent: true,
      },
    });
    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all chats
export const getChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        user: true,
        agent: true,
      },
    });
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get one chat by id
export const getChat = async (req, res) => {
  const { id } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        agent: true,
      },
    });
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ error: "Chat not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a chat
export const updateChat = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const chat = await prisma.chat.update({
      where: {
        id,
      },
      data: {
        message,
      },
      include: {
        user: true,
        agent: true,
      },
    });
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  const { id } = req.params;
  try {
    const chat = await prisma.chat.delete({
      where: {
        id,
      },
    });
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
