import Link from "next/link";
import type { ReactNode } from "react";

import { ContentImage } from "@/components/media/content-image";
import { OffsetFrames } from "@/components/media/offset-frames";
import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";
import { Button } from "@/components/ui/button";
import { splitTitleEmphasis } from "@/lib/page-sections/title-emphasis";
import { cn } from "@/lib/utils/cn";
import type {
  CallToActionSection,
  EditorialIntroSection,
  FeatureCollectionSection,
  LinkedIndexSection,
  MediaNarrativeSection,
  MetricStorySection,
  PageSection,
  PageSectionTheme,
  ProcessPathSection,
  PublicationFeedSection,
  RelationshipMapSection,
  SectionActionContent,
  SectionHeadingContent,
  SectionItemContent,
  StoryQuoteSection,
} from "@/types/page-sections";

import { EditorialHero } from "./editorial-hero";

const themeClasses: Record<PageSectionTheme, string> = {
  paper: "bg-white text-brand-ink",
  warm: "bg-brand-warm text-brand-ink",
  mist: "bg-brand-mist text-brand-ink",
  navy: "bg-brand-deep text-white",
  // Compatibility names retained in the persisted contract. The approved
  // site palette remains blue/crimson, so these map to its closest roles.
  teal: "bg-brand-primary-dark text-white",
  gold: "bg-brand-accent text-white",
};

function SectionShell({
  section,
  children,
  className,
}: {
  section: PageSection;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={section.anchor}
      data-section-id={section.id}
      data-component-type={section.componentType}
      data-variant={section.variant}
      className={cn(
        "scroll-mt-32 px-4 py-[var(--section-space)] sm:px-6 lg:px-8",
        themeClasses[section.theme ?? "paper"],
        className,
      )}
    >
      <div className="mx-auto max-w-[1240px]">{children}</div>
    </section>
  );
}

/** navy and teal panels are dark; the gold theme maps to the crimson accent itself. */
function isDarkTheme(theme?: PageSectionTheme): boolean {
  return theme === "navy" || theme === "teal" || theme === "gold";
}

function Eyebrow({ children, onDark = false, onAccent = false }: { children?: string; onDark?: boolean; onAccent?: boolean }) {
  if (!children) return null;
  const accented = onDark && !onAccent;
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.5rem] font-bold uppercase tracking-[0.18em] lg:text-[3.0rem]",
        onAccent ? "text-white" : accented ? "text-brand-accent-on-dark" : "text-brand-primary-dark",
      )}
    >
      <span aria-hidden="true" className={cn("h-0.5 w-6", accented ? "bg-current" : "bg-brand-accent")} />
      {children}
    </p>
  );
}

/**
 * The section headline in two voices, the same counterpoint the hero uses: a
 * plain setup, then one phrase in the display serif's italic and the accent
 * colour. On paper the accent is the logo crimson; on a dark panel it is the
 * on-dark tint, because the logo crimson only reaches 2.8:1 against navy.
 */
