import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({
  compact = false,
  onDark = false,
  className,
}: {
  compact?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link to="/" className={cn('group flex items-center transition hover:opacity-90', className)} aria-label="Ishaq Medicos home">
      <img
        src={compact ? '/images/brand/mark.png' : '/images/brand/logo.png'}
        alt="Ishaq Medicos — Surgical and Cosmetics"
        className={cn(
          'w-auto shrink-0 object-contain object-left',
          compact ? 'h-11' : onDark ? 'h-14 sm:h-16' : 'h-12 sm:h-14',
        )}
      />
    </Link>
  );
}
