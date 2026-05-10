import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { loadAllCsvs } from './utils/csv-loader.js';

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
  loadAllCsvs();
  app.listen(PORT, () => {
    console.log(`[Server] College Predictor API running on http://localhost:${PORT}`);
    console.log(`[Server] Endpoints:`);
    console.log(`  GET /api/predict?exam=wbjee&rank=5000&category=Open&quota=Home State&round=Round 1`);
    console.log(`  GET /api/predict?exam=jee-main&rank=5000&category=OPEN&gender=Gender-Neutral`);
    console.log(`  GET /api/predict?exam=jee-advanced&rank=5000&category=OPEN`);
    console.log(`  GET /api/filters?exam=wbjee`);
    console.log(`  GET /api/health`);
  });
} catch (err) {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
}
