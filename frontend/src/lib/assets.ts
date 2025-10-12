const BASE = import.meta.env.VITE_ASSET_BASE_URL || 'http://localhost:5000';

/**
 * Accepts:
 *  - full http(s) URLs (returns as-is)
 *  - "/uploads/..." (prefixes with base)
 *  - plain filenames like "behavior-1.jpg" (resolves to /uploads/articles/<name>)
 */
export function resolveArticleImage(input?: string): string {
  if (!input) return `${BASE}/uploads/articles/placeholder.jpg`;
  const s = input.trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/uploads/')) return `${BASE}${s}`;
  return `${BASE}/uploads/articles/${s}`;
}