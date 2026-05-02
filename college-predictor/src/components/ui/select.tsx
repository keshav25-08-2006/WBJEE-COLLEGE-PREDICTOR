import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 shadow-sm transition-all duration-200',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100',
          'dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%2394a3b8%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M7.247%2011.14%202.451%205.658C1.885%205.013%202.345%204%203.204%204h9.592a1%201%200%20010%20.753l-4.796%205.48a1%201%200%2001-1.506%200z%22%2F%3E%3C%2Fsvg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
);

Select.displayName = 'Select';

export { Select };
