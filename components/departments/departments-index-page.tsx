import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildDepartmentsSections } from "@/lib/content/main-page-sections";
import type { DepartmentProfile } from "@/types/content";

export function DepartmentsIndexPage({ departments }: { departments: DepartmentProfile[] }) {
  const sections = buildDepartmentsSections(departments);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
