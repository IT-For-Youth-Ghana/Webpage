import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildTrainingSections } from "@/lib/content/main-page-sections";
import type { SitePage, TrainingCohort, TrainingProcessStep } from "@/types/content";

type Props = { page: SitePage; cohorts: TrainingCohort[]; process: TrainingProcessStep[] };

export function ApplyForTrainingOverviewPage({ page, cohorts, process }: Props) {
  const sections = buildTrainingSections(page, cohorts, process);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
