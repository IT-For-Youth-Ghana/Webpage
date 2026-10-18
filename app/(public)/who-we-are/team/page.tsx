import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import { TeamDirectory } from "@/components/shared/team-directory";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { teamHub } from "@/lib/content/site-config";
import { pageMetadata } from "@/lib/seo/page-metadata";

/**
 * Metadata reads the same record the page renders, so an editor changing the
 * hub's title or hero photograph changes the search result and the share card
 * with it rather than leaving them behind.
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = (await getCmsSitePage("team")) ?? teamHub;

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: "/who-we-are/team",
    image: page.heroImage,
    imageAlt: page.heroImageAlt,
  });
}

export default async function TeamPage() {
  const [page, members] = await Promise.all([
    getCmsSitePage("team"),
    getCmsTeamMembers(false),
  ]);

  return (
    <>
      <ContentPage page={page ?? teamHub} />
      <TeamDirectory members={members} />
    </>
  );
}
