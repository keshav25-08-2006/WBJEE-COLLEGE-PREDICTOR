import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500',
          'dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
);

Input.displayName = 'Input';

export { Input };
