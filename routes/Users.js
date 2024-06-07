import express from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/UserController.js';

const router = express.Router();

// Create a user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get one user by id
router.get('/:id', getUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

export default router;
