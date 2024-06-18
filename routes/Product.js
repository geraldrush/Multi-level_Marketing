import express from 'express';
import methodOverride from 'method-override';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware for method override (for PUT and DELETE methods in forms)
router.use(methodOverride('_method'));

// Render the dashboard with the form to add/edit products
router.get('/dashboard', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.render('dashboard', { products, product: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Render the form for editing a specific product
router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    const products = await prisma.product.findMany();
    if (product) {
      res.render('dashboard', { products, product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create a product
router.post('/', createProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

// Get all products (used in rendering dashboard)
router.get('/', getProducts);

// Get one product by id
router.get('/:id', getProduct);

export default router;
