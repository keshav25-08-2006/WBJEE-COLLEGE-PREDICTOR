import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-200',
        'dark:border-slate-800 dark:bg-slate-900/60',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
