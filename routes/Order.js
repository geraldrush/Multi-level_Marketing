import express from 'express';
import { createOrder, getOrders, getOrder, updateOrder, deleteOrder } from '../controllers/OrderController.js';

const router = express.Router();

// Create a user
router.post('/', createOrder);

// Get all users
router.get('/', getOrders);

// Get one user by id
router.get('/:id', getOrder);

// Update a user
router.put('/:id', updateOrder);

// Delete a user
router.delete('/:id', deleteOrder);

export default router;
