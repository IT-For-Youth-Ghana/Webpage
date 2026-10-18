/**
 * Colour guards for CMS-supplied values that get interpolated into styles.
 *
 * Hero slide colours reach the renderer through
 * `heroSlides: z.array(z.unknown())` in lib/utils/validators.ts, so nothing on
 * the write path constrains their shape. React assigns these through the CSSOM
 * rather than innerHTML, so a malformed value cannot escape its property and
 * this is not an injection boundary. It is a correctness boundary: an empty or
 * malformed value silently produces an invisible ring or a transparent wash,
 * and a caller that falls back explicitly is easier to reason about than one
 * that ships a broken gradient.
 *
 * Deliberately an allowlist of the notations the content model actually uses,
 * rather than an attempt to parse all of CSS Color.
 */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB = /^rgba?\(\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*){2}(?:,\s*[\d.]+%?\s*)?\)$/i;
const HSL = /^hsla?\(\s*[\d.]+(?:deg|rad|turn)?\s*(?:,\s*[\d.]+%\s*){2}(?:,\s*[\d.]+%?\s*)?\)$/i;

/** True when the value is a colour notation this codebase is willing to emit. */
export function isCssColor(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return HEX.test(trimmed) || RGB.test(trimmed) || HSL.test(trimmed);
}

/** The value when it is a usable colour, otherwise the fallback. */
export function safeCssColor(value: unknown, fallback: string): string {
  return isCssColor(value) ? value.trim() : fallback;
}
