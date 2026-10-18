/**
 * Seed fallback for CMS array fields.
 *
 * The homepage readers previously wrote this inline as:
 *
 *   const cards = getDocField<unknown[]>(data, "joinCtaCards") ?? [];
 *   if (!Array.isArray(cards)) return seedJoinCtaCards;
 *   return cards as JoinCtaCard[];
 *
 * The `?? []` turned a missing field into an empty array, which then passed the
 * Array.isArray check, so the seed fallback was skipped and the section
 * silently disappeared from the page. That is how the homepage's
 * join-the-movement cards vanished: the Firestore document simply had no
 * joinCtaCards field.
 *
 * An absent or empty array means unconfigured, not deliberately empty. Sections
 * are hidden with `active: false` on the item, never by emptying the array, so
 * falling back to seed content is the correct behaviour and is the intentional
 * resilience the content model was built around.
 */
export function resolveCmsArray<T>(value: unknown, seed: T[]): T[] {
  if (!Array.isArray(value) || value.length === 0) return seed;
  return value as T[];
}

/**
 * Seed fallback for a single CMS object field. Present for symmetry with
 * resolveCmsArray, so both cases read the same way at the call site.
 */
export function resolveCmsValue<T>(value: T | null | undefined, seed: T): T {
  return value ?? seed;
}
