import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildPartnershipSections } from "@/lib/content/main-page-sections";
import type { PartnershipOverviewContent, PartnershipTrackPage } from "@/types/content";

type Props = { content: PartnershipOverviewContent; tracks: PartnershipTrackPage[] };

export function PartnerWithUsOverviewPage({ content, tracks }: Props) {
  const sections = buildPartnershipSections(content, tracks);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
