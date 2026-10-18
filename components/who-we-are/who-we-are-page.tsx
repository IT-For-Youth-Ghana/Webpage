import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildWhoWeAreSections } from "@/lib/content/main-page-sections";
import type { SitePage } from "@/types/content";

export function WhoWeArePage({ page }: { page: SitePage }) {
  const sections = buildWhoWeAreSections(page);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
