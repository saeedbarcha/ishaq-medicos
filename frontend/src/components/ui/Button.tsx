import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-tight transition-all duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-teal text-white shadow-[0_10px_22px_rgba(1,97,141,0.28)] hover:-translate-y-0.5 hover:bg-teal-deep hover:shadow-[0_16px_30px_rgba(1,97,141,0.34)]',
        navy: 'bg-navy text-white shadow-[0_10px_22px_rgba(18,24,32,0.2)] hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_16px_30px_rgba(18,24,32,0.28)]',
        outline: 'border border-line bg-white text-ink shadow-[0_6px_16px_rgba(18,24,32,0.04)] hover:-translate-y-0.5 hover:border-teal hover:text-teal hover:shadow-[0_12px_24px_rgba(1,97,141,0.12)]',
        ghost: 'text-ink hover:bg-teal-soft',
        brass: 'bg-brass text-white shadow-[0_10px_22px_rgba(1,85,122,0.28)] hover:-translate-y-0.5 hover:bg-[#014866] hover:shadow-[0_16px_30px_rgba(1,85,122,0.35)]',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-base',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
