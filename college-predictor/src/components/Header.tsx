import { GraduationCap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const NAV_ITEMS = [
  {
    to: '/wbjee',
    label: 'WBJEE',
    shortLabel: 'WBJEE',
    gradient: 'from-indigo-500 to-violet-600',
    activeGlow: 'shadow-indigo-500/30',
    hoverBg: 'hover:bg-indigo-500/10',
  },
  {
    to: '/jee-main',
    label: 'JEE Main',
    shortLabel: 'JEE Main',
    gradient: 'from-emerald-500 to-teal-600',
    activeGlow: 'shadow-emerald-500/30',
    hoverBg: 'hover:bg-emerald-500/10',
  },
  {
    to: '/jee-advanced',
    label: 'JEE Advanced',
    shortLabel: 'Advanced',
    gradient: 'from-amber-500 to-orange-600',
    activeGlow: 'shadow-amber-500/30',
    hoverBg: 'hover:bg-amber-500/10',
  },
  {
    to: '/csab',
    label: 'CSAB',
    shortLabel: 'CSAB',
    gradient: 'from-purple-500 to-fuchsia-600',
    activeGlow: 'shadow-purple-500/30',
    hoverBg: 'hover:bg-purple-500/10',
  },
];

function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0a0a0f]/70">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Top row: Logo + Theme Toggle */}
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                College Predictor
              </h1>
                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                WBJEE · JEE Main · JEE Advanced · CSAB
              </p>
            </div>
          </NavLink>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        {/* Navigation CTA Buttons */}
        <nav className="mt-4 flex gap-2 sm:gap-3" aria-label="Exam predictor navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition-all duration-300 sm:px-5 sm:py-3 sm:text-base ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.activeGlow} scale-[1.02]`
                    : `text-slate-600 dark:text-slate-400 ${item.hoverBg} hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50`
                }`
              }
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label} Predictor</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { Header };
