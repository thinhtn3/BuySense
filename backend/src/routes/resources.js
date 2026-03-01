import { Router }  from 'express';
import rateLimit    from 'express-rate-limit';
import { getAllProducts }       from '../services/productService.js';
import { getOrFetchResources } from '../services/resourceService.js';

const router = Router();

// 20 resource lookups per IP per hour
const limiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests — try again later.' },
});

router.use(limiter);

// GET /api/resources?productIds=id1,id2
router.get('/', async (req, res, next) => {
  const { productIds } = req.query;

  if (!productIds) {
    return next(Object.assign(new Error('productIds is required'), { status: 400 }));
  }

  const ids = productIds.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);

  try {
    const allProducts = await getAllProducts();
    const products    = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

    if (!products.length) {
      return next(Object.assign(new Error('No matching products found'), { status: 404 }));
    }

    const settled = await Promise.allSettled(
      products.map((p) => getOrFetchResources(p))
    );

    const response = Object.fromEntries(
      settled.map((result, i) => [
        products[i].id,
        result.status === 'fulfilled' ? result.value : [],
      ])
    );

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
