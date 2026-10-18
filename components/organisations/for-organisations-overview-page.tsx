import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildOrganisationSections } from "@/lib/content/main-page-sections";
import type { OrganisationOverviewContent, OrganisationServicePage } from "@/types/content";

type Props = { content: OrganisationOverviewContent; services: OrganisationServicePage[] };

export function ForOrganisationsOverviewPage({ content, services }: Props) {
  const sections = buildOrganisationSections(content, services);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
