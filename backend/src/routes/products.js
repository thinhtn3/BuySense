import { Router } from 'express';
import { getAllProducts, getProductById } from '../services/productService.js';

const router = Router();

// GET /api/products?category=phones
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    res.json(await getAllProducts(category));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return next(Object.assign(new Error('Product not found'), { status: 404 }));
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
