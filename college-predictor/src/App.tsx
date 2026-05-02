import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CollegeResult, FilterState, FilterOptions, SearchFilters } from './types';
import { fetchPredictions, fetchFilterOptions } from './lib/api';
import { applyClientFilters } from './lib/filters';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { Filters } from './components/Filters';
import { ResultsTable } from './components/ResultsTable';
import { Pagination } from './components/Pagination';
import { Footer } from './components/Footer';

const PAGE_SIZE = 50;

const INITIAL_FILTERS: FilterState = {
  rank: null,
  category: 'Open',
  quota: 'Home State',
  round: 'Round 1',
};

const INITIAL_SEARCH: SearchFilters = {
  query: '',
  sortField: 'closingRank',
  sortOrder: 'asc',
};

function App() {
  const { theme, toggleTheme } = useTheme();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [search, setSearch] = useState<SearchFilters>(INITIAL_SEARCH);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allResults, setAllResults] = useState<CollegeResult[]>([]);
  const [totalFromApi, setTotalFromApi] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch((err) => console.warn('Failed to load filter options:', err));
  }, []);

  const fetchPage = useCallback(
    async (page: number) => {
      if (!filters.rank || filters.rank <= 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPredictions(filters, undefined, page, PAGE_SIZE);
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
    [filters],
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
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [fetchPage],
  );

  const displayResults = useMemo(
    () => applyClientFilters(allResults, search),
    [allResults, search],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0a0a0f] dark:text-slate-100">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <InputForm
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={setFilters}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Filters
          search={search}
          onSearchChange={setSearch}
          resultCount={displayResults.length}
          totalCount={totalFromApi}
          hasSearched={hasSearched}
        />

        <ResultsTable
          results={displayResults}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />

        {hasSearched && !isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
