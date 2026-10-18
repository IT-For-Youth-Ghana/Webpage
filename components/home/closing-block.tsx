import Link from "next/link";

import { SectionIntro } from "@/components/content/section-intro";
import { CircularFigure } from "@/components/media/circular-figure";
import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";
import type { JoinCtaCard, NewsletterSignupContent } from "@/types/content";

type ClosingBlockProps = {
  cards: JoinCtaCard[];
  newsletter: NewsletterSignupContent;
};

/**
 * The homepage's single closing moment.
 *
 * Previously two consecutive sections: a "join the movement" card grid and then
 * a full-width newsletter band. Both asked the reader to act, one immediately
 * after the other, which split one decision across two screens. They are one
 * block now: pick a route, or stay in touch.
 *
 * The three audience cards are peers with no inherent order, so a grid is the
 * honest form. Each previously led with an icon chosen from its audience
 * key; the key stays in the content model but the icon is gone, and the accent
 * rule carries that weight.
 */
export function ClosingBlock({ cards, newsletter }: ClosingBlockProps) {
  const visibleCards = cards.filter((card) => card.active !== false);
  const showNewsletter = newsletter.active !== false;

  if (!visibleCards.length && !showNewsletter) return null;

  return (
    <section className="bg-brand-deep px-6 py-20 text-white lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {visibleCards.length ? (
          <>
            <SectionIntro
              tone="dark"
              eyebrow="Get involved"
              title="Join the movement"
              description="Clear paths for learners, organisations, and volunteers. Choose the role that fits you and take a practical next step with IT For Youth Ghana."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {visibleCards.map((card) => (
                <div
                  key={card.id}
                  className="flex h-full flex-col rounded-panel border border-white/12 bg-white/[0.06] p-8 transition duration-200 hover:-translate-y-1 hover:border-white/25"
                >
                  {card.image?.trim() ? (
                    /* A circular figure per audience. The homepage's challenge
                       section immediately above is a full-bleed band, so this
                       deliberately does not repeat that treatment. */
                    <CircularFigure
                      className="items-start text-left"
                      src={card.image}
                      alt={card.imageAlt || card.title}
                      size="sm"
                      accent="var(--color-accent)"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="block h-[3px] w-9 rounded-capsule bg-brand-accent"
                    />
                  )}

                  <div className="mt-6 space-y-3">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white/70">
                      {card.eyebrow}
                    </p>
                    <h3 className="font-heading text-2xl font-bold text-white">{card.title}</h3>
                    <p className="text-base leading-7 text-white/75">{card.description}</p>
                  </div>

                  <Link
                    href={card.href}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                  >
                    {card.buttonLabel}
                    <span
                      aria-hidden="true"
                      className="size-1.5 flex-none rotate-45 border-r-[1.6px] border-t-[1.6px] border-current"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {showNewsletter ? (
          <div
            className={
              visibleCards.length
                ? "mt-16 border-t border-white/15 pt-14"
                : ""
            }
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center">
              <div>
                <SectionIntro
                  tone="dark"
                  eyebrow={newsletter.eyebrow}
                  title={newsletter.heading}
                  description={newsletter.description}
                />
              </div>

              <div>
                <NewsletterSignupForm
                  interest={newsletter.interest}
                  buttonLabel="Join the mailing list"
                  placeholder="Enter your email address"
                />
                <p className="mt-4 text-base text-white/55">{newsletter.privacyNote}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
