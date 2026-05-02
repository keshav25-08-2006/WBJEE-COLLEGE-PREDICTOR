import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import type { CollegeData, CsvRow } from '../types/index.js';

let dataStore: CollegeData[] = [];

function mapRow(row: CsvRow): CollegeData | null {
  const openingRank = Number(row.opening_rank);
  const closingRank = Number(row.closing_rank);

  if (
    !row.institute?.trim() ||
    !row.program?.trim() ||
    Number.isNaN(openingRank) ||
    Number.isNaN(closingRank)
  ) {
    return null;
  }

  return {
    institute: row.institute.trim(),
    program: row.program.trim(),
    round: row.round?.trim() ?? '',
    openingRank,
    closingRank,
    seatType: row.seat_type?.trim() ?? '',
    quota: row.quota?.trim() ?? '',
    category: row.category?.trim() ?? '',
  };
}

export function loadCsv(csvPath?: string): void {
  const resolvedPath =
    csvPath ?? path.resolve(import.meta.dirname, '../../data/cutoffs.csv');

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`CSV file not found at: ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8');

  const { data, errors } = Papa.parse<CsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (errors.length > 0) {
    console.warn(
      `[CSV] ${errors.length} parse warnings:`,
      errors.slice(0, 5).map((e) => e.message),
    );
  }

  const mapped: CollegeData[] = [];
  let skipped = 0;

  for (const row of data) {
    const entry = mapRow(row);
    if (entry) {
      mapped.push(entry);
    } else {
      skipped++;
    }
  }

  dataStore = mapped;

  console.log(
    `[CSV] Loaded ${dataStore.length} records (${skipped} skipped) from ${path.basename(resolvedPath)}`,
  );
}

export function getData(): ReadonlyArray<CollegeData> {
  return dataStore;
}
