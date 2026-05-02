import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { loadCsv } from './utils/csv-loader.js';

const PORT = Number(process.env.PORT) || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Startup
try {
  loadCsv();
  app.listen(PORT, () => {
    console.log(`[Server] WBJEE Predictor API running on http://localhost:${PORT}`);
    console.log(`[Server] Endpoints:`);
    console.log(`  GET /api/predict?rank=5000&category=Open&quota=Home State&round=Round 1`);
    console.log(`  GET /api/filters`);
    console.log(`  GET /api/health`);
  });
} catch (err) {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
}
