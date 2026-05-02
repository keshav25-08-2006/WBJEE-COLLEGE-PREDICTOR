import { getData } from '../utils/csv-loader.js';
import { getChance, ciIncludes } from '../utils/prediction.js';
import type {
  CollegeData,
  PredictionResult,
  PaginatedResponse,
} from '../types/index.js';

interface FilterParams {
  rank: number;
  category: string;
  quota?: string;
  round?: string;
  seatType?: string;
  search?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
}

// Simple in-memory cache keyed by stringified params
const cache = new Map<string, { results: PredictionResult[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(filters: FilterParams): string {
  return JSON.stringify(filters);
}

function filterAndPredict(
  data: ReadonlyArray<CollegeData>,
  params: FilterParams,
): PredictionResult[] {
  const results: PredictionResult[] = [];

  for (const entry of data) {
    // 1. Category match (case-insensitive)
    if (entry.category.toLowerCase() !== params.category.toLowerCase()) {
      continue;
    }

    // 2. Quota match
    if (
      params.quota &&
      entry.quota.toLowerCase() !== params.quota.toLowerCase()
    ) {
      continue;
    }

    // 3. Round match
    if (
      params.round &&
      entry.round.toLowerCase() !== params.round.toLowerCase()
    ) {
      continue;
    }

    // 4. Seat type match
    if (
      params.seatType &&
      entry.seatType.toLowerCase() !== params.seatType.toLowerCase()
    ) {
      continue;
    }

    // 5. Rank qualification
    if (params.rank > entry.closingRank) {
      continue;
    }

    // 6. Search filter
    if (
      params.search &&
      !ciIncludes(entry.institute, params.search) &&
      !ciIncludes(entry.program, params.search)
    ) {
      continue;
    }

    results.push({
      ...entry,
      chance: getChance(params.rank, entry.closingRank),
    });
  }

  // Sort by closingRank ascending
  results.sort((a, b) => a.closingRank - b.closingRank);

  return results;
}

export function predict(
  params: FilterParams,
  pagination: PaginationParams,
): PaginatedResponse {
  const cacheKey = getCacheKey(params);
  const now = Date.now();

  let allResults: PredictionResult[];

  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    allResults = cached.results;
  } else {
    allResults = filterAndPredict(getData(), params);
    cache.set(cacheKey, { results: allResults, ts: now });
  }

  const total = allResults.length;
  const totalPages = Math.ceil(total / pagination.limit) || 1;
  const safePage = Math.min(Math.max(1, pagination.page), totalPages);
  const startIdx = (safePage - 1) * pagination.limit;
  const paged = allResults.slice(startIdx, startIdx + pagination.limit);

  return {
    results: paged,
    total,
    page: safePage,
    limit: pagination.limit,
    totalPages,
  };
}

export function getDistinctValues(): {
  categories: string[];
  quotas: string[];
  rounds: string[];
  seatTypes: string[];
} {
  const cats = new Set<string>();
  const quotas = new Set<string>();
  const rounds = new Set<string>();
  const seatTypes = new Set<string>();

  for (const entry of getData()) {
    if (entry.category) cats.add(entry.category);
    if (entry.quota) quotas.add(entry.quota);
    if (entry.round) rounds.add(entry.round);
    if (entry.seatType) seatTypes.add(entry.seatType);
  }

  return {
    categories: [...cats].sort(),
    quotas: [...quotas].sort(),
    rounds: [...rounds].sort(),
    seatTypes: [...seatTypes].sort(),
  };
}
