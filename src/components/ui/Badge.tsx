import { ReactNode } from 'react';

type BadgeVariant = 'orange' | 'teal' | 'amber' | 'red' | 'green' | 'gray' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  orange: 'bg-craft-orange-muted text-craft-orange border border-craft-orange/20',
  teal: 'bg-craft-teal-muted text-craft-teal border border-craft-teal/20',
  amber: 'bg-craft-amber-muted text-craft-amber border border-craft-amber/20',
  red: 'bg-craft-red-muted text-craft-red border border-craft-red/20',
  green: 'bg-craft-green-muted text-craft-green border border-craft-green/20',
  gray: 'bg-craft-surface2 text-craft-gray-400 border border-craft-border',
  outline: 'bg-transparent text-craft-gray-200 border border-craft-border',
};

const dotColors: Record<BadgeVariant, string> = {
  orange: 'bg-craft-orange',
  teal: 'bg-craft-teal',
  amber: 'bg-craft-amber',
  red: 'bg-craft-red',
  green: 'bg-craft-green',
  gray: 'bg-craft-gray-400',
  outline: 'bg-craft-gray-400',
};

export const Badge = ({
  variant = 'gray',
  children,
  size = 'sm',
  className = '',
  dot = false,
}: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 font-semibold rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      variantClasses[variant],
      className,
    ].join(' ')}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
    )}
    {children}
  </span>
);

export const LiveBadge = ({ className = '' }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-craft-red-muted text-craft-red border border-craft-red/30 ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-craft-red animate-pulse-dot" />
    LIVE
  </span>
);

export const NewBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-craft-orange text-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;
