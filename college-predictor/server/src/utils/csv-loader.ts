import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import type {
  CollegeData,
  WbjeeCsvRow,
  JeeCsvRow,
  ExamType,
} from '../types/index.js';

const dataStores: Record<Exclude<ExamType, 'wbjee'>, CollegeData[]> = {
  'jee-main': [],
  'jee-advanced': [],
  csab: [],
};

// WBJEE data is kept per-year (e.g. cutoffs-2025.csv, cutoffs-2024.csv)
const wbjeeByYear: Record<string, CollegeData[]> = {};
let wbjeeDefaultYear = '2025';

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
function mapJeeRow(row: Record<string, string>, round: string): CollegeData | null {
  // helper to lookup a field using multiple possible header variants
  const get = (variants: string[]) => {
    for (const v of variants) {
      if (v in row && row[v] != null) {
        const s = String(row[v]).trim();
        if (s !== '') return s;
      }
      const lower = v.toLowerCase();
      for (const key of Object.keys(row)) {
        if (key.toLowerCase() === lower && row[key] != null) {
          const s = String(row[key]).trim();
          if (s !== '') return s;
        }
      }
    }
    return undefined;
  };

  const openingStr = get(['Opening Rank', 'opening_rank', 'opening rank', 'openingrank']);
  const closingStr = get(['Closing Rank', 'closing_rank', 'closing rank', 'closingrank']);

  const openingRank = Number(openingStr ?? '');
  const closingRank = Number(closingStr ?? '');

  const institute = get(['Institute', 'institute', 'institute_▲▼', 'institute_']);
  const program = get(['Academic Program Name', 'program', 'academic_program_name', 'academic program name']);

  if (!institute || !program || Number.isNaN(openingRank) || Number.isNaN(closingRank)) {
    return null;
  }

  return {
    institute,
    program,
    round,
    openingRank,
    closingRank,
    seatType: get(['Seat Type', 'seat_type', 'seat type']) ?? '',
    quota: get(['Quota', 'quota']) ?? '',
    category: get(['Seat Type', 'category']) ?? '',
    gender: get(['Gender', 'gender']) ?? '',
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
    transformHeader: (header: string) =>
      header
        .trim()
        .toLowerCase()
        // replace non-word characters with underscore
        .replace(/[^a-z0-9]+/g, '_')
        // collapse multiple underscores
        .replace(/__+/g, '_')
        // trim leading/trailing underscores
        .replace(/^_+|_+$/g, ''),
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
  const dataDir = path.resolve(import.meta.dirname, '../../data');
  const files = fs.readdirSync(dataDir);

  const pattern = /^cutoffs(?:-(\d{4}))?\.csv$/i;
  let foundAny = false;

  for (const filename of files) {
    const m = filename.match(pattern);
    if (!m) continue;
    foundAny = true;

    const year = m[1] ?? wbjeeDefaultYear;
    const csvPath = path.join(dataDir, filename);

    try {
      const rows = parseCsvFile<WbjeeCsvRow>(csvPath);
      const mapped: CollegeData[] = [];
      let skipped = 0;
      let removedForJeeMain = 0;

      for (const row of rows) {
        // For 2024 WBJEE data, skip rows that correspond to JEE(Main) seats
        // Some CSVs label this as 'JEE(Main) Seats' or similar; match flexibly.
        if (year === '2024') {
          const seatVal = String(row.seat_type ?? '');
          if (/jee\s*\(?\s*main\s*\)?/i.test(seatVal)) {
            removedForJeeMain++;
            continue;
          }
        }

        const entry = mapWbjeeRow(row);
        if (entry) mapped.push(entry);
        else skipped++;
      }

      wbjeeByYear[year] = mapped;
      console.log(`[CSV] WBJEE ${year}: Loaded ${mapped.length} records (${skipped} skipped, ${removedForJeeMain} removed for JEE(Main) seats) from ${filename}`);
    } catch (err) {
      console.warn(`[CSV] Failed to parse WBJEE file: ${filename}`, err instanceof Error ? err.message : err);
    }
  }

  if (!foundAny) {
    console.warn('[CSV] No WBJEE cutoffs CSV files found (expected cutoffs.csv or cutoffs-YYYY.csv)');
  }
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

// ─── Load CSAB CSVs (3 rounds) ───────────────────────────────────────
function loadCsabDataset(): void {
  const prefix = 'csab';
  const allMapped: CollegeData[] = [];
  let totalSkipped = 0;

  for (let round = 1; round <= 3; round++) {
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

  dataStores.csab = allMapped;
  console.log(`[CSV] CSAB: Loaded ${allMapped.length} records (${totalSkipped} skipped) across 3 rounds`);
}

// ─── Public API ──────────────────────────────────────────────────────
export function loadAllCsvs(): void {
  loadWbjee();
  loadJeeDataset('jee-main');
  loadJeeDataset('jee-advanced');
  loadCsabDataset();
}

/** @deprecated Use loadAllCsvs() instead */
export function loadCsv(): void {
  loadAllCsvs();
}

export function getData(exam: ExamType = 'wbjee', year?: string): ReadonlyArray<CollegeData> {
  if (exam === 'wbjee') {
    if (year && wbjeeByYear[year]) return wbjeeByYear[year];
    // fallback to default year if available
    if (wbjeeByYear[wbjeeDefaultYear]) return wbjeeByYear[wbjeeDefaultYear];
    // otherwise return concatenated data across years
    return Object.values(wbjeeByYear).flat();
  }

  return dataStores[exam as Exclude<ExamType, 'wbjee'>] ?? [];
}

export function getAvailableYears(exam: ExamType = 'wbjee'): string[] {
  if (exam !== 'wbjee') return [];
  return Object.keys(wbjeeByYear).sort().reverse();
}
