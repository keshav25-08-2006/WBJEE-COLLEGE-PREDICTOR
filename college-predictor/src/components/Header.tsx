import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
      </div>

      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/25">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              WBJEE College Predictor
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Find your best-fit college based on your rank
            </p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

export { Header };
