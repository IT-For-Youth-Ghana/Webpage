"use client";

import Link from "next/link";

export type MarqueeTickerMode = "stats" | "partners" | "news" | "announcement";

export type MarqueeTickerItem = {
  label: string;
  href?: string;
  /** Optional filter: when set, item only shows if it matches the current ticker.mode */
  type?: MarqueeTickerMode;
};

export type MarqueeTickerContent = {
  mode: MarqueeTickerMode;
  speed?: "slow" | "medium" | "fast";
  pauseOnHover?: boolean;
  items: MarqueeTickerItem[];
};

type MarqueeTickerProps = {
  ticker: MarqueeTickerContent;
};

// ── Speed ──────────────────────────────────────────────────────────────────────
const speedStyles = {
  slow:   "[animation-duration:40s]",
  medium: "[animation-duration:28s]",
  fast:   "[animation-duration:20s]",
};

// ── Fixed left mode label ──────────────────────────────────────────────────────
const modeLabel: Record<MarqueeTickerMode, string> = {
  stats:        "LIVE",
  partners:     "PARTNERS",
  news:         "NEWS",
  announcement: "NOTICE",
};

// ── Per-mode item style ────────────────────────────────────────────────────────
function itemStyle(mode: MarqueeTickerMode): string {
  const base = "transition-colors duration-200";
  switch (mode) {
    case "partners":
      return `${base} text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50 hover:text-white/80`;
    case "news":
      return `${base} text-[0.75rem] font-medium text-white/65 hover:text-white/90`;
    case "announcement":
      return `${base} text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/70 hover:text-white`;
    case "stats":
    default:
      return `${base} text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/65 hover:text-white/90`;
  }
}

// ── Per-mode subtle prefix ─────────────────────────────────────────────────────
function ItemPrefix({ mode }: { mode: MarqueeTickerMode }) {
  if (mode === "news") {
    return <span className="mr-2 text-white/20 font-light select-none">/</span>;
  }
  if (mode === "announcement") {
    return <span className="mr-2 text-white/30 text-[0.55rem] select-none">◆</span>;
  }
  return null;
}

// ── Separator ─────────────────────────────────────────────────────────────────
function Separator() {
  return (
    <span aria-hidden className="select-none text-[0.5rem] text-white/15 mx-2">
      ◆
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function MarqueeTicker({ ticker }: MarqueeTickerProps) {
  // Filter by item.type when provided; fall back to the full list if filtering would yield nothing
  const filtered = ticker.items.filter((item) => !item.type || item.type === ticker.mode);
  const effective = filtered.length ? filtered : ticker.items;
  const baseItems = effective.length === 1 ? Array.from({ length: 8 }, () => effective[0]) : effective;
  const loopItems = [...baseItems, ...baseItems];

  return (
    <section
      aria-label={`${modeLabel[ticker.mode]} ticker`}
      className="relative flex items-stretch border-t border-white/10 bg-gray-950"
    >

      {/* Fixed left label — no fill, just text + divider */}
      <div className="relative z-10 flex shrink-0 items-center gap-2.5 border-r border-white/10 px-5 py-0">
        {/* Subtle indicator dot for stats/announcement */}
        {(ticker.mode === "stats" || ticker.mode === "announcement") && (
          <span className="h-1 w-1 rounded-full bg-white/30" />
        )}
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/35 whitespace-nowrap">
          {modeLabel[ticker.mode]}
        </span>
      </div>

      {/* Scrolling track */}
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <div
          className={[
            "flex w-max items-center gap-8 whitespace-nowrap py-3",
            "animate-marquee",
            "motion-reduce:animate-none motion-reduce:pr-8",
            speedStyles[ticker.speed ?? "medium"],
            ticker.pauseOnHover ? "hover:[animation-play-state:paused]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {loopItems.map((item, index) => {
            const isDuplicate = index >= effective.length;
            const inner = (
              <span className={`inline-flex items-center ${itemStyle(ticker.mode)}`}>
                <ItemPrefix mode={ticker.mode} />
                {item.label}
              </span>
            );

            const content = item.href ? (
              <Link href={item.href} tabIndex={isDuplicate ? -1 : undefined}>
                {inner}
              </Link>
            ) : (
              inner
            );

            return (
              <div
                key={`${item.label}-${index}`}
                aria-hidden={isDuplicate || undefined}
                className={`inline-flex items-center gap-8 ${isDuplicate ? "motion-reduce:hidden" : ""}`}
              >
                {content}
                <Separator />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
