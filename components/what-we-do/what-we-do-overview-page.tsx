import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildWhatWeDoSections } from "@/lib/content/main-page-sections";
import type { InitiativePage, WhatWeDoOverviewContent } from "@/types/content";

type Props = { content: WhatWeDoOverviewContent; initiatives: InitiativePage[] };

export function WhatWeDoOverviewPage({ content, initiatives }: Props) {
  const sections = buildWhatWeDoSections(content, initiatives);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
