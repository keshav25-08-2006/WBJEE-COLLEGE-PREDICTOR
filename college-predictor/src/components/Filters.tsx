import { Search, ArrowUpDown } from 'lucide-react';
import type { SearchFilters, SortField, SortOrder } from '../types';
import { Button } from './ui/button';

interface FiltersProps {
  search: SearchFilters;
  onSearchChange: (search: SearchFilters) => void;
  resultCount: number;
  totalCount: number;
  hasSearched: boolean;
}

function Filters({
  search,
  onSearchChange,
  resultCount,
  totalCount,
  hasSearched,
}: FiltersProps) {
  if (!hasSearched) return null;

  const toggleSort = () => {
    const nextField: SortField =
      search.sortField === 'closingRank' ? 'institute' : 'closingRank';
    onSearchChange({ ...search, sortField: nextField });
  };

  const toggleOrder = () => {
    const nextOrder: SortOrder = search.sortOrder === 'asc' ? 'desc' : 'asc';
    onSearchChange({ ...search, sortOrder: nextOrder });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="search-input"
            type="text"
            placeholder="Search institute or program..."
            value={search.query}
            onChange={(e) =>
              onSearchChange({ ...search, query: e.target.value })
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleSort}>
            <ArrowUpDown size={14} />
            {search.sortField === 'closingRank' ? 'Rank' : 'Name'}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleOrder}>
            {search.sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {resultCount}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {totalCount}
        </span>{' '}
        {totalCount === 1 ? 'result' : 'results'} shown
      </p>
    </div>
  );
}

export { Filters };
