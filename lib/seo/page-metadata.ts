import type { Metadata } from "next";

import { siteMeta } from "@/lib/content/site-config";
import { resolveImageSrc } from "@/lib/media/remote-image";

export const SITE_ORIGIN = "https://itforyouthghana.org";

/**
 * The organisation's mark, used when a page has no photograph of its own.
 *
 * A share card with no image is rendered by every platform as a bare link, so
 * the default is the logo rather than nothing. It is square, which Twitter and
 * Slack accept; a page that has a real landscape photograph should pass it.
 */
const DEFAULT_OG_IMAGE = "/images/logo/logo.png";

export type PageMetadataInput = {
  /** Page name only. The layout appends the organisation name. */
  title: string;
  description: string;
  /** Route path, leading slash, no origin and no trailing slash. */
  path: string;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article";
  /** Set for pages that must not be indexed, such as an unresolved record. */
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  /** Article bylines. Ignored for type "website", which has no author. */
  authors?: string[];
};

/**
 * One metadata contract for every public page.
 *
 * Two things were missing everywhere and neither fails a build. There was no
 * canonical URL on any route, which matters on a site carrying 27 permanent
 * redirects and, until recently, three URLs for every course. And twenty
 * routes had no openGraph block at all, so a shared link rendered as a bare
 * URL with the layout's default description.
 *
 * Building metadata by hand per page is how those gaps appeared, so pages call
 * this instead, and app/metadata-titles.test.ts checks that they do.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataInput): Metadata {
  const canonical = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const resolved = resolveImageSrc(image) ?? DEFAULT_OG_IMAGE;
  const alt = imageAlt?.trim() || `${siteMeta.siteName}: ${title}`;

  return {
    title,
    description,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      ...siteMeta.openGraph,
      type,
      title,
      description,
      url: `${SITE_ORIGIN}${canonical}`,
      images: [{ url: resolved, alt }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(type === "article" && authors?.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolved],
    },
  };
}
