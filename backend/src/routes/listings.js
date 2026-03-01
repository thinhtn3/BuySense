import { Router } from 'express';
import { getListingsForProduct } from '../services/listingService.js';

const router = Router();

// GET /api/listings?productId=iphone-16-128gb&condition=new
router.get('/', (req, res, next) => {
  const { productId, condition } = req.query;

  if (!productId) {
    return next(Object.assign(new Error('productId query param is required'), { status: 400 }));
  }

  try {
    const listings = getListingsForProduct(productId, condition);
    res.json(listings);
  } catch (err) {
    next(err);
  }
});

export default router;
