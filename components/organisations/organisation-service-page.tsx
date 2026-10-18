import Image from "next/image";
import { emojiToIconImage } from "@/lib/utils/icon-map";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import type { OrganisationServicePage as OrganisationServicePageType } from "@/types/content";

type OrganisationServicePageProps = {
  page: OrganisationServicePageType;
};

function buildAnchorLinks(page: OrganisationServicePageType) {
  const links = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "case-studies", label: "Case Studies" },
  ];

  if (page.packages?.length) {
    links.push({ id: "pricing", label: "Packages" });
  }

  links.push(
    { id: "faqs", label: "FAQs" },
    { id: "contact", label: "Contact" },
  );

  return links;
}

export function OrganisationServicePage({ page }: OrganisationServicePageProps) {
  const anchorLinks = buildAnchorLinks(page);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={page.heroImage}
        imageAlt={page.title}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.tagline}
        supportingText={page.description}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.organisations.root, href: "/for-organisations" },
          { label: page.title },
        ]}
        ctas={[
          { label: page.contactCta.primary.label, href: page.contactCta.primary.href },
          { label: "Learn more", href: "#overview", variant: "secondary" },
        ]}
        priority
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.overviewSectionEyebrow ?? "Service overview"}
            title={
              page.overviewSectionTitle ?? "What this route can look like in practice"
            }
            description={
              page.overviewSectionDescription ??
              "The cards below outline the kinds of support, structure, and value this service can create when it is designed around the organisation’s real context."
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            {page.overviewCards.filter((card) => card.title?.trim() || card.description?.trim()).map((card) => {
              const bulletParagraph = (card.bullets || [])
                .map((b) => (b || "").trim())
                .filter(Boolean)
                .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
                .join(" ");
              const description = [card.description, bulletParagraph].filter(Boolean).join(" ");
              return (
                <div
                  key={card.title}
                  className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    {(() => card.iconImage ?? emojiToIconImage(card.icon))() ? (
                      <span className="inline-flex items-center justify-center" aria-hidden="true">
                        <Image src={(card.iconImage ?? emojiToIconImage(card.icon)) as string} alt={card.title} width={28} height={28} className="h-7 w-7 object-contain" />
                      </span>
                    ) : (
                      <span className="text-3xl" aria-hidden="true">
                        {card.icon}
                      </span>
                    )}
                    <span className="rounded-full bg-brand-mist/70 px=3 py-1 text-xs font-semibold text-brand-deep">
                      {page.overviewCardBadgeLabel ?? "Service area"}
                    </span>
                  </div>
                  <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={page.howItWorksSectionEyebrow ?? "How it works"}
            title={
              page.howItWorksSectionTitle ??
              "A clearer engagement sequence helps both sides move faster"
            }
            description={
              page.howItWorksSectionDescription ??
              "Most organisational conversations go better when the steps are explicit early: clarify fit, scope the work, deliver the experience, then decide what the next layer of collaboration should be."
            }
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {page.howItWorks.filter((step) => step.title?.trim() || step.description?.trim()).map((step) => (
              <div
                key={step.number}
                className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  {(() => step.iconImage ?? emojiToIconImage(step.icon))() ? (
                    <span className="inline-flex items-center justify-center" aria-hidden="true">
                      <Image src={(step.iconImage ?? emojiToIconImage(step.icon)) as string} alt={step.title} width={28} height={28} className="h-7 w-7 object-contain" />
                    </span>
                  ) : (
                    <span className="text-3xl" aria-hidden="true">
                      {step.icon}
                    </span>
                  )}
                  <span className="font-heading text-3xl font-bold text-brand-accent/70">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="case-studies"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.caseStudiesSectionEyebrow ?? "Case studies"}
            title={
              page.caseStudiesSectionTitle ??
              "Representative examples of how the engagement can create value"
            }
            description={
              page.caseStudiesSectionDescription ??
              "These are seeded example patterns to show what a strong collaboration can look like in practice even before live case-study publishing is wired into the CMS."
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {page.caseStudies.filter((study) => study.title?.trim() || study.summary?.trim() || study.outcome?.trim()).map((study) => (
              <div
                key={study.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                  {study.organisationType}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {study.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{study.summary}</p>

                <div className="mt-5 rounded-[24px] bg-brand-mist/55 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Outcome
                  </p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{study.outcome}</p>
                </div>

                <p className="mt-5 text-base font-medium leading-7 text-brand-deep">
                  {study.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.packages?.length ? (
        <section
          id="pricing"
          className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl space-y-8">
            <SectionHeading
              eyebrow={page.packagesSectionEyebrow ?? "Packages"}
              title={page.pricingHeadline ?? "Example package structures"}
              description={
                page.pricingDescription ??
                "These package frames are illustrative and can be refined based on scope, audience, and delivery needs."
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
                {page.packages.filter((item) => item.name?.trim() || item.description?.trim()).map((item) => (
                <div
                  key={item.name}
                  className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-brand-ink">
                        {item.name}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-[20px] bg-brand-deep px-4 py-3 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                        Pricing
                      </p>
                      <p className="mt-2 font-heading text-2xl font-bold">{item.price}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {item.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {item.note ? (
                    <p className="mt-5 text-base leading-7 text-slate-500">{item.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="faqs" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.faqsSectionEyebrow ?? "FAQs"}
            title={
              page.faqsSectionTitle ??
              "Questions organisations often need answered before moving"
            }
            description={
              page.faqsSectionDescription ??
              "A clear answer early can save a lot of unnecessary back-and-forth. These FAQs cover the most common starting uncertainties."
            }
          />

          <div className="space-y-4">
            {page.faqs.filter((faq) => faq.question?.trim() || faq.answer?.trim()).map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-heading text-2xl font-bold text-brand-ink">
                  {faq.question}
                </summary>
                <p className="mt-4 text-base leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-36 bg-brand-deep px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              {page.contactSectionEyebrow ?? "Contact CTA"}
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {page.contactCta.heading}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/75">
              {page.contactCta.description}
            </p>
            <a
              href={`mailto:${page.contactCta.email}`}
              className="inline-flex text-sm font-semibold text-brand-accent transition hover:text-white"
            >
              {page.contactCta.email}
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={page.contactCta.primary.href}
              className="rounded-full bg-brand-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {page.contactCta.primary.label}
            </Link>
            <Link
              href={page.contactCta.secondary.href}
              className="rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
            >
              {page.contactCta.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.relatedSectionEyebrow ?? "Related routes"}
            title={page.relatedSectionTitle ?? "Keep the collaboration moving"}
            description={
              page.relatedSectionDescription ??
              "These adjacent routes often become the next useful conversation once the first collaboration shape is clear."
            }
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
