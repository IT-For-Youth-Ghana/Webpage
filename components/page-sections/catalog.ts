import type { PageSectionType } from "@/types/page-sections";

export type PageSectionCatalogEntry = {
  type: PageSectionType;
  label: string;
  description: string;
  variants: readonly string[];
};

/**
 * Presentation metadata for a future section picker in the CMS.
 * The schema remains authoritative for persisted data; this is safe UI copy.
 */
export const pageSectionCatalog: readonly PageSectionCatalogEntry[] = [
  { type: "hero", label: "Page hero", description: "The single opening statement and lead media.", variants: ["split", "immersive", "publication", "data"] },
  { type: "editorialIntro", label: "Editorial introduction", description: "A chapter opener with optional media, metrics, or short points.", variants: ["split", "centered", "manifesto"] },
  { type: "mediaNarrative", label: "Media narrative", description: "Substantive copy paired with documentary media.", variants: ["split", "capsule", "overlay", "collage"] },
  { type: "featureCollection", label: "Feature collection", description: "A deliberately uneven collection of related features.", variants: ["featuredPair", "chapters", "mosaic", "filmstrip"] },
  { type: "processPath", label: "Process path", description: "Ordered steps expressed as a bridge, arc, or numbered sequence.", variants: ["bridge", "arc", "numbered"] },
  { type: "relationshipMap", label: "Relationship map", description: "Connected teams, departments, or partner groups.", variants: ["orbit", "network", "ecosystem"] },
  { type: "metricStory", label: "Metric story", description: "Evidence with hierarchy and space for provenance.", variants: ["strip", "headline", "mosaic"] },
  { type: "storyQuote", label: "Story or quote", description: "A verified human account paired with a portrait or scene.", variants: ["split", "dark", "portrait"] },
  { type: "linkedIndex", label: "Linked index", description: "A reusable route, programme, topic, or department index.", variants: ["rows", "tiles", "compact"] },
  { type: "publicationFeed", label: "Publication feed", description: "Lead and supporting stories with editorial hierarchy.", variants: ["leadGrid", "newsDesk", "essayGrid"] },
  { type: "callToAction", label: "Closing call to action", description: "One focused next step at the end of a chapter or page.", variants: ["band", "application", "partnership"] },
  { type: "newsletterSignup", label: "Newsletter signup", description: "A working email subscription form.", variants: ["band", "editorial"] },
] as const;

export const pageSectionCatalogByType = Object.fromEntries(
  pageSectionCatalog.map((entry) => [entry.type, entry]),
) as Record<PageSectionType, PageSectionCatalogEntry>;
