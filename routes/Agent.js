import express from 'express';
import { createAgent, getAgents, getAgent, updateAgent, deleteAgent } from '../controllers/AgentController.js';

const router = express.Router();

// Create a user
router.post('/', createAgent);

// Get all users
router.get('/', getAgents);

// Get one user by id
router.get('/:id', getAgent);

// Update a user
router.put('/:id', updateAgent);

// Delete a user
router.delete('/:id', deleteAgent);

export default router;
