import type { ExamConfig } from '../types';
import { usePredictor } from '../hooks/usePredictor';
import { InputForm } from './InputForm';
import { Filters } from './Filters';
import { ResultsTable } from './ResultsTable';
import { Pagination } from './Pagination';

interface PredictorPageProps {
  config: ExamConfig;
}

function PredictorPage({ config }: PredictorPageProps) {
  const {
    filters,
    setFilters,
    search,
    setSearch,
    isLoading,
    hasSearched,
    displayResults,
    totalFromApi,
    totalPages,
    currentPage,
    filterOptions,
    error,
    handleSubmit,
    handlePageChange,
  } = usePredictor({
    examType: config.examType,
    defaultFilters: config.defaultFilters,
  });

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {config.title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {config.subtitle}
        </p>
      </div>

      <InputForm
        config={config}
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
        config={config}
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
    </div>
  );
}

export { PredictorPage };
