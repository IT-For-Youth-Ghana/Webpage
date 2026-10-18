import Link from "next/link";

export type ProgramCard = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  variant: "navy" | "gold" | "light";
  featured?: boolean; // spans 2 columns on desktop
};

type ProgramCardGridProps = {
  cards: ProgramCard[];
};

const variantStyles: Record<ProgramCard["variant"], string> = {
  navy: "bg-brand-deep text-white border-transparent",
  gold: "bg-[#FFF8DC] border-brand-accent text-brand-ink",
  light: "bg-[#f8f9fc] border-[#e8eaf0] text-brand-ink",
};

const linkStyles: Record<ProgramCard["variant"], string> = {
  navy: "text-brand-accent",
  gold: "text-brand-ink",
  light: "text-brand-ink",
};

export function ProgramCardGrid({ cards }: ProgramCardGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative overflow-hidden rounded-panel border p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${variantStyles[card.variant]} ${
            card.featured ? "lg:col-span-2" : ""
          }`}
        >
          {/* Ghost number */}
          <span className="pointer-events-none absolute right-5 top-2 font-heading text-[5rem] font-bold leading-none opacity-[0.07] select-none">
            {card.number}
          </span>

          <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
            {card.eyebrow}
          </p>
          <h3 className="font-heading text-[1.35rem] font-bold leading-snug">
            {card.title}
          </h3>
          <p className="mt-3 text-base leading-[1.75] opacity-75">
            {card.description}
          </p>
          <Link
            href={card.href}
            className={`mt-5 inline-flex items-center gap-1 text-[0.78rem] font-bold transition hover:gap-2 ${linkStyles[card.variant]}`}
          >
            {card.cta} →
          </Link>
        </div>
      ))}
    </div>
  );
}