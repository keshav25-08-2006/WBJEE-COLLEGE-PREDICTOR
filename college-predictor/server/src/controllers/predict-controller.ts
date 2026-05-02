import type { Request, Response } from 'express';
import { predict, getDistinctValues } from '../services/predict-service.js';
import type { PredictQuery } from '../types/index.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function handlePredict(req: Request, res: Response): void {
  const query = req.query as unknown as PredictQuery;

  const rank = Number(query.rank);
  const category = query.category.trim();
  const quota = query.quota?.trim() || undefined;
  const round = query.round?.trim() || undefined;
  const seatType = query.seatType?.trim() || undefined;
  const search = query.search?.trim() || undefined;

  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));

  const result = predict(
    { rank, category, quota, round, seatType, search },
    { page, limit },
  );

  res.json(result);
}

export function handleFilters(_req: Request, res: Response): void {
  res.json(getDistinctValues());
}

export function handleHealth(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
