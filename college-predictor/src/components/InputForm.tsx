import { type FormEvent, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { FilterState, FilterOptions } from '../types';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';

interface InputFormProps {
  filters: FilterState;
  filterOptions: FilterOptions | null;
  onFiltersChange: (filters: FilterState) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

function toSelectOptions(values: string[]): { value: string; label: string }[] {
  return values.map((v) => ({ value: v, label: v }));
}

function InputForm({
  filters,
  filterOptions,
  onFiltersChange,
  onSubmit,
  isLoading,
}: InputFormProps) {
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const categoryOptions = filterOptions
    ? toSelectOptions(filterOptions.categories)
    : [{ value: filters.category, label: filters.category }];

  const quotaOptions = filterOptions
    ? toSelectOptions(filterOptions.quotas)
    : [{ value: filters.quota, label: filters.quota }];

  const roundOptions = filterOptions
    ? toSelectOptions(filterOptions.rounds)
    : [{ value: filters.round, label: filters.round }];

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            id="rank-input"
            label="Your WBJEE Rank"
            type="number"
            min={1}
            max={200000}
            placeholder="e.g. 5000"
            value={filters.rank ?? ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                rank: e.target.value ? Number(e.target.value) : null,
              })
            }
          />

          <Select
            id="category-select"
            label="Category"
            options={categoryOptions}
            value={filters.category}
            onChange={(e) =>
              onFiltersChange({ ...filters, category: e.target.value })
            }
          />

          <Select
            id="quota-select"
            label="Quota"
            options={quotaOptions}
            value={filters.quota}
            onChange={(e) =>
              onFiltersChange({ ...filters, quota: e.target.value })
            }
          />

          <Select
            id="round-select"
            label="Counselling Round"
            options={roundOptions}
            value={filters.round}
            onChange={(e) =>
              onFiltersChange({ ...filters, round: e.target.value })
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!filters.rank || filters.rank <= 0 || isLoading}
          className="w-full sm:w-auto"
        >
          <Search size={16} />
          {isLoading ? 'Searching...' : 'Predict Colleges'}
        </Button>
      </form>
    </Card>
  );
}

export { InputForm };
