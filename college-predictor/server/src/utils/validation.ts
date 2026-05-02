import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse } from '../types/index.js';

export function validatePredictQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { rank, category } = req.query;

  if (!rank || typeof rank !== 'string' || rank.trim() === '') {
    res.status(400).json({
      error: 'Missing required parameter: rank',
      details: 'rank must be a positive integer',
    } satisfies ErrorResponse);
    return;
  }

  const rankNum = Number(rank);
  if (!Number.isInteger(rankNum) || rankNum <= 0) {
    res.status(400).json({
      error: 'Invalid parameter: rank',
      details: `rank must be a positive integer, received: "${rank}"`,
    } satisfies ErrorResponse);
    return;
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    res.status(400).json({
      error: 'Missing required parameter: category',
      details:
        'category is required (e.g. Open, SC, ST, OBC - A, OBC - B, EWS, Tuition Fee Waiver)',
    } satisfies ErrorResponse);
    return;
  }

  next();
}
