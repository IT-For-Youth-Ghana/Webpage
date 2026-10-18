/**
 * Types for the route discovery script.
 *
 * The script is a CLI first, so it stays plain JavaScript, but its slug
 * expanders are imported by scripts/discover-routes.test.ts, which type-checks.
 */

/** Slugs declared in an exported array of objects. */
export function slugsIn(source: string, exportName: string): string[];

/** Slugs paired with the category recorded beside each one. */
export function categorisedSlugsIn(
  source: string,
  exportName: string,
): { slug: string; category: string | null }[];
