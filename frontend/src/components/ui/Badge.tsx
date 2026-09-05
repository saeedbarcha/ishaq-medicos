import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: ReactNode;
  tone?: 'muted' | 'teal' | 'rx' | 'sale' | 'ok' | 'warn' | 'danger';
  className?: string;
}) {
  const tones = {
    muted: 'bg-mist text-ink/70',
    teal: 'bg-teal-soft text-teal-deep',
    rx: 'bg-[#fde8e4] text-[#e12201]',
    sale: 'bg-[#fde8e4] text-[#b81c01]',
    ok: 'bg-[#e7f4ec] text-[#1f6b43]',
    warn: 'bg-[#f7eedc] text-[#8a5a12]',
    danger: 'bg-[#f8e8e6] text-[#9b2c2c]',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-[0_4px_10px_rgba(18,32,51,0.06)]', tones[tone], className)}>
      {children}
    </span>
  );
}
