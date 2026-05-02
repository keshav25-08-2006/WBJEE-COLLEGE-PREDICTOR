import type { CollegeResult, SortField, SortOrder, SearchFilters } from '../types';

export function applyClientFilters(
  results: CollegeResult[],
  search: SearchFilters,
): CollegeResult[] {
  let filtered = results;

  if (search.query.trim()) {
    const q = search.query.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.institute.toLowerCase().includes(q) ||
        r.program.toLowerCase().includes(q),
    );
  }

  return sortResults(filtered, search.sortField, search.sortOrder);
}

function sortResults(
  results: CollegeResult[],
  field: SortField,
  order: SortOrder,
): CollegeResult[] {
  const sorted = [...results].sort((a, b) => {
    if (field === 'closingRank') {
      return a.closingRank - b.closingRank;
    }
    return a.institute.localeCompare(b.institute);
  });

  return order === 'desc' ? sorted.reverse() : sorted;
}
