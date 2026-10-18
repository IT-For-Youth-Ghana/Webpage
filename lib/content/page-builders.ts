import type { RouteCard, SitePage } from "@/types/content";

export function buildHubPage(
  slug: string,
  title: string,
  description: string,
  cards: RouteCard[],
): SitePage {
  return {
    slug,
    eyebrow: "Foundation scaffold",
    title,
    description,
    intro:
      "This hub is live in the new Next.js information architecture and uses seed content until CMS-backed editing arrives.",
    stats: [
      {
        value: `${cards.length}`,
        label: "Connected routes",
        description: "Pages linked into the new IA from day one.",
      },
      {
        value: "Next.js",
        label: "App Router",
        description: "Foundation built for server-first rendering and future revalidation.",
      },
      {
        value: "CMS-ready",
        label: "Content model",
        description: "Structured to accept Firebase-managed content later.",
      },
    ],
    sections: [
      {
        title: "What this pass delivers",
        body: "The route exists, shares the global layout, and points to its downstream pages without waiting for the full CMS phase.",
      },
      {
        title: "What comes next",
        body: "Richer visuals, live content, forms, and analytics will be layered onto the same route structure.",
      },
    ],
    ctas: [
      { label: "Contact the team", href: "/contact" },
      { label: "Support the mission", href: "/donate" },
    ],
    related: cards,
  };
}
