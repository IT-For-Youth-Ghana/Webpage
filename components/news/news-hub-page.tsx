import { PageSectionRenderer, SectionNavigation } from "@/components/page-sections";
import { buildNewsSections } from "@/lib/content/main-page-sections";
import type { ArticleSeed, NewsHubContent } from "@/types/content";

type Props = { content: NewsHubContent; articles: ArticleSeed[] };

export function NewsHubPage({ content, articles }: Props) {
  const sections = buildNewsSections(content, articles);
  return <div className="overflow-hidden bg-white"><PageSectionRenderer sections={sections.slice(0, 1)} /><SectionNavigation sections={sections} /><PageSectionRenderer sections={sections.slice(1)} /></div>;
}
