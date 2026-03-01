import { Router } from 'express';
import { getAllProducts, getProductById, searchProductsByName, createCustomProduct } from '../services/productService.js';

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

// POST /api/products/custom  { name: "Galaxy Z Fold 7" }
// Searches Supabase first; if nothing found creates a stub product
router.post('/custom', async (req, res, next) => {
  try {
    const name = (req.body.name ?? '').trim();
    if (!name) return res.status(400).json({ error: 'Product name is required.' });

    // 1 — check if something close already exists
    const existing = await searchProductsByName(name);
    if (existing.length > 0) return res.json({ product: existing[0], created: false });

    // 2 — nothing found: create a stub
    const product = await createCustomProduct(name);
    res.json({ product, created: true });
  } catch (err) {
    next(err);
  }
});

export default router;
