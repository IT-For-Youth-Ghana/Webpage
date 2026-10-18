import Link from "next/link";

export type EventItem = {
  id: string;
  date: string;        // Display string e.g. "15 Jul 2025"
  month: string;       // Short month e.g. "Jul"
  day: string;         // Day number e.g. "15"
  title: string;
  location: string;    // e.g. "Accra, Ghana" or "Online"
  type: string;        // e.g. "Workshop" | "Graduation" | "Info Day"
  href: string;
  featured?: boolean;
};

type UpcomingEventsProps = {
  events: EventItem[];
};

const typeColors: Record<string, string> = {
  Workshop:   "bg-sky-50 text-sky-700",
  Graduation: "bg-amber-50 text-amber-700",
  "Info Day": "bg-emerald-50 text-emerald-700",
  Webinar:    "bg-purple-50 text-purple-700",
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="bg-[#f4f5f8] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              Events
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              Upcoming events &amp; open days
            </h2>
          </div>
          <Link
            href="/news-and-updates/news"
            className="shrink-0 border-b-2 border-brand-accent pb-0.5 text-[0.78rem] font-bold text-brand-ink transition hover:text-brand-accent"
          >
            Latest updates →
          </Link>
        </div>

        {/* Event list */}
        <div className="space-y-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={event.href}
              className={`group flex items-center gap-5 rounded-2xl border bg-white p-5 transition duration-250 hover:-translate-y-0.5 hover:shadow-md ${
                event.featured ? "border-brand-accent/40 ring-1 ring-brand-accent/20" : "border-brand-border"
              }`}
            >
              {/* Date block */}
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-deep text-white">
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-brand-accent">
                  {event.month}
                </span>
                <span className="font-heading text-2xl font-bold leading-none">
                  {event.day}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[1rem] font-bold text-brand-ink leading-snug">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">{event.location}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.15em] ${
                    typeColors[event.type] ?? "bg-brand-mist text-brand-deep"
                  }`}
                >
                  {event.type}
                </span>
              </div>

              {/* Arrow */}
              <span className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-accent">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
