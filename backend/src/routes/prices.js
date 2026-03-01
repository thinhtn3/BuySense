import { Router }   from 'express';
import rateLimit     from 'express-rate-limit';
import { getAllProducts }          from '../services/productService.js';
import { getPricesForProducts }   from '../services/serpApiService.js';

const router = Router();

// 10 compare clicks per IP per hour — preserves SerpAPI free-tier budget
const limiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many price lookups — please wait before comparing again.' },
});

router.use(limiter);

// GET /api/prices?productIds=id1,id2&condition=new
router.get('/', async (req, res, next) => {
  const { productIds, condition = 'new' } = req.query;

  if (!productIds) {
    return next(Object.assign(new Error('productIds query param is required'), { status: 400 }));
  }

  const ids = productIds.split(',').map((s) => s.trim()).filter(Boolean);
  if (!ids.length || ids.length > 5) {
    return next(Object.assign(new Error('Provide 1–5 product IDs'), { status: 400 }));
  }

  try {
    // Resolve product records (needed for brand + name to build the search query)
    const allProducts = await getAllProducts();
    const products    = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

    if (!products.length) {
      return next(Object.assign(new Error('No matching products found'), { status: 404 }));
    }

    const prices = await getPricesForProducts(products, condition);
    res.json(prices);
  } catch (err) {
    next(err);
  }
});

export default router;
