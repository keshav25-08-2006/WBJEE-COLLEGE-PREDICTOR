import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import type {
  CollegeData,
  WbjeeCsvRow,
  JeeCsvRow,
  ExamType,
} from '../types/index.js';

const dataStores: Record<ExamType, CollegeData[]> = {
  wbjee: [],
  'jee-main': [],
  'jee-advanced': [],
};

// ─── WBJEE mapper ────────────────────────────────────────────────────
function mapWbjeeRow(row: WbjeeCsvRow): CollegeData | null {
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
    gender: '',
  };
}

// ─── JEE (Main / Advanced) mapper ────────────────────────────────────
function mapJeeRow(row: JeeCsvRow, round: string): CollegeData | null {
  const openingRank = Number(row['Opening Rank']);
  const closingRank = Number(row['Closing Rank']);

  const institute = row.Institute?.trim();
  const program = row['Academic Program Name']?.trim();

  if (
    !institute ||
    !program ||
    Number.isNaN(openingRank) ||
    Number.isNaN(closingRank)
  ) {
    return null;
  }

  return {
    institute,
    program,
    round,
    openingRank,
    closingRank,
    seatType: row['Seat Type']?.trim() ?? '',
    quota: row.Quota?.trim() ?? '',
    category: row['Seat Type']?.trim() ?? '',
    gender: row.Gender?.trim() ?? '',
  };
}

// ─── Generic CSV parser ──────────────────────────────────────────────
function parseCsvFile<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found at: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');

  const { data, errors } = Papa.parse<T>(raw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (errors.length > 0) {
    console.warn(
      `[CSV] ${errors.length} parse warnings in ${path.basename(filePath)}:`,
      errors.slice(0, 3).map((e) => e.message),
    );
  }

  return data;
}

// ─── Load WBJEE CSV ──────────────────────────────────────────────────
function loadWbjee(): void {
  const csvPath = path.resolve(
    import.meta.dirname,
    '../../data/cutoffs.csv',
  );

  const rows = parseCsvFile<WbjeeCsvRow>(csvPath);
  const mapped: CollegeData[] = [];
  let skipped = 0;

  for (const row of rows) {
    const entry = mapWbjeeRow(row);
    if (entry) {
      mapped.push(entry);
    } else {
      skipped++;
    }
  }

  dataStores.wbjee = mapped;
  console.log(
    `[CSV] WBJEE: Loaded ${mapped.length} records (${skipped} skipped)`,
  );
}

// ─── Load JEE CSVs (6 rounds each) ──────────────────────────────────
function loadJeeDataset(exam: 'jee-main' | 'jee-advanced'): void {
  const prefix = exam === 'jee-main' ? 'jee-main' : 'jee-advanced';
  const allMapped: CollegeData[] = [];
  let totalSkipped = 0;

  for (let round = 1; round <= 6; round++) {
    const filename = `${prefix}-round-${round}.csv`;
    const csvPath = path.resolve(
      import.meta.dirname,
      `../../data/${filename}`,
    );

    if (!fs.existsSync(csvPath)) {
      console.warn(`[CSV] File not found, skipping: ${filename}`);
      continue;
    }

    const rows = parseCsvFile<JeeCsvRow>(csvPath);
    let skipped = 0;

    for (const row of rows) {
      const entry = mapJeeRow(row, `Round ${round}`);
      if (entry) {
        allMapped.push(entry);
      } else {
        skipped++;
      }
    }

    totalSkipped += skipped;
  }

  dataStores[exam] = allMapped;
  const label = exam === 'jee-main' ? 'JEE Main' : 'JEE Advanced';
  console.log(
    `[CSV] ${label}: Loaded ${allMapped.length} records (${totalSkipped} skipped) across 6 rounds`,
  );
}

// ─── Public API ──────────────────────────────────────────────────────
export function loadAllCsvs(): void {
  loadWbjee();
  loadJeeDataset('jee-main');
  loadJeeDataset('jee-advanced');
}

/** @deprecated Use loadAllCsvs() instead */
export function loadCsv(): void {
  loadAllCsvs();
}

export function getData(exam: ExamType = 'wbjee'): ReadonlyArray<CollegeData> {
  return dataStores[exam] ?? dataStores.wbjee;
}
