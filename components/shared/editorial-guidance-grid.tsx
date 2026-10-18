import { CircularFigure } from "@/components/media/circular-figure";
import { WideFrame } from "@/components/media/wide-frame";
import type { ContentBlock } from "@/types/content";

type EditorialGuidanceGridProps = {
  eyebrow?: string | null;
  sections: ContentBlock[];
};

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

export function EditorialGuidanceGrid({ eyebrow, sections }: EditorialGuidanceGridProps) {
  const visibleSections = sections.filter(
    (section) =>
      hasText(section.title) ||
      hasText(section.body) ||
      section.bullets?.some((paragraph) => hasText(paragraph)),
  );

  if (!visibleSections.length) return null;

  return (
    <div className="grid overflow-hidden border-y border-brand-border lg:grid-cols-2">
      {visibleSections.map((section, index) => {
        const supportingParagraph = section.bullets?.filter(hasText).join(" ");
        const image = section.image?.trim();
        /* The two columns take DIFFERENT treatments. They sit side by side, so
           two identical plates would read as a repeated arrangement; a wide
           frame against a circular figure reads as one composition. */
        const media = !image ? null : index % 2 === 0 ? (
          <WideFrame
            className="relative mt-7 max-w-xl"
            src={image}
            alt={section.imageAlt || section.title}
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        ) : (
          <CircularFigure
            className="relative mt-7 items-start text-left"
            src={image}
            alt={section.imageAlt || section.title}
            size="md"
          />
        );

        return (
          <article
            key={`${section.title}-${index}`}
            className={`relative px-1 py-10 sm:px-8 lg:px-10 lg:py-14 ${
              index > 0 ? "border-t border-brand-border lg:border-l lg:border-t-0" : ""
            }`}
          >
            <div className="absolute right-4 top-7 font-heading text-7xl font-bold leading-none text-brand-mist sm:right-8">
              {String(index + 1).padStart(2, "0")}
            </div>

            {hasText(eyebrow) ? (
              <p className="relative pr-20 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                {eyebrow}
              </p>
            ) : null}

            {hasText(section.title) ? (
              <h2 className="relative mt-4 max-w-xl pr-14 font-heading text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
                {section.title}
              </h2>
            ) : null}

            {hasText(section.body) ? (
              <p className="relative mt-6 max-w-xl text-lg leading-8 text-slate-700">
                {section.body}
              </p>
            ) : null}

            {supportingParagraph ? (
              <div className="relative mt-7 max-w-xl border-l-2 border-brand-accent pl-5 sm:pl-6">
                <p className="text-base leading-8 text-slate-600">{supportingParagraph}</p>
              </div>
            ) : null}

            {media}
          </article>
        );
      })}
    </div>
  );
}
