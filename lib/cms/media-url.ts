// The renderer's host contract, imported rather than copied. next/image refuses
// an unlisted host with a runtime throw, so an off-allowlist URL that passes
// validation is a page that 500s for a visitor and nobody else.
// lib/media/remote-image.test.ts keeps that list identical to next.config.mjs.
import { ALLOWED_REMOTE_IMAGE_HOSTS } from "../media/remote-image.ts";

const ALLOWED_MEDIA_HOSTS = new Set<string>(ALLOWED_REMOTE_IMAGE_HOSTS);

/**
 * Why a media URL will not render, or null when it will.
 *
 * One function for two callers: lib/utils/validators.ts rejects the save, and
 * components/admin/media-fields.tsx shows the same sentence under the input as
 * the editor types. Before this existed the admin accepted any string, answered
 * "saved", and the public page threw at request time on an unlisted host, which
 * is a production failure with no signal anywhere an editor could see it.
 *
 * This module deliberately imports nothing but the allowlist, so an admin client
 * component can use it without pulling Zod or any Firebase code into the bundle.
 *
 * Repository-relative paths are served by this app and always render, matching
 * resolveImageSrc (lib/media/remote-image.ts:44). Video URLs are NOT checked
 * here: they point at YouTube or Vimeo, which are not image hosts.
 */
export function describeMediaUrlProblem(value?: string | null): string | null {
  const src = value?.trim();
  if (!src) return null;

  if (src.startsWith("/") && !src.startsWith("//")) return null;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return "Use a full https:// address, or a path starting with / for an image in this repository.";
  }

  if (url.protocol !== "https:") {
    return "Media must be served over https.";
  }

  if (!ALLOWED_MEDIA_HOSTS.has(url.hostname)) {
    return `${url.hostname} is not an approved image host, so this image would not render. Approved hosts: ${ALLOWED_REMOTE_IMAGE_HOSTS.join(", ")}.`;
  }

  return null;
}

/** The message shown beside an image field whose alt text is still empty. */
export const MISSING_ALT_MESSAGE =
  "Describe what is happening in the photograph. An image with no alt text is invisible to a screen-reader user.";
