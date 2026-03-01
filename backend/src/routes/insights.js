import { Router }   from 'express';
import rateLimit     from 'express-rate-limit';
import { getAllProducts }     from '../services/productService.js';
import { generateInsights }  from '../services/insightService.js';

const router = Router();

// Gemini is expensive — 10 calls per IP per hour
const limiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many insight requests — try again later.' },
});

router.use(limiter);

/**
 * POST /api/insights
 * Body: { productIds: string[], prices?: object[] }
 *
 * prices is the priceResults array already fetched by the client from /api/prices,
 * so we don't need to re-fetch it here.
 */
router.post('/', async (req, res, next) => {
  const { productIds, prices = [] } = req.body;

  if (!Array.isArray(productIds) || !productIds.length) {
    return next(Object.assign(new Error('productIds array is required'), { status: 400 }));
  }

  const ids = productIds.slice(0, 5); // cap at 5

  try {
    const allProducts = await getAllProducts();
    const products    = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

    if (!products.length) {
      return next(Object.assign(new Error('No matching products found'), { status: 404 }));
    }

    const insights = await generateInsights(products, prices);
    res.json(insights);
  } catch (err) {
    // Surface JSON parse errors as 502 so the client can show a friendly message
    if (err instanceof SyntaxError) {
      return next(Object.assign(new Error('AI returned an unexpected response — try again.'), { status: 502 }));
    }
    next(err);
  }
});

export default router;
