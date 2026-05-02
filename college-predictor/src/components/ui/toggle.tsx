import { cn } from '../../lib/utils';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  className?: string;
}

function Toggle({ label, checked, onChange, id, className }: ToggleProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none"
      >
        {label}
      </label>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          checked
            ? 'bg-indigo-600 dark:bg-indigo-500'
            : 'bg-slate-200 dark:bg-slate-700',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}

export { Toggle };
