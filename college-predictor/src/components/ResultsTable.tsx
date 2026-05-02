import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  GitBranch,
  TrendingUp,
  TrendingDown,
  Tag,
  SearchX,
  Landmark,
} from 'lucide-react';
import type { CollegeResult, Chance } from '../types';
import { Badge } from './ui/badge';
import { ResultCardSkeleton } from './ui/skeleton';

interface ResultsTableProps {
  results: CollegeResult[];
  isLoading: boolean;
  hasSearched: boolean;
}

const chanceBadgeVariant: Record<Chance, 'safe' | 'moderate' | 'risky'> = {
  Safe: 'safe',
  Moderate: 'moderate',
  Risky: 'risky',
};

const chanceIcons: Record<Chance, string> = {
  Safe: '✅',
  Moderate: '⚡',
  Risky: '⚠️',
};

function ResultsTable({ results, isLoading, hasSearched }: ResultsTableProps) {
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
          <Landmark size={28} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Ready to predict
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Enter your WBJEE rank and select your category to discover matching
          colleges and programs.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
          <SearchX size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          No colleges found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          No colleges match your current rank and filters. Try adjusting your
          category, quota, or round.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {results.map((result, index) => (
          <motion.div
            key={`${result.institute}-${result.program}-${result.category}-${result.quota}-${result.round}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              delay: Math.min(index * 0.04, 0.4),
            }}
          >
            <ResultCard result={result} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result }: { result: CollegeResult }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Building2
              size={14}
              className="shrink-0 text-indigo-500 dark:text-indigo-400"
            />
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {result.institute}
            </h3>
          </div>
          <div className="flex items-center gap-2 pl-[22px]">
            <GitBranch
              size={12}
              className="shrink-0 text-slate-400 dark:text-slate-500"
            />
            <p className="truncate text-sm text-slate-600 dark:text-slate-400">
              {result.program}
            </p>
          </div>
        </div>

        <Badge
          variant={chanceBadgeVariant[result.chance]}
          className="shrink-0"
        >
          {chanceIcons[result.chance]} {result.chance}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Stat
          icon={<TrendingUp size={13} />}
          label="Opening"
          value={result.openingRank.toLocaleString()}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <Stat
          icon={<TrendingDown size={13} />}
          label="Closing"
          value={result.closingRank.toLocaleString()}
          color="text-red-500 dark:text-red-400"
        />
        <Stat
          icon={<Tag size={13} />}
          label="Quota"
          value={result.quota}
          color="text-slate-500 dark:text-slate-400"
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={color}>{icon}</span>
      <span className="text-slate-400 dark:text-slate-500">{label}:</span>
      <span className="font-semibold text-slate-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}

export { ResultsTable };
