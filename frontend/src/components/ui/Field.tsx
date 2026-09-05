import type { LabelHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink shadow-[0_4px_12px_rgba(18,32,51,0.03)] placeholder:text-ink/40 transition focus:border-teal focus:shadow-[0_0_0_4px_rgba(0,167,212,0.12)] focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-[0_4px_12px_rgba(18,32,51,0.03)] placeholder:text-ink/40 transition focus:border-teal focus:shadow-[0_0_0_4px_rgba(0,167,212,0.12)] focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}
