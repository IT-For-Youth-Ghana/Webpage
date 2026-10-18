import Image from "next/image";
import Link from "next/link";

import { CapsulePageHero } from "@/components/capsule";
import { PanelList } from "@/components/content/panel-list";
import { ProcessSequence } from "@/components/content/process-sequence";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionIntro } from "@/components/content/section-intro";
import { Filmstrip } from "@/components/media/filmstrip";
import { safeCssColor } from "@/lib/utils/css-color";
import type { InitiativePage } from "@/types/content";

type InitiativePageTemplateProps = {
  page: InitiativePage;
};

const FALLBACK_ACCENT = "#1E72BA";

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function buildShareLinks(page: InitiativePage) {
  const url = `https://itforyouthghana.org/what-we-do/${page.slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(page.title);

  return [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Twitter/X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];
}

/**
 * The shared template behind all eight initiative pages.
 *
 * The hero is the capsule language in its static, light form: the same
 * CapsuleShell the homepage hero uses, with a single image and no slideshow.
 * That is the modularity claim being exercised rather than asserted. It reads
 * differently from the homepage because the tone is paper rather than dark and
 * the shape is at rest, so it is an evolution of the idea rather than a rerun
 * of the same pill.
 *
 * Each initiative carries its own accent colour, so eight pages sharing one
 * template still arrive with their own identity.
 *
 * No icons anywhere: weight is carried by colour, shape, type and spacing.
 * Content arrays keep their shape in the CMS and are rendered as separated
 * panels or as a sequence, never as a dot-and-line list.
 */
export function InitiativePageTemplate({ page }: InitiativePageTemplateProps) {
  const section = page.sectionContent;
  const accent = safeCssColor(page.accent, FALLBACK_ACCENT);
  const shareLinks = buildShareLinks(page);

  const objectives = page.objectives.filter(hasText);
  const howItWorks = page.howItWorks.filter(
    (step) => hasText(step.title) || hasText(step.description),
  );
  const impactStats = page.impactStats.filter(
    (stat) => hasText(stat.value) || hasText(stat.label) || hasText(stat.description),
  );
  const audienceGroups = page.audience.groups.filter(hasText);
  const eligibility = page.audience.eligibility.filter(hasText);
  /* Alt text has been required at the save boundary since
     lib/utils/validators.ts:568, so an entry without it is legacy data. It is
     dropped rather than shown, because a photograph nobody can hear described
     is not published content. */
  const gallery = page.gallery.filter((image) => hasText(image.src) && hasText(image.alt));
  const testimonials = page.testimonials.filter(
    (testimonial) =>
      hasText(testimonial.quote) || hasText(testimonial.name) || hasText(testimonial.role),
  );
  const partners = page.partners.filter(
    (partner) => hasText(partner.name) || hasText(partner.description),
  );
  const faqs = page.faqs.filter((faq) => hasText(faq.question) || hasText(faq.answer));

  const hasOverview =
    hasText(page.intro) || hasText(page.mission) || objectives.length > 0 || hasText(page.overviewImage);
  const hasAudience =
    hasText(page.audience.summary) || audienceGroups.length > 0 || eligibility.length > 0;
  const hasApplyCta =
    hasText(page.applyCta.heading) ||
    hasText(page.applyCta.description) ||
    (hasText(page.applyCta.primary.label) && hasText(page.applyCta.primary.href)) ||
    (hasText(page.applyCta.secondary.label) && hasText(page.applyCta.secondary.href));

  const anchorLinks = [
    hasOverview && hasText(section.overviewEyebrow) ? { id: "overview", label: section.overviewEyebrow } : null,
    howItWorks.length && hasText(section.howItWorksEyebrow) ? { id: "how-it-works", label: section.howItWorksEyebrow } : null,
    impactStats.length && hasText(section.impactEyebrow) ? { id: "impact", label: section.impactEyebrow } : null,
    hasAudience && hasText(section.audienceEyebrow) ? { id: "who-its-for", label: section.audienceEyebrow } : null,
    gallery.length && hasText(section.galleryEyebrow) ? { id: "gallery", label: section.galleryEyebrow } : null,
    testimonials.length && hasText(section.testimonialsEyebrow) ? { id: "testimonials", label: section.testimonialsEyebrow } : null,
    faqs.length && hasText(section.faqsEyebrow) ? { id: "faqs", label: section.faqsEyebrow } : null,
  ].filter((link): link is { id: string; label: string } => link !== null);

  const primaryCta = page.ctas[0];
  const secondaryCta = page.ctas[1];

  return (
    <div className="bg-white">
      <CapsulePageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={hasText(page.tagline) ? page.tagline : page.description}
        supportingText={hasText(page.tagline) ? page.description : null}
        imageSrc={page.heroImage}
        imageAlt={page.title}
        accent={accent}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "What We Do", href: "/what-we-do" },
          { label: page.title },
        ]}
        primaryAction={primaryCta}
        secondaryAction={secondaryCta}
      />

      {anchorLinks.length ? (
        <div className="sticky top-[72px] z-30 border-b border-brand-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
            {anchorLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="whitespace-nowrap rounded-capsule border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
        <div className="space-y-14">
          {hasOverview ? (
            <section id="overview" className="scroll-mt-36">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div className="space-y-6">
                  {hasText(page.intro) ? (
                    <SectionIntro
                      accent={accent}
                      eyebrow={section.overviewEyebrow}
                      title={section.overviewTitle}
                      description={page.intro}
                    />
                  ) : null}
                  {hasText(page.mission) ? (
                    <p className="text-base leading-8 text-slate-700">{page.mission}</p>
                  ) : null}
                  <PanelList items={objectives} accent={accent} />
                </div>

                {hasText(page.overviewImage) ? (
                  <div className="relative min-h-[24rem] overflow-hidden rounded-panel bg-brand-mist">
                    <Image
                      src={page.overviewImage}
                      alt={section.overviewImageAlt || page.title}
                      fill
                      sizes="(max-width: 1023px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* A strict sequence with no branching, so it gets a line. */}
          {howItWorks.length ? (
            <section id="how-it-works" className="scroll-mt-36">
              <SectionIntro
                accent={accent}
                eyebrow={section.howItWorksEyebrow}
                title={section.howItWorksTitle}
                description={section.howItWorksDescription}
              />
              <ProcessSequence className="mt-10" steps={howItWorks} accent={accent} />
            </section>
          ) : null}

          {impactStats.length ? (
            <section id="impact" className="scroll-mt-36">
              <SectionIntro
                accent={accent}
                eyebrow={section.impactEyebrow}
                title={section.impactTitle}
                description={section.impactDescription}
              />
              {/* One connected statement divided by rules, rather than four
                  detached dashboard tiles. */}
              <div className="mt-8 grid divide-y divide-brand-border border-y border-brand-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="px-4 py-7 sm:px-6">
                    <span
                      aria-hidden="true"
                      className="block h-[3px] w-9 rounded-capsule"
                      style={{ backgroundColor: accent }}
                    />
                    {hasText(stat.value) ? (
                      <p className="mt-5 font-heading text-5xl font-bold leading-none text-brand-deep">
                        {stat.value}
                      </p>
                    ) : null}
                    {hasText(stat.label) ? (
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-brand-ink">
                        {stat.label}
                      </p>
                    ) : null}
                    {stat.description ? (
                      <p className="mt-2.5 text-base leading-7 text-slate-600">{stat.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {hasAudience ? (
            <section id="who-its-for" className="scroll-mt-36">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                {hasText(page.audience.summary) || audienceGroups.length ? (
                  <div className="rounded-panel bg-brand-deep p-8 text-white">
                    {hasText(section.audienceEyebrow) ? (
                      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white">
                        <span
                          aria-hidden="true"
                          className="h-[2px] w-6 flex-none"
                          style={{ backgroundColor: accent }}
                        />
                        {section.audienceEyebrow}
                      </p>
                    ) : null}
                    {hasText(page.audience.summary) ? (
                      <p className="mt-5 text-lg leading-8 text-white/85">{page.audience.summary}</p>
                    ) : null}
                    <PanelList className="mt-8" items={audienceGroups} tone="dark" accent={accent} />
                  </div>
                ) : null}

                {eligibility.length ? (
                  <div className="rounded-panel border border-brand-border bg-white p-8 shadow-sm">
                    {hasText(section.eligibilityEyebrow) ? (
                      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-brand-ink">
                        <span
                          aria-hidden="true"
                          className="h-[2px] w-6 flex-none"
                          style={{ backgroundColor: accent }}
                        />
                        {section.eligibilityEyebrow}
                      </p>
                    ) : null}
                    <PanelList className="mt-6" items={eligibility} accent={accent} />
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {gallery.length ? (
            <section id="gallery" className="scroll-mt-36 space-y-8">
              <SectionIntro
                accent={accent}
                eyebrow={section.galleryEyebrow}
                title={section.galleryTitle}
                description={section.galleryDescription}
              />
              {/* A scroll-snap strip, not a contact sheet with a lightbox. The
                  photographs are peers, so nothing here should claim one of
                  them matters more, and the modal this replaces trapped nobody:
                  it closed on a click outside and had no Escape key and no
                  focus trap, which fails the accessibility rules the rest of
                  the site is held to. Native scroll has no controller to get
                  wrong. */}
              <Filmstrip
                frames={gallery.map((image) => ({ src: image.src, alt: image.alt }))}
                label={hasText(section.galleryTitle) ? section.galleryTitle : `${page.title} photographs`}
              />
            </section>
          ) : null}

          {testimonials.length ? (
            <section id="testimonials" className="scroll-mt-36 space-y-8">
              <SectionIntro
                accent={accent}
                eyebrow={section.testimonialsEyebrow}
                title={section.testimonialsTitle}
                description={section.testimonialsDescription}
              />
              <div className="grid gap-5 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <figure
                    key={`${testimonial.name}-${testimonial.role}`}
                    className="m-0 rounded-panel border border-brand-border bg-white p-6 shadow-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-[3px] w-9 rounded-capsule"
                      style={{ backgroundColor: accent }}
                    />
                    {hasText(testimonial.quote) ? (
                      <blockquote className="mt-5 text-base leading-8 text-slate-700">
                        {testimonial.quote}
                      </blockquote>
                    ) : null}
                    {hasText(testimonial.name) || hasText(testimonial.role) || hasText(testimonial.avatar) ? (
                      <figcaption className="mt-6 flex items-center gap-4">
                        {hasText(testimonial.avatar) ? (
                          <div
                            className="relative size-14 shrink-0 overflow-hidden rounded-full bg-brand-mist ring-2 ring-offset-2"
                            style={{ ["--tw-ring-color" as string]: accent }}
                          >
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          {hasText(testimonial.name) ? (
                            <p className="font-semibold text-brand-ink">{testimonial.name}</p>
                          ) : null}
                          {hasText(testimonial.role) ? (
                            <p className="text-base text-slate-500">{testimonial.role}</p>
                          ) : null}
                        </div>
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {partners.length ? (
            <section className="space-y-8">
              <SectionIntro
                accent={accent}
                eyebrow={section.partnersEyebrow}
                title={section.partnersTitle}
                description={section.partnersDescription}
              />
              <div className="grid gap-5 md:grid-cols-2">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex gap-4 rounded-panel border border-brand-border bg-white p-6 shadow-sm"
                  >
                    {hasText(partner.logo) || hasText(partner.name) ? (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-media bg-brand-mist text-sm font-bold text-brand-deep">
                        {hasText(partner.logo) ? (
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={44}
                            height={44}
                            className="size-11 object-contain"
                          />
                        ) : (
                          partner.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    ) : null}
                    <div>
                      {hasText(partner.name) ? (
                        <p className="font-semibold text-brand-ink">{partner.name}</p>
                      ) : null}
                      {hasText(partner.description) ? (
                        <p className="mt-2 text-base leading-7 text-slate-600">{partner.description}</p>
                      ) : null}
                      {hasText(partner.href) && hasText(section.partnerLinkLabel) ? (
                        <Link
                          href={partner.href}
                          className="mt-3 inline-flex text-sm font-bold underline decoration-2 underline-offset-4 transition hover:text-brand-ink"
                          style={{ color: accent }}
                        >
                          {section.partnerLinkLabel}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {faqs.length ? (
            <section id="faqs" className="scroll-mt-36 space-y-8">
              <SectionIntro
                accent={accent}
                eyebrow={section.faqsEyebrow}
                title={section.faqsTitle}
                description={section.faqsDescription}
              />
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-panel border border-brand-border bg-white px-6 py-5 shadow-sm"
                  >
                    {hasText(faq.question) ? (
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold text-brand-ink">
                        {faq.question}
                        {/* Disclosure marker as geometry: rotates on open. */}
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-2 flex-none rotate-45 border-b-2 border-r-2 border-current transition-transform duration-200 group-open:-rotate-[135deg]"
                        />
                      </summary>
                    ) : null}
                    {hasText(faq.answer) ? (
                      <p className="mt-4 text-base leading-7 text-slate-600">{faq.answer}</p>
                    ) : null}
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {hasApplyCta ? (
            <section className="overflow-hidden rounded-panel bg-brand-deep px-8 py-10 text-white">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  {hasText(section.applyCtaEyebrow) ? (
                    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white">
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-6 flex-none"
                        style={{ backgroundColor: accent }}
                      />
                      {section.applyCtaEyebrow}
                    </p>
                  ) : null}
                  {hasText(page.applyCta.heading) ? (
                    <h2 className="mt-4 font-heading text-3xl font-bold leading-tight">
                      {page.applyCta.heading}
                    </h2>
                  ) : null}
                  {hasText(page.applyCta.description) ? (
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                      {page.applyCta.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {hasText(page.applyCta.primary.label) && hasText(page.applyCta.primary.href) ? (
                    <Link
                      href={page.applyCta.primary.href}
                      className="rounded-control border-[1.5px] border-brand-accent bg-brand-accent px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:border-brand-accent-dark hover:bg-brand-accent-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                    >
                      {page.applyCta.primary.label}
                    </Link>
                  ) : null}
                  {hasText(page.applyCta.secondary.label) && hasText(page.applyCta.secondary.href) ? (
                    <Link
                      href={page.applyCta.secondary.href}
                      className="rounded-control border-[1.5px] border-white/50 px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                    >
                      {page.applyCta.secondary.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {page.related.length ? (
            <section className="space-y-8">
              <SectionIntro
                accent={accent}
                eyebrow={section.relatedEyebrow}
                title={section.relatedTitle}
                description={section.relatedDescription}
              />
              <RouteCardGrid cards={page.related} />
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-36 space-y-6 rounded-panel border border-brand-border bg-brand-mist/35 p-6">
            <div>
              {hasText(section.shareEyebrow) ? (
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-ink">
                  {section.shareEyebrow}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-capsule border border-brand-border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {page.quickLinks.length ? (
              <div>
                {hasText(section.quickLinksEyebrow) ? (
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-ink">
                    {section.quickLinksEyebrow}
                  </p>
                ) : null}
                <div className="mt-4 space-y-3">
                  {page.quickLinks
                    .filter((link) => hasText(link.label) && hasText(link.href))
                    .map((link) => (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        className="block text-sm font-medium text-brand-deep transition hover:text-brand-ink"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
