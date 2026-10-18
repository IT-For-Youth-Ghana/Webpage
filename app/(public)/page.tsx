import type { Metadata } from "next";

import { HomepageSections } from "@/components/home/homepage-sections";
import { siteMeta } from "@/lib/content/site-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

/**
 * The homepage had no metadata of its own, so it inherited the layout default
 * and shipped with no canonical URL and no share card.
 */
export const metadata: Metadata = pageMetadata({
  title: "Digital skills and real opportunity for young Ghanaians",
  description: siteMeta.description,
  path: "/",
  imageAlt: "The IT For Youth Ghana mark",
});

export default function HomePage() {
  return <HomepageSections />;
}
