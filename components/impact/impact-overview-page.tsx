import type { Partner } from "@/components/home/patrners-strip";
import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildImpactSections } from "@/lib/content/main-page-sections";
import type { ImpactOverviewContent } from "@/types/content";

type Props = { content: ImpactOverviewContent; partners: Partner[] };

export function ImpactOverviewPage({ content, partners }: Props) {
  const sections = buildImpactSections(content, partners);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
