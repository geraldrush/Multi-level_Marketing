import express from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';

const router = express.Router();

// Create a user
router.post('/', createProduct);

// Get all users
router.get('/', getProducts);

// Get one user by id
router.get('/:id', getProduct);

// Update a user
router.put('/:id', updateProduct);

// Delete a user
router.delete('/:id', deleteProduct);

export default router;
