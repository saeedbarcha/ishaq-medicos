import { products } from './products';

export const medicines = products.filter((p) => p.kind === 'medicine');
export const surgicalProducts = products.filter((p) => p.kind === 'surgical');
export const cosmetics = products.filter((p) => p.kind === 'cosmetic' || p.kind === 'personal-care');
