/**
 * WCAG 2.x relative luminance and contrast ratio.
 *
 * Colour contrast is arithmetic, so it is checked by arithmetic rather than by
 * eye. Used by the design-rule gate tests to keep token pairings honest.
 */

/** Relative luminance of a #rgb or #rrggbb colour, per WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;

  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`relativeLuminance: not a hex colour: ${hex}`);
  }

  const [r, g, b] = [0, 2, 4]
    .map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    ) as [number, number, number];

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG AA: 4.5:1 for body text, 3:1 for large text (>=24px, or >=19px bold). */
export function meetsAA(
  foreground: string,
  background: string,
  size: "body" | "large" = "body",
): boolean {
  return contrastRatio(foreground, background) >= (size === "large" ? 3 : 4.5);
}