function AccentedTitle({ title, titleAccent, onDark = false }: { title: string; titleAccent?: string; onDark?: boolean }) {
  return (
    <>
      {splitTitleEmphasis(title, titleAccent).map((segment, index) =>
        segment.accent ? (
          <em key={index} className={cn("italic", onDark ? "text-brand-accent-on-dark" : "text-brand-accent")}>
            {segment.text}
          </em>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

function EditorialHeading({
  heading,
  onDark = false,
  onAccent = false,
  centered = false,
}: {
  heading: SectionHeadingContent;
  onDark?: boolean;
  onAccent?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
      <div className={cn(centered && "flex justify-center")}><Eyebrow onDark={onDark} onAccent={onAccent}>{heading.eyebrow}</Eyebrow></div>
      <h2 className={cn("mt-4 font-heading text-[clamp(2.6rem,5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.035em]", onDark ? "text-white" : "text-brand-deep")}>
        <AccentedTitle title={heading.title} titleAccent={heading.titleAccent} onDark={onDark && !onAccent} />
      </h2>
      {heading.body ? <p className={cn("mt-6 max-w-[68ch] text-base leading-8", centered && "mx-auto", onDark ? "text-white/78" : "text-brand-muted")}>{heading.body}</p> : null}
    </div>
  );
}

const actionVariants = {
  gold: "primary",
  navy: "dark",
  light: "white",
  text: "outline",
} as const;

function Actions({ actions }: { actions?: SectionActionContent[] }) {
  if (!actions?.length) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <Button
          key={`${action.href}-${action.label}`}
          href={action.href}
          size="lg"
          variant={actionVariants[action.style ?? (index === 0 ? "gold" : "navy")]}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function ItemCopy({ item, onDark = false }: { item: SectionItemContent; onDark?: boolean }) {
  return (
    <div>
      {item.eyebrow ? <Eyebrow onDark={onDark}>{item.eyebrow}</Eyebrow> : null}
      <h3 className={cn("mt-3 font-heading text-3xl font-bold leading-tight", onDark ? "text-white" : "text-brand-deep")}>{item.title}</h3>
      {item.body ? <p className={cn("mt-4 text-base leading-7", onDark ? "text-white/75" : "text-brand-muted")}>{item.body}</p> : null}
      {item.bullets?.length ? (
        <ul className="mt-5 grid list-none gap-2 p-0">
          {item.bullets.map((bullet) => (
            <li key={bullet} className={cn("flex gap-3 text-sm leading-7", onDark ? "text-white/75" : "text-brand-muted")}>
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-capsule bg-brand-accent" />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {item.action ? (
        <Link href={item.action.href} className={cn("mt-6 inline-flex font-bold underline decoration-brand-accent decoration-2 underline-offset-4", onDark ? "text-white" : "text-brand-deep")}>
          {item.action.label}<span aria-hidden="true" className="ml-2">→</span>
        </Link>
      ) : null}
    </div>
  );
}

/**
 * A statement of belief, not a content block: one short declaration at display
 * size, a single portrait beside it, and the concentric rings the template uses
 * to keep the panel from reading as a slab of flat navy.
 *
 * Split out from the other editorialIntro variants because it inverts them. The
 * split and centered variants lead with supporting copy and let the heading
 * introduce it; the manifesto leads with the statement and lets everything else
 * sit underneath it.
 */
function Manifesto({ section }: { section: EditorialIntroSection }) {
  const onDark = isDarkTheme(section.theme);
  const onAccent = section.theme === "gold";
  const accentedHeadline = onDark && !onAccent;

  return (
    <SectionShell section={section} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-40 -top-24 hidden h-[420px] w-[420px] rounded-capsule border lg:block",
          onDark ? "border-white/12" : "border-brand-deep/10",
        )}
      >
        <span className={cn("absolute inset-14 rounded-capsule border", onDark ? "border-white/10" : "border-brand-deep/10")} />
        <span
          className={cn(
            "absolute inset-28 rounded-capsule border",
            onDark ? "border-white/10 bg-brand-accent/10" : "border-brand-deep/10 bg-brand-accent/5",
          )}
        />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-14">
        <div className="lg:self-start">
          <Eyebrow onDark={onDark} onAccent={onAccent}>{section.heading.eyebrow}</Eyebrow>
          {section.media ? (
            <ContentImage
              src={section.media.src}
              alt={section.media.alt}
              aspectRatio="portrait"
              fallbackLabel={section.heading.title}
              className="mt-8 rounded-t-[999px] shadow-editorial"
            />
          ) : null}
        </div>

        <div>
          <h2
            className={cn(
              "font-heading text-[clamp(2.9rem,5.6vw,6.2rem)] font-bold leading-[1.02] tracking-[-0.035em]",
              onDark ? "text-white" : "text-brand-deep",
            )}
          >
            <AccentedTitle title={section.heading.title} titleAccent={section.heading.titleAccent} onDark={accentedHeadline} />
          </h2>
          {section.heading.body ? (
            <p className={cn("mt-7 max-w-[58ch] text-[1.05rem] leading-[1.75]", onDark ? "text-white/[0.72]" : "text-brand-muted")}>
              {section.heading.body}
            </p>
          ) : null}

          {section.metrics?.length ? (
            <dl className={cn("mt-11 grid gap-x-8 gap-y-7 border-t pt-8 sm:grid-cols-2", onDark ? "border-white/20" : "border-brand-border")}>
              {section.metrics.map((metric) => (
                <div key={metric.id}>
                  <dt className={cn("text-sm font-bold", onDark ? "text-white/70" : "text-brand-muted")}>{metric.label}</dt>
                  <dd className={cn("mt-1 font-heading text-[2.75rem] font-bold leading-none tracking-[-0.04em]", onDark ? "text-white" : "text-brand-deep")}>
                    {metric.value}
                  </dd>
                  {metric.explanation ? (
                    <p className={cn("mt-2 text-base leading-6", onDark ? "text-white/65" : "text-brand-muted")}>{metric.explanation}</p>
                  ) : null}
                </div>
              ))}
            </dl>
          ) : null}

          {section.items?.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.id} className={cn("border-l-2 pl-5", onDark ? "border-brand-accent-on-dark" : "border-brand-accent")}>
                  <ItemCopy item={item} onDark={onDark} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}

function EditorialIntro({ section }: { section: EditorialIntroSection }) {
  if (section.variant === "manifesto") return <Manifesto section={section} />;

  const centered = section.variant === "centered";
  const onDark = isDarkTheme(section.theme);
  const onAccent = section.theme === "gold";
  return (
    <SectionShell section={section}>
      <div className={cn("grid gap-12", !centered && "lg:grid-cols-[0.88fr_1.12fr] lg:items-center")}>
        {section.media ? (
          <ContentImage
            src={section.media.src}
            alt={section.media.alt}
            aspectRatio="landscape"
            fallbackLabel={section.heading.title}
            className="shadow-editorial"
          />
        ) : null}
        <div className={cn(!section.media && !centered && "lg:col-span-2")}>
          <EditorialHeading heading={section.heading} onDark={onDark} onAccent={onAccent} centered={centered} />
          {section.metrics?.length ? (
            <div className={cn("mt-10 grid gap-0 border-t sm:grid-cols-3", onDark ? "border-white/20" : "border-brand-border")}>
              {section.metrics.map((metric) => (
                <div key={metric.id} className={cn("py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0", onDark ? "border-b border-white/20" : "border-b border-brand-border")}>
                  <strong className={cn("block font-heading text-4xl font-bold", onDark ? "text-white" : "text-brand-deep")}>{metric.value}</strong>
                  <span className={cn("mt-2 block text-sm", onDark ? "text-white/70" : "text-brand-muted")}>{metric.label}</span>
                </div>
              ))}
            </div>
          ) : null}
          {section.items?.length ? (
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.id} className={cn("border-l-2 pl-5", onDark ? "border-brand-accent-on-dark" : "border-brand-accent")}>
                  <ItemCopy item={item} onDark={onDark} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}

function MediaNarrative({ section }: { section: MediaNarrativeSection }) {
  const onDark = isDarkTheme(section.theme);
  const mediaFirst = section.variant !== "overlay";
  return (
    <SectionShell section={section}>
      <div className={cn("grid overflow-hidden rounded-panel shadow-editorial lg:grid-cols-[0.9fr_1.1fr]", onDark ? "border border-white/15 bg-white/5" : "border border-brand-border bg-white", section.variant === "capsule" && "lg:rounded-l-[999px]")}>
        {mediaFirst ? (
          <ContentImage src={section.media.src} alt={section.media.alt} aspectRatio="portrait" fallbackLabel={section.heading.title} className={cn("min-h-[420px] rounded-none", section.variant === "capsule" && "lg:rounded-l-[999px]")} />
        ) : null}
        <div className={cn("flex flex-col justify-center p-7 sm:p-10 lg:p-16", section.variant === "overlay" && "relative min-h-[560px] lg:col-span-2")}>
          {section.variant === "overlay" ? (
            <ContentImage src={section.media.src} alt={section.media.alt} aspectRatio="wide" overlay fallbackLabel={section.heading.title} className="absolute inset-0 h-full rounded-none" imageClassName="brightness-[0.45]" />
          ) : null}
          <div className={cn(section.variant === "overlay" && "relative z-10 max-w-2xl text-white")}>
            <EditorialHeading heading={section.heading} onDark={onDark || section.variant === "overlay"} />
            {section.items?.length ? <div className="mt-8 grid gap-5">{section.items.map((item) => <ItemCopy key={item.id} item={item} onDark={onDark || section.variant === "overlay"} />)}</div> : null}
            <Actions actions={section.actions} />
          </div>
        </div>
      </div>
      {section.secondaryMedia?.length ? (
        section.variant === "collage" ? (
          <OffsetFrames className="mt-8" frames={section.secondaryMedia.slice(0, 3)} />
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.secondaryMedia.map((media) => <ContentImage key={media.src} src={media.src} alt={media.alt} aspectRatio="wide" fallbackLabel={section.heading.title} />)}
          </div>
        )
      ) : null}
    </SectionShell>
  );
}

/**
 * A cluster of related programmes read as one idea: a tall lead card and two
 * stacked beside it, each a photograph with the copy sitting on a gradient over
 * it. Cards, not articles-with-pictures, because these entries are a group.
 */
function OverlayCluster({ section }: { section: FeatureCollectionSection }) {
  const onDark = isDarkTheme(section.theme);
  const [lead, ...rest] = section.items;
  if (!lead) return null;

  const card = (item: SectionItemContent, tall: boolean) => (
    <article
      key={item.id}
      className={cn(
        "group relative isolate overflow-hidden rounded-panel bg-brand-deep",
        tall ? "min-h-[420px] lg:min-h-[620px]" : "min-h-[300px]",
      )}
    >
      {item.media ? (
        <ContentImage
          src={item.media.src}
          alt={item.media.alt}
          aspectRatio="fill"
          fallbackLabel={item.title}
          className="absolute inset-0 rounded-none"
          imageClassName="group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      ) : null}
      {/*
        Two scrims. The flat one keeps a bright frame from washing out white type
        anywhere on the card; the gradient deepens the band the copy sits in. The
        short cards are almost all copy, so their gradient never fully clears.
      */}
      <div aria-hidden="true" className="absolute inset-0 bg-brand-deep/25" />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          tall ? "from-brand-deep/95 via-brand-deep/45 to-transparent" : "from-brand-deep/95 via-brand-deep/80 to-brand-deep/40",
        )}
      />
      <div className={cn("absolute inset-x-0 bottom-0 z-10 text-white", tall ? "p-8 sm:p-10" : "p-6 sm:p-7")}>
        {item.eyebrow ? <Eyebrow onDark>{item.eyebrow}</Eyebrow> : null}
        <h3 className={cn("mt-3 font-heading font-bold leading-tight text-white", tall ? "text-[clamp(2.2rem,3.4vw,3.4rem)]" : "text-3xl")}>
          {item.title}
        </h3>
        {item.body ? (
          <p className={cn("mt-3 leading-7 text-white/70", tall ? "max-w-[46ch] text-lg" : "max-w-[40ch] text-base")}>{item.body}</p>
        ) : null}
        {item.action ? (
          <Link href={item.action.href} className="mt-5 inline-flex font-bold text-white underline decoration-brand-accent-on-dark decoration-2 underline-offset-4">
            {item.action.label}<span aria-hidden="true" className="ml-2">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );

  return (
    <SectionShell section={section}>
      {section.heading ? <EditorialHeading heading={section.heading} onDark={onDark} /> : null}
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {card(lead, true)}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">{rest.map((item) => card(item, false))}</div>
      </div>
    </SectionShell>
  );
}

function FeatureCollection({ section }: { section: FeatureCollectionSection }) {
  if (section.variant === "overlay") return <OverlayCluster section={section} />;

  const onDark = isDarkTheme(section.theme);
  const filmstrip = section.variant === "filmstrip";
  return (
    <SectionShell section={section}>
      {section.heading ? <EditorialHeading heading={section.heading} onDark={onDark} /> : null}
      <div className={cn("mt-12 grid gap-6", section.variant === "featuredPair" && "lg:grid-cols-2", section.variant === "chapters" && "lg:grid-cols-2", section.variant === "mosaic" && "md:grid-cols-2 lg:grid-cols-3", filmstrip && "grid-flow-col auto-cols-[82vw] overflow-x-auto pb-4 sm:auto-cols-[44vw] lg:auto-cols-[30%]") }>
        {section.items.map((item, index) => (
          <article key={item.id} className={cn("group overflow-hidden rounded-panel", onDark ? "border border-white/15 bg-white/10" : "border border-brand-border bg-white shadow-sm", section.variant === "featuredPair" && index === 0 && "lg:col-span-2 lg:grid lg:grid-cols-[1.25fr_0.75fr]", section.variant === "mosaic" && index === 0 && "md:row-span-2", filmstrip && "snap-start") }>
            {item.media ? <ContentImage src={item.media.src} alt={item.media.alt} aspectRatio={section.variant === "mosaic" && index === 0 ? "portrait" : "wide"} fallbackLabel={item.title} className="rounded-none" imageClassName="group-hover:scale-[1.03] motion-reduce:transform-none" /> : null}
            <div className="p-6 sm:p-8"><ItemCopy item={item} onDark={onDark} /></div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/**
 * A path that belongs to one programme rather than to the page: the photograph
 * holds the left, the numbered stages run down a dark panel on the right. Used
 * where a chapter needs to show its own sequence without the page handing the
 * whole width over to a process section.
 */
function VenturePath({ section }: { section: ProcessPathSection }) {
  return (
    <SectionShell section={section}>
      <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        {section.media ? (
          <ContentImage
            src={section.media.src}
            alt={section.media.alt}
            aspectRatio="fill"
            fallbackLabel={section.heading.title}
            className="min-h-[420px] shadow-editorial lg:min-h-[560px]"
          />
        ) : null}
        <div className="flex flex-col justify-center rounded-panel bg-brand-deep p-8 text-white sm:p-10">
          <Eyebrow onDark>{section.heading.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-heading text-[clamp(1.9rem,2.6vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            <AccentedTitle title={section.heading.title} titleAccent={section.heading.titleAccent} onDark />
          </h2>
          {section.heading.body ? <p className="mt-4 text-base leading-7 text-white/70">{section.heading.body}</p> : null}
          <ol className="mt-7 grid list-none gap-0 p-0">
            {section.items.map((item, index) => (
              <li key={item.id} className="grid grid-cols-[auto_1fr] gap-5 border-b border-white/15 py-5 first:border-t first:border-white/15">
                <span className="grid h-10 w-10 place-items-center rounded-capsule bg-white/10 text-xs font-bold text-white">
                  {item.eyebrow || String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-2xl font-bold leading-tight text-white">{item.title}</h3>
                  {item.body ? <p className="mt-1.5 text-base leading-6 text-white/65">{item.body}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}

function ProcessPath({ section }: { section: ProcessPathSection }) {
  if (section.variant === "venture") return <VenturePath section={section} />;

  const onDark = isDarkTheme(section.theme);
  return (
    <SectionShell section={section}>
      <EditorialHeading heading={section.heading} onDark={onDark} />
      <ol className={cn("mt-12 grid list-none gap-0 p-0", section.variant === "numbered" ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
        {section.items.map((item, index) => (
          <li key={item.id} className={cn("relative border-t p-6 sm:p-8 lg:border-l lg:border-t-0", onDark ? "border-white/20" : "border-brand-border")}>
            <span className={cn("font-heading text-5xl font-bold", onDark ? "text-white/35" : "text-brand-primary/30")}>{String(index + 1).padStart(2, "0")}</span>
            <ItemCopy item={item} onDark={onDark} />
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function RelationshipMap({ section }: { section: RelationshipMapSection }) {
  const onDark = isDarkTheme(section.theme);
  return (
    <SectionShell section={section}>
      <EditorialHeading heading={section.heading} onDark={onDark} />
      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.centerLabel ? <div className={cn("flex min-h-40 items-center justify-center rounded-capsule border-2 p-7 text-center font-heading text-2xl font-bold sm:col-span-2 lg:col-span-1 lg:row-span-2", onDark ? "border-white/30 bg-white/10 text-white" : "border-brand-primary bg-brand-deep text-white")}>{section.centerLabel}</div> : null}
        {section.items.map((item) => {
          const className = cn("rounded-panel border p-6 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent motion-reduce:transform-none", onDark ? "border-white/20 bg-white/10 text-white" : "border-brand-border bg-white text-brand-deep shadow-sm");
          const content = <ItemCopy item={{ ...item, action: undefined }} onDark={onDark} />;
          return item.action ? <Link key={item.id} href={item.action.href} className={className}>{content}</Link> : <article key={item.id} className={className}>{content}</article>;
        })}
      </div>
    </SectionShell>
  );
}

function MetricStory({ section }: { section: MetricStorySection }) {
  const onDark = isDarkTheme(section.theme);
  const headline = section.variant === "headline";
  return (
    <SectionShell section={section}>
      {section.heading ? <EditorialHeading heading={section.heading} onDark={onDark} /> : null}
      <div className={cn("mt-12 grid gap-8", section.media && "lg:grid-cols-[1fr_1fr] lg:items-center")}>
        {section.media ? <ContentImage src={section.media.src} alt={section.media.alt} aspectRatio="landscape" fallbackLabel={section.heading?.title ?? "Impact"} className="shadow-editorial" /> : null}
        <dl className={cn("grid gap-0", headline ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3")}>
          {section.metrics.map((metric, index) => (
            <div key={metric.id} className={cn("border-t py-7 sm:px-6", onDark ? "border-white/20" : "border-brand-border", !section.media && !headline && index === 0 && "sm:pl-0")}>
              <dt className={cn("text-sm font-bold", onDark ? "text-white/75" : "text-brand-muted")}>{metric.label}</dt>
              <dd className={cn("mt-2 font-heading font-bold tracking-[-0.04em]", headline && index === 0 ? "text-[clamp(5rem,14vw,11rem)] leading-none" : "text-5xl", onDark ? "text-white" : "text-brand-deep")}>{metric.value}</dd>
              {metric.explanation ? <p className={cn("mt-3 text-base leading-7", onDark ? "text-white/70" : "text-brand-muted")}>{metric.explanation}</p> : null}
              {metric.source ? <small className={cn("mt-3 block text-xs", onDark ? "text-white/55" : "text-brand-muted")}>{metric.source}</small> : null}
            </div>
          ))}
        </dl>
      </div>
      <Actions actions={section.actions} />
    </SectionShell>
  );
}

function StoryQuote({ section }: { section: StoryQuoteSection }) {
  const onDark = section.variant === "dark" || isDarkTheme(section.theme);
  return (
    <SectionShell section={section}>
      <div className={cn("grid overflow-hidden rounded-panel shadow-editorial lg:grid-cols-[0.82fr_1.18fr]", onDark ? "bg-brand-deep text-white" : "border border-brand-border bg-white", section.variant === "portrait" && "lg:rounded-l-[999px]")}>
        <ContentImage src={section.media.src} alt={section.media.alt} aspectRatio="portrait" fallbackLabel={section.attribution ?? section.heading.title} fallbackVariant={section.attribution ? "monogram" : "wordmark"} className={cn("min-h-[480px] rounded-none", section.variant === "portrait" && "lg:rounded-l-[999px]")} />
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <EditorialHeading heading={section.heading} onDark={onDark} />
          <blockquote className={cn("mt-8 border-l-4 border-brand-accent pl-6 font-heading text-2xl italic leading-relaxed", onDark ? "text-white/90" : "text-brand-deep")}>
            “{section.quote}”
          </blockquote>
          {section.attribution ? <p className={cn("mt-5 text-base font-bold", onDark ? "text-white" : "text-brand-deep")}>{section.attribution}{section.attributionRole ? <span className={cn("font-normal", onDark ? "text-white/65" : "text-brand-muted")}> · {section.attributionRole}</span> : null}</p> : null}
          {section.verification && section.verification !== "verified" ? <small className={cn("mt-3", onDark ? "text-white/55" : "text-brand-muted")}>Story pending editorial verification.</small> : null}
          <Actions actions={section.actions} />
        </div>
      </div>
    </SectionShell>
  );
}

function LinkedIndex({ section }: { section: LinkedIndexSection }) {
  const onDark = isDarkTheme(section.theme);
  return (
    <SectionShell section={section}>
      <EditorialHeading heading={section.heading} onDark={onDark} />
      <div className={cn("mt-12 grid", section.variant === "tiles" ? "gap-5 md:grid-cols-2 lg:grid-cols-3" : "gap-0 border-t", onDark ? "border-white/20" : "border-brand-border")}>
        {section.items.map((item, index) => {
          const className = cn("group grid gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent", section.variant === "tiles" ? "overflow-hidden rounded-panel border bg-white shadow-sm" : "border-b py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center", onDark ? "border-white/20 text-white" : "border-brand-border text-brand-deep");
          const content = <>
            {section.variant !== "tiles" ? <span className={cn("font-heading text-3xl font-bold", onDark ? "text-white/35" : "text-brand-primary/35")}>{String(index + 1).padStart(2, "0")}</span> : null}
            {item.media && section.variant === "tiles" ? <ContentImage src={item.media.src} alt={item.media.alt} aspectRatio="wide" fallbackLabel={item.title} className="rounded-none" imageClassName="group-hover:scale-[1.03] motion-reduce:transform-none" /> : null}
            <div className={cn(section.variant === "tiles" && "p-6")}><ItemCopy item={{ ...item, action: undefined }} onDark={onDark && section.variant !== "tiles"} /></div>
            {section.variant !== "tiles" && item.action ? <span aria-hidden="true" className="text-2xl transition group-hover:translate-x-1 motion-reduce:transform-none">→</span> : null}
          </>;
          return item.action ? <Link key={item.id} href={item.action.href} className={className}>{content}</Link> : <article key={item.id} className={className}>{content}</article>;
        })}
      </div>
    </SectionShell>
  );
}

function PublicationFeed({ section }: { section: PublicationFeedSection }) {
  const onDark = isDarkTheme(section.theme);
  const [lead, ...rest] = section.items;
  return (
    <SectionShell section={section}>
      {section.heading ? <EditorialHeading heading={section.heading} onDark={onDark} /> : null}
      {lead ? (
        <div className={cn("mt-12 grid gap-6", section.variant !== "essayGrid" && "lg:grid-cols-[1.2fr_0.8fr]")}>
          <div className="group relative min-h-[540px] overflow-hidden rounded-panel bg-brand-deep focus-within:ring-2 focus-within:ring-brand-accent">
            {lead.media ? <ContentImage src={lead.media.src} alt={lead.media.alt} aspectRatio="portrait" fallbackLabel={lead.title} className="absolute inset-0 h-full rounded-none" imageClassName="brightness-[0.6] group-hover:scale-[1.03] motion-reduce:transform-none" /> : null}
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 text-white sm:p-10"><ItemCopy item={lead} onDark /></div>
          </div>
          <div className={cn("grid gap-5", section.variant === "essayGrid" && "md:grid-cols-2 lg:grid-cols-3")}>
            {rest.map((item) => {
              const className = cn("group grid gap-5 border-t py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent", item.media && "sm:grid-cols-[0.42fr_0.58fr]", onDark ? "border-white/20" : "border-brand-border");
              const content = <>
                {item.media ? <ContentImage src={item.media.src} alt={item.media.alt} aspectRatio="wide" fallbackLabel={item.title} className="rounded-media" /> : null}
                <ItemCopy item={{ ...item, action: undefined }} onDark={onDark} />
              </>;
              return item.action ? <Link key={item.id} href={item.action.href} className={className}>{content}</Link> : <article key={item.id} className={className}>{content}</article>;
            })}
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}

function CallToAction({ section }: { section: CallToActionSection }) {
  return (
    <SectionShell section={section} className="bg-white py-0 pb-[var(--section-space)]">
      <div className="relative overflow-hidden rounded-panel bg-brand-deep p-8 text-white sm:p-12 lg:p-16">
        {section.media ? <ContentImage src={section.media.src} alt={section.media.alt} aspectRatio="wide" fallbackLabel={section.heading.title} className="absolute inset-y-0 right-0 hidden h-full w-2/5 rounded-none opacity-30 lg:block" imageClassName="brightness-75" /> : null}
        <div className="relative z-10 max-w-4xl"><EditorialHeading heading={section.heading} onDark /><Actions actions={section.actions} /></div>
      </div>
    </SectionShell>
  );
}

function NewsletterSignup({ section }: { section: Extract<PageSection, { componentType: "newsletterSignup" }> }) {
  return (
    <SectionShell section={section} className="bg-brand-deep text-white">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <EditorialHeading heading={section.heading} onDark />
        <NewsletterSignupForm interest={section.interest} className="lg:justify-self-end" />
      </div>
    </SectionShell>
  );
}

function assertNever(section: never): never {
  throw new Error(`Unsupported page section: ${JSON.stringify(section)}`);
}

export function PageSectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.filter((section) => section.enabled !== false).map((section) => {
        switch (section.componentType) {
          case "hero": return <EditorialHero key={section.id} section={section} />;
          case "editorialIntro": return <EditorialIntro key={section.id} section={section} />;
          case "mediaNarrative": return <MediaNarrative key={section.id} section={section} />;
          case "featureCollection": return <FeatureCollection key={section.id} section={section} />;
          case "processPath": return <ProcessPath key={section.id} section={section} />;
          case "relationshipMap": return <RelationshipMap key={section.id} section={section} />;
          case "metricStory": return <MetricStory key={section.id} section={section} />;
          case "storyQuote": return <StoryQuote key={section.id} section={section} />;
          case "linkedIndex": return <LinkedIndex key={section.id} section={section} />;
          case "publicationFeed": return <PublicationFeed key={section.id} section={section} />;
          case "callToAction": return <CallToAction key={section.id} section={section} />;
          case "newsletterSignup": return <NewsletterSignup key={section.id} section={section} />;
          default: return assertNever(section);
        }
      })}
    </>
  );
}
