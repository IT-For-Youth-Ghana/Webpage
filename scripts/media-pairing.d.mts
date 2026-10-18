/**
 * Types for the media-pairing analysis script.
 *
 * The script stays plain JavaScript because it is a CLI first, but its
 * placeholder-gradient detector is imported by
 * components/media/placeholder-policy.test.ts, which type-checks.
 */

/** Gradient elements that render in place of a photograph rather than over one. */
export function findPlaceholderGradients(source: string): string[];
