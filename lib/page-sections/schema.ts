import { z } from "zod";

const themeSchema = z.enum(["paper", "warm", "mist", "navy", "teal", "gold"]);

const headingSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().min(1),
  titleAccent: z.string().trim().min(1).optional(),
  body: z.string().trim().optional(),
});

const mediaSchema = z.object({
  src: z.string().trim(),
  alt: z.string().trim().min(1),
  caption: z.string().trim().optional(),
  credit: z.string().trim().optional(),
  focalPoint: z.enum(["center", "top", "bottom", "left", "right"]).optional(),
});

const actionSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
  style: z.enum(["gold", "navy", "light", "text"]).optional(),
});

const metricSchema = z.object({
  id: z.string().trim().min(1),
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  explanation: z.string().trim().optional(),
  source: z.string().trim().optional(),
});

const itemSchema = z.object({
  id: z.string().trim().min(1),
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().min(1),
  body: z.string().trim().optional(),
  media: mediaSchema.optional(),
  action: actionSchema.optional(),
  bullets: z.array(z.string().trim().min(1)).optional(),
  meta: z.string().trim().optional(),
});

const baseFields = {
  id: z.string().trim().min(1),
  anchor: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  navLabel: z.string().trim().min(1).optional(),
  theme: themeSchema.optional(),
  enabled: z.boolean().optional(),
};

const heroSchema = z.object({
  ...baseFields,
  componentType: z.literal("hero"),
  variant: z.enum(["split", "immersive", "publication", "data"]),
  slides: z.array(headingSchema.extend({
    id: z.string().trim().min(1),
    media: mediaSchema,
    actions: z.array(actionSchema).max(3).optional(),
    caption: z.string().trim().optional(),
    metrics: z.array(metricSchema).optional(),
  })).min(1),
});

const editorialIntroSchema = z.object({
  ...baseFields,
  componentType: z.literal("editorialIntro"),
  variant: z.enum(["split", "centered", "manifesto"]),
  heading: headingSchema,
  media: mediaSchema.optional(),
  metrics: z.array(metricSchema).optional(),
  items: z.array(itemSchema).optional(),
});

const mediaNarrativeSchema = z.object({
  ...baseFields,
  componentType: z.literal("mediaNarrative"),
  variant: z.enum(["split", "capsule", "overlay", "collage"]),
  heading: headingSchema,
  media: mediaSchema,
  secondaryMedia: z.array(mediaSchema).max(4).optional(),
  actions: z.array(actionSchema).max(3).optional(),
  items: z.array(itemSchema).optional(),
});

const featureCollectionSchema = z.object({
  ...baseFields,
  componentType: z.literal("featureCollection"),
  variant: z.enum(["featuredPair", "chapters", "mosaic", "filmstrip", "overlay"]),
  heading: headingSchema.optional(),
  items: z.array(itemSchema).min(1),
});

const processPathSchema = z.object({
  ...baseFields,
  componentType: z.literal("processPath"),
  variant: z.enum(["bridge", "arc", "numbered", "venture"]),
  heading: headingSchema,
  media: mediaSchema.optional(),
  items: z.array(itemSchema).min(1),
});

const relationshipMapSchema = z.object({
  ...baseFields,
  componentType: z.literal("relationshipMap"),
  variant: z.enum(["orbit", "network", "ecosystem"]),
  heading: headingSchema,
  items: z.array(itemSchema).min(1),
  centerLabel: z.string().trim().optional(),
});

const metricStorySchema = z.object({
  ...baseFields,
  componentType: z.literal("metricStory"),
  variant: z.enum(["strip", "headline", "mosaic"]),
  heading: headingSchema.optional(),
  metrics: z.array(metricSchema).min(1),
  media: mediaSchema.optional(),
  actions: z.array(actionSchema).max(3).optional(),
});

const storyQuoteSchema = z.object({
  ...baseFields,
  componentType: z.literal("storyQuote"),
  variant: z.enum(["split", "dark", "portrait"]),
  heading: headingSchema,
  quote: z.string().trim().min(1),
  attribution: z.string().trim().optional(),
  attributionRole: z.string().trim().optional(),
  verification: z.enum(["verified", "placeholder", "unverified"]).optional(),
  media: mediaSchema,
  actions: z.array(actionSchema).max(3).optional(),
});

const linkedIndexSchema = z.object({
  ...baseFields,
  componentType: z.literal("linkedIndex"),
  variant: z.enum(["rows", "tiles", "compact"]),
  heading: headingSchema,
  items: z.array(itemSchema).min(1),
});

const publicationFeedSchema = z.object({
  ...baseFields,
  componentType: z.literal("publicationFeed"),
  variant: z.enum(["leadGrid", "newsDesk", "essayGrid"]),
  heading: headingSchema.optional(),
  items: z.array(itemSchema).min(1),
});

const callToActionSchema = z.object({
  ...baseFields,
  componentType: z.literal("callToAction"),
  variant: z.enum(["band", "application", "partnership"]),
  heading: headingSchema,
  actions: z.array(actionSchema).min(1).max(3),
  media: mediaSchema.optional(),
});

const newsletterSignupSchema = z.object({
  ...baseFields,
  componentType: z.literal("newsletterSignup"),
  variant: z.enum(["band", "editorial"]),
  heading: headingSchema,
  interest: z.string().trim().min(1),
});

export const pageSectionSchema = z.discriminatedUnion("componentType", [
  heroSchema,
  editorialIntroSchema,
  mediaNarrativeSchema,
  featureCollectionSchema,
  processPathSchema,
  relationshipMapSchema,
  metricStorySchema,
  storyQuoteSchema,
  linkedIndexSchema,
  publicationFeedSchema,
  callToActionSchema,
  newsletterSignupSchema,
]);

export const pageSectionDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  pageId: z.string().trim().min(1),
  sections: z.array(pageSectionSchema).min(1),
}).superRefine((document, context) => {
  const ids = new Set<string>();
  const anchors = new Set<string>();
  let heroCount = 0;

  document.sections.forEach((section, index) => {
    if (ids.has(section.id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["sections", index, "id"], message: `Duplicate section id: ${section.id}` });
    }
    ids.add(section.id);

    if (section.anchor) {
      if (anchors.has(section.anchor)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["sections", index, "anchor"], message: `Duplicate section anchor: ${section.anchor}` });
      }
      anchors.add(section.anchor);
    }

    if (section.componentType === "hero" && section.enabled !== false) heroCount += 1;
  });

  if (heroCount > 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["sections"], message: "A page can have only one enabled hero." });
  }
});

export type ParsedPageSectionDocument = z.infer<typeof pageSectionDocumentSchema>;
