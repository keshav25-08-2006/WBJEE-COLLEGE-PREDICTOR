export interface CollegeData {
  institute: string;
  program: string;
  round: string;
  openingRank: number;
  closingRank: number;
  seatType: string;
  quota: string;
  category: string;
}

export type Chance = 'Safe' | 'Moderate' | 'Risky';

export interface PredictionResult extends CollegeData {
  chance: Chance;
}

export interface PredictQuery {
  rank: string;
  category: string;
  quota?: string;
  round?: string;
  seatType?: string;
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

export interface CsvRow {
  institute: string;
  program: string;
  round: string;
  opening_rank: string;
  closing_rank: string;
  seat_type: string;
  quota: string;
  category: string;
}
