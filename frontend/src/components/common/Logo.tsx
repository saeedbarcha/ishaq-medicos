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
  const mark = '/images/brand/mark.png';
  return (
    <Link to="/" className={cn('group flex items-center gap-2.5 transition hover:opacity-90', className)} aria-label="Ishaq Medicos home">
      <img
        src={mark}
        alt=""
        className={cn('w-auto shrink-0 object-contain object-left', compact ? 'h-10' : 'h-11 sm:h-12')}
      />
      {!compact && (
        <span className="leading-none">
          <span className="font-brand block text-[1.35rem] tracking-tight sm:text-[1.5rem]">
            <span className="text-teal">Ishaq</span> <span className="text-brass">Medicos</span>
          </span>
          <span className={cn('mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em]', onDark ? 'text-white/65' : 'text-ink/50')}>
            Medical · Surgical · Cosmetics
          </span>
        </span>
      )}
    </Link>
  );
}
