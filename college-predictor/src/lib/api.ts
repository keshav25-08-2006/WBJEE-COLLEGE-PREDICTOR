import type { ExamType, FilterState, PaginatedResponse, FilterOptions } from '../types';

const API_BASE = '/api';

export async function fetchPredictions(
  exam: ExamType,
  filters: FilterState,
  search?: string,
  page = 1,
  limit = 100,
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    exam,
    rank: String(filters.rank),
    category: filters.category,
    page: String(page),
    limit: String(limit),
  });

  if (filters.quota) {
    params.set('quota', filters.quota);
  }

  if (filters.round) {
    params.set('round', filters.round);
  }

  if (filters.gender) {
    params.set('gender', filters.gender);
  }

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  const res = await fetch(`${API_BASE}/predict?${params}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchFilterOptions(exam: ExamType = 'wbjee'): Promise<FilterOptions> {
  const res = await fetch(`${API_BASE}/filters?exam=${exam}`);

  if (!res.ok) {
    throw new Error(`Failed to load filter options: HTTP ${res.status}`);
  }

  return res.json();
}
