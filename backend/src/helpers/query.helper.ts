export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function textSearch(fields: string[], q?: string): Record<string, unknown> {
  if (!q?.trim()) return {};
  const rx = new RegExp(escapeRegex(q.trim()), 'i');
  return { $or: fields.map((field) => ({ [field]: rx })) };
}

export function boolFromQuery(value: unknown): boolean | undefined {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

export function numberFromQuery(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function leanDoc<T extends { _id?: unknown }>(doc: T | null | undefined) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc as T & { _id?: unknown; __v?: unknown };
  return { id: _id != null ? String(_id) : undefined, ...rest };
}

export function leanDocs<T extends { _id?: unknown }>(docs: T[]) {
  return docs.map((doc) => leanDoc(doc));
}
