import { Router }   from 'express';
import rateLimit     from 'express-rate-limit';
import { getAllProducts }      from '../services/productService.js';
import { getOrFetchListings } from '../services/listingService.js';

const router = Router();

// 10 compare clicks per IP per hour
const limiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests — please wait before comparing again.' },
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
    const allProducts = await getAllProducts();
    const products    = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

    if (!products.length) {
      return next(Object.assign(new Error('No matching products found'), { status: 404 }));
    }

    // Fetch listings per product (Supabase → SerpAPI fallback)
    const settled = await Promise.allSettled(
      products.map((p) => getOrFetchListings(p, condition))
    );

    const response = settled.map((result, i) => {
      const product = products[i];

      if (result.status === 'rejected') {
        return { productId: product.id, condition, error: result.reason?.message ?? 'Failed', listingCount: 0 };
      }

      const listings = result.value ?? [];
      const cheapest = listings[0] ?? null; // already sorted price ASC

      return {
        productId:    product.id,
        condition,
        price:        cheapest?.price        ?? null,
        period:       cheapest?.period       ?? null,
        finalPrice:   cheapest?.finalPrice   ?? cheapest?.price ?? null,
        source:       cheapest?.retailer     ?? null,
        url:          cheapest?.url          ?? null,
        freeShipping: cheapest?.freeShipping ?? false,
        label:        cheapest?.label        ?? null,
        listingCount: listings.length,
        listings,
      };
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
