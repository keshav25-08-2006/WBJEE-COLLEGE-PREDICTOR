import type { FilterState, PaginatedResponse, FilterOptions } from '../types';

const API_BASE = '/api';

export async function fetchPredictions(
  filters: FilterState,
  search?: string,
  page = 1,
  limit = 100,
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    rank: String(filters.rank),
    category: filters.category,
    quota: filters.quota,
    round: filters.round,
    page: String(page),
    limit: String(limit),
  });

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

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const res = await fetch(`${API_BASE}/filters`);

  if (!res.ok) {
    throw new Error(`Failed to load filter options: HTTP ${res.status}`);
  }

  return res.json();
}
