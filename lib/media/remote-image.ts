/**
 * One contract for images whose URL comes from outside the repository.
 *
 * Course records arrive from the live course API and CMS records arrive from
 * Firestore, so an image URL can point anywhere. next/image refuses to optimise
 * a host that next.config.mjs does not list, and the refusal is a runtime
 * throw, not a build error, so an unlisted host breaks the page for a visitor
 * and nobody else.
 *
 * The allowlist below must therefore stay identical to the remotePatterns in
 * next.config.mjs. It previously existed as two hand-copied Sets inside
 * components/programs/course-detail-card.tsx and
 * components/training/training-course-catalog.tsx, with nothing keeping either
 * of them in step with the config. lib/media/remote-image.test.ts now parses
 * next.config.mjs and fails when the two lists drift.
 */
export const ALLOWED_REMOTE_IMAGE_HOSTS = [
  "files.itforyouthghana.org",
  "images.unsplash.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "images.pexels.com",
  "tse2.mm.bing.net",
  "imarticus.org",
  "img.freepik.com",
  "photos.fife.usercontent.google.com",
] as const;

const HOSTS = new Set<string>(ALLOWED_REMOTE_IMAGE_HOSTS);

/**
 * The src next/image can safely render, or null when there is nothing usable.
 *
 * Null is the honest answer and callers must handle it by rendering the
 * typographic MediaFallback. The previous behaviour returned a grey
 * placeholder.svg reading "Image placeholder" in Arial, which is precisely the
 * unfinished-slot artefact the media policy bans.
 */
export function resolveImageSrc(value?: string | null): string | null {
  const src = value?.trim();
  if (!src) return null;

  // A repository-relative path is served by this app and always optimisable.
  if (src.startsWith("/") && !src.startsWith("//")) return src;

  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return null;
    return HOSTS.has(url.hostname) ? src : null;
  } catch {
    return null;
  }
}

/** True when the value points at a host outside this repository. */
export function isExternalImageSrc(value?: string | null): boolean {
  const src = value?.trim();
  if (!src) return false;
  return /^https?:\/\//.test(src);
}
