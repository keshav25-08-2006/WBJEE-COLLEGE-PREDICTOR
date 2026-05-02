import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        safe: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        moderate:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        risky: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        neutral:
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
