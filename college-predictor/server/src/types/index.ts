export type ExamType = 'wbjee' | 'jee-main' | 'jee-advanced' | 'csab';

export interface CollegeData {
  institute: string;
  program: string;
  round: string;
  openingRank: number;
  closingRank: number;
  seatType: string;
  quota: string;
  category: string;
  gender: string;
}

export type Chance = 'Safe' | 'Moderate' | 'Risky';

export interface PredictionResult extends CollegeData {
  chance: Chance;
}

export interface PredictQuery {
  exam: string;
  rank: string;
  category: string;
  quota?: string;
  round?: string;
  seatType?: string;
  gender?: string;
  year?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export interface PaginatedResponse {
  results: PredictionResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// WBJEE CSV has lowercase/snake_case headers
export interface WbjeeCsvRow {
  institute: string;
  program: string;
  round: string;
  opening_rank: string;
  closing_rank: string;
  seat_type: string;
  quota: string;
  category: string;
}

// JEE CSVs have proper-case headers from JoSAA data
export interface JeeCsvRow {
  Institute: string;
  'Academic Program Name': string;
  Quota: string;
  'Seat Type': string;
  Gender: string;
  'Opening Rank': string;
  'Closing Rank': string;
}
