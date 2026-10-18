import Link from "next/link";

import type { RouteCard } from "@/types/content";

type RouteCardGridProps = {
  cards: RouteCard[];
};

/**
 * The shared "where to go next" grid.
 *
 * A set of peers with no inherent order, so a grid is the honest form; it is
 * made interesting by type and by the accent rule rather than by decoration.
 *
 * Every card previously led with the same decorative layers glyph. An icon that
 * is identical on every card carries no information, so it is gone. The arrow
 * is CSS geometry rather than a character, so it inherits colour and animates
 * with the card.
 */
export function RouteCardGrid({ cards }: RouteCardGridProps) {
  const visibleCards = cards.filter(
    (card) =>
      card.href?.trim() &&
      [card.eyebrow, card.title, card.description].some((value) => value?.trim()),
  );

  if (!visibleCards.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visibleCards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group block rounded-panel border border-brand-border bg-white p-7 transition duration-200 hover:-translate-y-1 hover:shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="mb-5 block h-[3px] w-9 rounded-capsule bg-brand-accent" />

          {card.eyebrow?.trim() ? (
            <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-brand-muted">
              {card.eyebrow}
            </p>
          ) : null}

          {card.title?.trim() ? (
            <h3 className="font-heading text-xl font-bold text-brand-ink">{card.title}</h3>
          ) : null}

          {card.description?.trim() ? (
            <p className="mt-2.5 text-base leading-[1.65] text-slate-500">{card.description}</p>
          ) : null}

          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-deep transition-[gap] duration-200 group-hover:gap-3">
            Open route
            <span
              aria-hidden="true"
              className="size-1.5 flex-none rotate-45 border-r-[1.6px] border-t-[1.6px] border-current"
            />
          </p>
        </Link>
      ))}
    </div>
  );
}
