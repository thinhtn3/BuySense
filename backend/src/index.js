import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productRoutes    from './routes/products.js';
import comparisonRoutes from './routes/comparisons.js';
import listingRoutes    from './routes/listings.js';
import priceRoutes      from './routes/prices.js';
import chatRoutes       from './routes/chat.js';
import resourceRoutes   from './routes/resources.js';
import insightRoutes    from './routes/insights.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/products',    productRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/listings',    listingRoutes);
app.use('/api/prices',      priceRoutes);
app.use('/api/chat',        chatRoutes);
app.use('/api/resources',   resourceRoutes);
app.use('/api/insights',    insightRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`BuySense API running on http://localhost:${PORT}`);
});
