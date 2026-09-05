import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, symbol = 'Rs') {
  return `${symbol} ${new Intl.NumberFormat('en-PK').format(amount)}`;
}

export function discountPercent(price: number, salePrice?: number) {
  if (!salePrice || salePrice >= price) return null;
  return Math.round(((price - salePrice) / price) * 100);
}

export function stockLabel(stock: number, threshold: number) {
  if (stock <= 0) return { label: 'Out of stock', tone: 'danger' as const };
  if (stock <= threshold) return { label: 'Low stock', tone: 'warn' as const };
  return { label: 'In stock', tone: 'ok' as const };
}

export function whatsappUrl(phone: string | undefined, text: string) {
  if (!phone || phone.includes('[')) return null;
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 11) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
