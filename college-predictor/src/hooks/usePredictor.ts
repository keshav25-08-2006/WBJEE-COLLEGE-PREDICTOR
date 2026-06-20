import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  ExamType,
  CollegeResult,
  FilterState,
  FilterOptions,
  SearchFilters,
} from '../types';
import { fetchPredictions, fetchFilterOptions } from '../lib/api';
import { applyClientFilters } from '../lib/filters';

const PAGE_SIZE = 50;

const INITIAL_SEARCH: SearchFilters = {
  query: '',
  sortField: 'closingRank',
  sortOrder: 'asc',
};

interface UsePredictorOptions {
  examType: ExamType;
  defaultFilters: FilterState;
}

export function usePredictor({ examType, defaultFilters }: UsePredictorOptions) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState<SearchFilters>(INITIAL_SEARCH);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allResults, setAllResults] = useState<CollegeResult[]>([]);
  const [totalFromApi, setTotalFromApi] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options on mount or exam type change
  useEffect(() => {
    setFilterOptions(null);
    fetchFilterOptions(examType, filters.year)
      .then(setFilterOptions)
      .catch((err) => console.warn('Failed to load filter options:', err));
  }, [examType, filters.year]);

  // Reset state when exam type changes
  useEffect(() => {
    setFilters(defaultFilters);
    setSearch(INITIAL_SEARCH);
    setHasSearched(false);
    setAllResults([]);
    setTotalFromApi(0);
    setTotalPages(1);
    setCurrentPage(1);
    setError(null);
  }, [examType, defaultFilters]);

  const fetchPage = useCallback(
    async (page: number) => {
      if (!filters.rank || filters.rank <= 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPredictions(examType, filters, undefined, page, PAGE_SIZE);
        setAllResults(data.results);
        setTotalFromApi(data.total);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setAllResults([]);
        setTotalFromApi(0);
      } finally {
        setIsLoading(false);
      }
    },
    [examType, filters],
  );

  const handleSubmit = useCallback(async () => {
    if (!filters.rank || filters.rank <= 0) return;
    setHasSearched(true);
    setSearch(INITIAL_SEARCH);
    setCurrentPage(1);
    await fetchPage(1);
  }, [filters, fetchPage]);

  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [fetchPage],
  );

  const displayResults = useMemo(
    () => applyClientFilters(allResults, search),
    [allResults, search],
  );

  return {
    filters,
    setFilters,
    search,
    setSearch,
    isLoading,
    hasSearched,
    allResults,
    displayResults,
    totalFromApi,
    totalPages,
    currentPage,
    filterOptions,
    error,
    handleSubmit,
    handlePageChange,
  };
}
