import { Router } from 'express';
import { buildComparison } from '../services/comparisonService.js';

const router = Router();

// GET /api/comparisons?productA=iphone-16-128gb&productB=iphone-16-pro-256gb&condition=new
router.get('/', (req, res, next) => {
  const { productA, productB, condition } = req.query;

  if (!productA || !productB) {
    return next(Object.assign(new Error('productA and productB query params are required'), { status: 400 }));
  }

  try {
    const comparison = buildComparison(productA, productB, condition);
    res.json(comparison);
  } catch (err) {
    next(err);
  }
});

export default router;
