export type ExamType = 'wbjee' | 'jee-main' | 'jee-advanced';

export type Chance = 'Safe' | 'Moderate' | 'Risky';

export type SortField = 'closingRank' | 'institute';

export type SortOrder = 'asc' | 'desc';

export interface CollegeResult {
  institute: string;
  program: string;
  round: string;
  openingRank: number;
  closingRank: number;
  seatType: string;
  quota: string;
  category: string;
  gender: string;
  chance: Chance;
}

export interface FilterState {
  rank: number | null;
  category: string;
  quota: string;
  round: string;
  gender: string;
}

export interface SearchFilters {
  query: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface PaginatedResponse {
  results: CollegeResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  categories: string[];
  quotas: string[];
  rounds: string[];
  seatTypes: string[];
  genders: string[];
}

export interface ExamConfig {
  examType: ExamType;
  title: string;
  subtitle: string;
  rankLabel: string;
  rankMax: number;
  showQuota: boolean;
  showGender: boolean;
  showRound: boolean;
  accentColor: string;
  defaultFilters: FilterState;
}
