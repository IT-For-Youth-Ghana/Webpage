/**
 * Splits a heading into a leading clause and a trailing clause.
 *
 * Extracted from the previous hero implementation unchanged, so the design
 * prototype and production agree on exactly where a headline breaks. In the
 * capsule the split earns a second job: the trailing clause drops to a lighter
 * tone, giving the serif headline a two-beat editorial read instead of one
 * undifferentiated block.
 */
export function splitHeading(heading: string): { first: string; second: string } {
  const words = heading.trim().split(/\s+/);

  if (words.length <= 2) {
    return { first: heading, second: "" };
  }

  const splitPoint = Math.max(1, Math.ceil(words.length * 0.52));

  return {
    first: words.slice(0, splitPoint).join(" "),
    second: words.slice(splitPoint).join(" "),
  };
}
