import type { PageSection } from "@/types/page-sections";

type SectionNavigationProps = {
  sections: PageSection[];
  label?: string;
};

export function SectionNavigation({ sections, label = "On this page" }: SectionNavigationProps) {
  const links = sections.filter(
    (section) => section.enabled !== false && section.anchor && section.navLabel,
  );

  if (links.length < 2) return null;

  return (
    <nav aria-label={label} className="sticky top-[65px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-8">
        {links.map((section) => (
          <a
            key={section.id}
            href={`#${section.anchor}`}
            className="whitespace-nowrap rounded-capsule border border-brand-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-deep transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            {section.navLabel}
          </a>
        ))}
      </div>
    </nav>
  );
}
