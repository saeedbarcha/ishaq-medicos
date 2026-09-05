export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function uniqueSlug(
  value: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const base = slugify(value) || `item-${Date.now()}`;
  let slug = base;
  let n = 1;
  while (await exists(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
