import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse, ExamType } from '../types/index.js';

const VALID_EXAMS: ExamType[] = ['wbjee', 'jee-main', 'jee-advanced', 'csab'];

export function validatePredictQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { rank, category, exam } = req.query;

  // Validate exam type
  if (exam && !VALID_EXAMS.includes(exam as ExamType)) {
    res.status(400).json({
      error: 'Invalid parameter: exam',
      details: `exam must be one of: ${VALID_EXAMS.join(', ')}`,
    } satisfies ErrorResponse);
    return;
  }

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
        'category is required (e.g. Open, SC, ST, OBC-NCL, EWS)',
    } satisfies ErrorResponse);
    return;
  }

  next();
}
