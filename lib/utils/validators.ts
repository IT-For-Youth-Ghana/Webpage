import { z } from "zod";

// One media-URL verdict for the whole application. This module is the save
// boundary; components/admin/media-fields.tsx shows the same sentence under the
// input while the editor types. Both import it rather than re-deriving it, so
// the admin can never accept a URL the save rejects, or the reverse.
import { MISSING_ALT_MESSAGE, describeMediaUrlProblem } from "../cms/media-url.ts";
import { MEDIA_TREATMENTS } from "../../types/content.ts";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const editableCmsString = z.string().trim().optional();

export { describeMediaUrlProblem };

/**
 * An optional image URL that must actually be renderable.
 *
 * Use this for every field whose value reaches next/image. An empty string
 * clears the field, as with every other optional CMS string.
 */
const mediaImageString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .optional()
    .superRefine((value, ctx) => {
      const problem = describeMediaUrlProblem(value);
      if (problem) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
      }
    }),
);

/**
 * The closed list of editorial layouts, taken from types/content.ts so the
 * type, the admin select and this schema cannot drift into three lists.
 */
const mediaTreatmentEnum = z
  .enum(
    MEDIA_TREATMENTS.map((option) => option.value) as [string, ...string[]],
    { errorMap: () => ({ message: "Choose one of the listed section layouts." }) },
  )
  .optional();

/**
 * Alt text is required the moment a media field carries a value.
 *
 * Zod validates one field at a time, so the pairing has to be asserted on the
 * object that holds both. `mediaField` is the image key, `altField` the key
 * that describes it.
 */
function requireAltForMedia<Shape extends z.ZodRawShape>(
  schema: z.ZodObject<Shape>,
  mediaField: keyof Shape & string,
  altField: keyof Shape & string,
) {
  return schema.superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    const media = typeof record[mediaField] === "string" ? (record[mediaField] as string).trim() : "";
    const alt = typeof record[altField] === "string" ? (record[altField] as string).trim() : "";

    if (media && !alt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [altField],
        message: MISSING_ALT_MESSAGE,
      });
    }
  });
}

const consentBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean().refine(Boolean, "Please confirm that the team can contact you about this enquiry."),
);

const checkboxBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean(),
);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().int().positive().optional());

const stringList = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}, z.array(z.string().trim().min(1)).default([]));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: optionalTrimmedString,
  organisation: optionalTrimmedString,
  enquiryType: z.enum([
    "training",
    "organisation",
    "partnership",
    "donation",
    "media",
    "volunteering",
    "general",
  ]),
  preferredContact: z.enum(["email", "phone", "either"]).default("email"),
  message: z.string().trim().min(20, "Please share at least 20 characters so the team has context."),
  consent: consentBoolean,
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email(),
  interest: z.string().optional(),
});

export const applicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  course: z.string().min(2),
  notes: z.string().optional(),
});

export const articleSchema = z.object({
  title: z.string().trim().min(6, "Please add a clear article title."),
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  category: z.enum(["news", "blogs"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  type: z.enum(["News", "Blog", "Event", "Press"]).default("News"),
  excerpt: z.string().trim().min(24, "Please add a useful excerpt."),
  publishedAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid YYYY-MM-DD date."),
  coverImage: optionalTrimmedString,
  coverAlt: optionalTrimmedString,
  tags: stringList,
  authorName: z.string().trim().min(2, "Please add an author name."),
  authorRole: z.string().trim().min(2, "Please add an author role."),
  authorAvatar: optionalTrimmedString,
  featured: checkboxBoolean.default(false),
  readTimeMinutes: optionalNumber,
  contentHtml: z.string().trim().min(24, "Please add article body content."),
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  seoOgImage: optionalTrimmedString,
});

export type ArticlePayload = z.infer<typeof articleSchema>;

export const newsPageSchema = z.record(z.unknown());

export type NewsPagePayload = z.infer<typeof newsPageSchema>;

// ─── Team validators ─────────────────────────────────────────────────────────

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .url()
    .optional(),
);

export const teamSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  role: z.string().trim().min(2, "Please enter a role."),
  department: z.string().trim().min(2, "Please enter a department."),
  departmentId: optionalTrimmedString,
  departmentSlug: optionalTrimmedString,
  bio: z.string().trim().min(10, "Please enter a short biography."),
  photo: optionalTrimmedString,
  email: optionalEmail,
  linkedin: optionalUrl,
  featured: checkboxBoolean.default(false),
  status: z.enum(["active", "inactive"]).default("active"),
  order: optionalNumber,
});

export type TeamPayload = z.infer<typeof teamSchema>;

// ─── Department validators ──────────────────────────────────────────────────

const departmentServiceSchema = z.object({
  title: z.string().trim().min(2, "Please add a service title."),
  body: z.string().trim().min(10, "Please add service copy."),
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const departmentWorkflowSchema = z.object({
  title: z.string().trim().min(2, "Please add a workflow step title."),
  description: z.string().trim().min(10, "Please add workflow step copy."),
});

const departmentResourceSchema = z.object({
  label: z.string().trim().min(2, "Please add a resource label."),
  href: z.string().trim().min(1, "Please add a resource link."),
  description: optionalTrimmedString,
});

const departmentHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(2, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
});

const departmentActionLinkSchema = z.object({
  label: z.string().trim().min(2, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const departmentContactSchema = z
  .object({
    name: optionalTrimmedString,
    role: optionalTrimmedString,
    email: optionalEmail,
  })
  .partial()
  .default({});

export const departmentSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  eyebrow: z.string().trim().min(2, "Please add an eyebrow label."),
  title: z.string().trim().min(2, "Please add a department title."),
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  mission: z.string().trim().min(12, "Please add a mission statement."),
  heroImage: editableCmsString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
  color: optionalTrimmedString,
  responsibilities: z.array(z.string().trim().min(1)).min(1, "Please add at least one responsibility."),
  services: z.array(departmentServiceSchema).default([]),
  workflows: z.array(departmentWorkflowSchema).default([]),
  priorities: z.array(z.string().trim().min(1)).default([]),
  stats: z.array(departmentHighlightStatSchema).default([]),
  teamMemberIds: z.array(z.string().trim().min(1)).default([]),
  resources: z.array(departmentResourceSchema).default([]),
  contact: departmentContactSchema,
  ctas: z.array(departmentActionLinkSchema).default([]),
  featured: checkboxBoolean.default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  order: optionalNumber,
});

export type DepartmentPayload = z.infer<typeof departmentSchema>;

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Please enter a partner name."),
  logo: optionalTrimmedString,
  href: optionalUrl,
  active: checkboxBoolean.default(true),
  order: optionalNumber,
});

export type PartnerPayload = z.infer<typeof partnerSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  quote: z.string().trim().min(12, "Please enter a meaningful quote."),
  role: z.string().trim().min(2, "Please enter a role."),
  programme: optionalTrimmedString,
  year: optionalTrimmedString,
  avatar: optionalTrimmedString,
  initials: z
    .string()
    .trim()
    .max(3, "Initials can be up to 3 characters.")
    .optional(),
  active: checkboxBoolean.default(true),
});

export type TestimonialPayload = z.infer<typeof testimonialSchema>;

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Please enter a clear role title."),
  summary: z.string().trim().min(20, "Please add a short role summary."),
  team: z.string().trim().min(2, "Please enter a team/department."),
  location: z.string().trim().min(2, "Please enter a location."),
  type: z.enum(["full-time", "part-time", "contract", "volunteer"]).default("full-time"),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
  applyUrl: optionalUrl,
  closingDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid YYYY-MM-DD date.")
    .optional(),
  featured: checkboxBoolean.default(false),
});

export type JobPayload = z.infer<typeof jobSchema>;

// ─── Settings & Homepage validators (Phase 1) ───────────────────────────────

export const socialsSchema = z
  .array(
    z.object({
      label: z.string().trim().min(2),
      href: z.string().trim().url(),
      network: z.string().trim().optional(),
    }),
  )
  .default([]);

export const settingsSchema = z.object({
  siteTitle: optionalTrimmedString,
  siteDescription: optionalTrimmedString,
  defaultOgImage: optionalTrimmedString,
  logoUrl: optionalTrimmedString,
  contact: z
    .object({
      email: optionalEmail,
      phone: optionalTrimmedString,
      location: optionalTrimmedString,
    })
    .partial()
    .default({}),
  socials: socialsSchema,
});

export type SettingsPayload = z.infer<typeof settingsSchema>;

const sitePageHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(2, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
});

/**
 * ContentBlock, the editorial body of every page built on this schema.
 *
 * image / imageAlt / videoUrl / videoTitle already existed on the type and
 * components/shared/content-page.tsx already rendered them, but they were absent
 * here, so z.object stripped all four at the API boundary. The template built to
 * pair every text block with media could not receive media.
 */
const sitePageSectionSchema = requireAltForMedia(
  z.object({
    title: z.string().trim().min(2, "Please add a section title."),
    body: z.string().trim().min(12, "Please add useful section body copy."),
    bullets: z.array(z.string().trim().min(1)).optional().default([]),
    image: mediaImageString,
    imageAlt: optionalTrimmedString,
    videoUrl: optionalTrimmedString,
    videoTitle: optionalTrimmedString,
    treatment: mediaTreatmentEnum,
  }),
  "image",
  "imageAlt",
);

const sitePageActionLinkSchema = z.object({
  label: z.string().trim().min(2, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const sitePageRouteCardSchema = requireAltForMedia(
  z.object({
    href: z.string().trim().min(1, "Please add a card destination."),
    eyebrow: optionalTrimmedString,
    title: z.string().trim().min(2, "Please add a card title."),
    description: z.string().trim().min(12, "Please add a useful card description."),
    image: mediaImageString,
    imageAlt: optionalTrimmedString,
  }),
  "image",
  "imageAlt",
);

const sitePageCourseSchema = z.object({
  id: z.string().trim().min(1, "Please add a course ID."),
  slug: z
    .string()
    .trim()
    .min(3, "Please add a course slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(2, "Please add a course title."),
  description: z.string().trim().min(12, "Please add a useful course description."),
  descriptionHtml: optionalTrimmedString.nullable().optional(),
  shortDescription: z.string().trim().min(12, "Please add a short course description."),
  category: z.string().trim().min(2, "Please add a category."),
  level: z.string().trim().min(2, "Please add a level."),
  duration: z.string().trim().min(2, "Please add a duration."),
  deliveryMode: z.string().trim().min(2, "Please add a delivery mode."),
  image: optionalTrimmedString.nullable().optional(),
  pricing: z.object({
    amount: z.number().nonnegative().nullable(),
    currency: z.string().trim().min(2).default("GHS"),
    isFree: checkboxBoolean.default(false),
  }),
  tags: z.array(z.string().trim().min(1)).default([]),
  applyUrl: optionalTrimmedString.nullable().optional(),
  startDate: optionalTrimmedString.nullable().optional(),
  endDate: optionalTrimmedString.nullable().optional(),
  objectives: z.array(z.string().trim().min(1)).optional().default([]),
  requirements: z.array(z.string().trim().min(1)).optional().default([]),
  includedItems: z.array(z.string().trim().min(1)).optional().default([]),
  previewVideoUrl: optionalTrimmedString.nullable().optional(),
});

const trainingCohortSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  applicationDeadline: optionalTrimmedString,
  summary: z.string().trim().min(1),
  format: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  location: z.string().trim().min(1),
  status: z.enum(["open", "upcoming", "waitlist"]),
});

const trainingProcessStepSchema = z.object({
  number: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  icon: z.string().trim().default(""),
  iconImage: optionalTrimmedString,
});

export const sitePageSchema = z.object({
  slug: optionalTrimmedString,
  eyebrow: z.string().trim().min(2, "Please add an eyebrow label."),
  title: z.string().trim().min(2, "Please add a page title."),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  heroImage: mediaImageString,
  /**
   * Absent from this schema until now, so z.object stripped it on every save.
   * The admin has had a hero-alt input since site-page-form.tsx:366, an editor
   * typed a photo description, the API answered "saved", and the value never
   * left the browser. lib/cms/site-pages-contract.test.ts now fails when a
   * string field in this schema has no matching read in mergeSitePage.
   */
  heroImageAlt: editableCmsString,
  heroVideoUrl: optionalTrimmedString,
  heroVideoThumbnail: mediaImageString,
  stats: z.array(sitePageHighlightStatSchema).default([]),
  sections: z.array(sitePageSectionSchema).default([]),
  ctas: z.array(sitePageActionLinkSchema).default([]),
  related: z.array(sitePageRouteCardSchema).default([]),
  courses: z.array(sitePageCourseSchema).optional().default([]),
  cohorts: z.array(trainingCohortSchema).optional().default([]),
  process: z.array(trainingProcessStepSchema).optional().default([]),
  overviewTitle: editableCmsString,
  overviewDescription: editableCmsString,
  operatingEyebrow: editableCmsString,
  operatingTitle: editableCmsString,
  operatingDescription: editableCmsString,
  principlesEyebrow: editableCmsString,
  principlesTitle: editableCmsString,
  principlesDescription: editableCmsString,
  principlesHeroEyebrow: editableCmsString,
  principlesHeroTitle: editableCmsString,
  principlesImage: mediaImageString,
  principlesImageAlt: editableCmsString,
  highlightsEyebrow: editableCmsString,
  exploreEyebrow: editableCmsString,
  exploreTitle: editableCmsString,
  exploreDescription: editableCmsString,
  processEyebrow: editableCmsString,
  processTitle: editableCmsString,
  processDescription: editableCmsString,
  nextStepEyebrow: editableCmsString,
  nextStepTitle: editableCmsString,
  nextStepDescription: editableCmsString,
});

export type SitePagePayload = z.infer<typeof sitePageSchema>;

export const dynamicSitePageSchema = sitePageSchema.extend({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  order: optionalNumber,
});

export type DynamicSitePagePayload = z.infer<typeof dynamicSitePageSchema>;

// ─── What We Do / Initiative validators ─────────────────────────────────────

const initiativeActionLinkSchema = z.object({
  label: z.string().trim().min(1, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const initiativeRouteCardSchema = z.object({
  href: z.string().trim().min(1, "Please add a card destination."),
  eyebrow: optionalTrimmedString,
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
});

const initiativeHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(1, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  iconImage: optionalTrimmedString,
});

const initiativeContentBlockSchema = z.object({
  title: z.string().trim().min(1, "Please add a section title."),
  body: z.string().trim().min(1, "Please add section copy."),
  bullets: z.array(z.string().trim().min(1)).optional().default([]),
});

const initiativeProcessStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add step copy."),
  icon: z.string().trim().default(""),
  iconImage: optionalTrimmedString,
});

const initiativeAudienceSchema = z.object({
  summary: z.string().trim().min(1, "Please add audience summary copy."),
  groups: z.array(z.string().trim().min(1)).default([]),
  eligibility: z.array(z.string().trim().min(1)).default([]),
});

const initiativeGalleryImageSchema = z.object({
  // Required, and renderable. The strip that displays these runs every src
  // through next/image, which throws on an unlisted host at request time.
  src: z
    .string()
    .trim()
    .min(1, "Please add an image URL.")
    .superRefine((value, ctx) => {
      const problem = describeMediaUrlProblem(value);
      if (problem) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
      }
    }),
  alt: z.string().trim().min(1, "Please add image alt text."),
});

const initiativeTestimonialSchema = z.object({
  quote: z.string().trim().min(1, "Please add the quote."),
  name: z.string().trim().min(1, "Please add a name."),
  role: z.string().trim().min(1, "Please add a role."),
  avatar: optionalTrimmedString,
});

const initiativePartnerSchema = z.object({
  name: z.string().trim().min(1, "Please add a partner name."),
  description: z.string().trim().min(1, "Please add partner context."),
  href: optionalTrimmedString,
  logo: optionalTrimmedString,
});

const initiativeFaqSchema = z.object({
  question: z.string().trim().min(1, "Please add a question."),
  answer: z.string().trim().min(1, "Please add an answer."),
});

const initiativeApplyCtaSchema = z.object({
  heading: z.string().trim().min(1, "Please add a CTA heading."),
  description: z.string().trim().min(1, "Please add CTA copy."),
  primary: initiativeActionLinkSchema,
  secondary: initiativeActionLinkSchema,
});

const initiativeSectionContentSchema = z.object({
  overviewEyebrow: z.string().trim().default(""),
  overviewTitle: z.string().trim().default(""),
  overviewImageAlt: z.string().trim().default(""),
  howItWorksEyebrow: z.string().trim().default(""),
  howItWorksTitle: z.string().trim().default(""),
  howItWorksDescription: z.string().trim().default(""),
  impactEyebrow: z.string().trim().default(""),
  impactTitle: z.string().trim().default(""),
  impactDescription: z.string().trim().default(""),
  audienceEyebrow: z.string().trim().default(""),
  eligibilityEyebrow: z.string().trim().default(""),
  galleryEyebrow: z.string().trim().default(""),
  galleryTitle: z.string().trim().default(""),
  galleryDescription: z.string().trim().default(""),
  testimonialsEyebrow: z.string().trim().default(""),
  testimonialsTitle: z.string().trim().default(""),
  testimonialsDescription: z.string().trim().default(""),
  partnersEyebrow: z.string().trim().default(""),
  partnersTitle: z.string().trim().default(""),
  partnersDescription: z.string().trim().default(""),
  partnerLinkLabel: z.string().trim().default(""),
  faqsEyebrow: z.string().trim().default(""),
  faqsTitle: z.string().trim().default(""),
  faqsDescription: z.string().trim().default(""),
  applyCtaEyebrow: z.string().trim().default(""),
  relatedEyebrow: z.string().trim().default(""),
  relatedTitle: z.string().trim().default(""),
  relatedDescription: z.string().trim().default(""),
  shareEyebrow: z.string().trim().default(""),
  quickLinksEyebrow: z.string().trim().default(""),
});

export const initiativeSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a page title."),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  stats: z.array(initiativeHighlightStatSchema).default([]),
  sections: z.array(initiativeContentBlockSchema).default([]),
  ctas: z.array(initiativeActionLinkSchema).default([]),
  related: z.array(initiativeRouteCardSchema).default([]),
  tagline: z.string().trim().default(""),
  heroImage: z.string().trim().min(1, "Please add a hero image."),
  overviewImage: z.string().trim().min(1, "Please add an overview image."),
  mission: z.string().trim().min(1, "Please add mission copy."),
  objectives: z.array(z.string().trim().min(1)).default([]),
  howItWorks: z.array(initiativeProcessStepSchema).default([]),
  impactStats: z.array(initiativeHighlightStatSchema).default([]),
  audience: initiativeAudienceSchema,
  gallery: z.array(initiativeGalleryImageSchema).default([]),
  testimonials: z.array(initiativeTestimonialSchema).default([]),
  partners: z.array(initiativePartnerSchema).default([]),
  faqs: z.array(initiativeFaqSchema).default([]),
  applyCta: initiativeApplyCtaSchema,
  sectionContent: initiativeSectionContentSchema,
  quickLinks: z.array(initiativeActionLinkSchema).default([]),
});

export type InitiativePayload = z.infer<typeof initiativeSchema>;

const whatWeDoHeroStatSchema = z.object({
  label: z.string().trim().min(1, "Please add a stat label."),
  description: z.string().trim().min(1, "Please add stat context."),
});

const whatWeDoEcosystemCardSchema = z.object({
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add card copy."),
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
});

const whatWeDoPathwayCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add card copy."),
});

const whatWeDoGalleryItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1, "Please add a resource URL."),
  title: z.string().trim().min(1, "Please add a media title."),
  description: optionalTrimmedString,
  thumbnailUrl: optionalTrimmedString,
});

export const whatWeDoOverviewSchema = z.object({
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a page title."),
  description: z.string().trim().default(""),
  heroImage: z.string().trim().min(1, "Please add a hero image."),
  heroStats: z.array(whatWeDoHeroStatSchema).min(4, "Please keep four hero stat labels."),
  overviewSectionEyebrow: optionalTrimmedString,
  overviewSectionTitle: optionalTrimmedString,
  overviewSectionDescription: optionalTrimmedString,
  ecosystemCards: z.array(whatWeDoEcosystemCardSchema).default([]),
  initiativesSectionEyebrow: optionalTrimmedString,
  initiativesSectionTitle: optionalTrimmedString,
  initiativesSectionDescription: optionalTrimmedString,
  gallerySectionEyebrow: optionalTrimmedString,
  gallerySectionTitle: optionalTrimmedString,
  gallerySectionDescription: optionalTrimmedString,
  galleryItems: z.array(whatWeDoGalleryItemSchema).default([]),
  pathwaysSectionEyebrow: optionalTrimmedString,
  pathwaysSectionTitle: optionalTrimmedString,
  pathwaysSectionDescription: optionalTrimmedString,
  pathwayCards: z.array(whatWeDoPathwayCardSchema).default([]),
  nextStepsSectionEyebrow: optionalTrimmedString,
  nextStepsSectionTitle: optionalTrimmedString,
  nextStepsSectionDescription: optionalTrimmedString,
  nextSteps: z.array(initiativeRouteCardSchema).default([]),
});

export type WhatWeDoOverviewPayload = z.infer<typeof whatWeDoOverviewSchema>;

export const homepageSchema = z
  .object({
    announcement: z
      .object({
        id: optionalTrimmedString,
        variant: z.enum(["info", "success", "urgent", "alert"]).optional(),
        label: optionalTrimmedString,
        message: optionalTrimmedString,
        cta: z
          .object({
            label: optionalTrimmedString,
            href: optionalTrimmedString,
          })
          .partial()
          .optional(),
        startDate: optionalTrimmedString,
        endDate: optionalTrimmedString,
        countdownDate: optionalTrimmedString,
        dismissible: checkboxBoolean.optional(),
      })
      .partial()
      .optional(),
    heroSlides: z.array(z.unknown()).optional(),
    ticker: z.unknown().optional(),
    programmeShowcase: z.array(z.unknown()).optional(),
    overviewSection: z.unknown().optional(),
    challengeSection: z.unknown().optional(),
    missionSection: z.unknown().optional(),
    donationCampaign: z.unknown().optional(),
    featuredStory: z.unknown().optional(),
    joinCtaCards: z.array(z.unknown()).optional(),
    newsletterSignup: z.unknown().optional(),
    floatingElements: z.unknown().optional(),
  })
  .partial();

export type HomepagePayload = z.infer<typeof homepageSchema>;

export const highlightStatSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
});

const contactPageChannelSchema = z.object({
  label: z.string().trim().min(1, "Please add a channel label."),
  value: z.string().trim().min(1, "Please add a channel value."),
  description: z.string().trim().min(1, "Please add a channel description."),
  href: z.string().trim().min(1, "Please add a channel link."),
});

const contactPageEnquiryOptionSchema = z.object({
  value: z.enum([
    "training",
    "organisation",
    "partnership",
    "donation",
    "media",
    "volunteering",
    "general",
  ]),
  label: z.string().trim().min(1, "Please add an option label."),
  description: z.string().trim().min(1, "Please add an option description."),
});

const contactPageResponseStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add a step description."),
});

const contactPageRouteCardSchema = z.object({
  href: z.string().trim().min(1, "Please add a card destination."),
  eyebrow: optionalTrimmedString,
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
});

export const contactPageSchema = z
  .object({
    eyebrow: editableCmsString,
    title: editableCmsString,
    description: editableCmsString,
    heroImage: editableCmsString,
    stats: z.array(highlightStatSchema).optional(),
    channels: z.array(contactPageChannelSchema).optional(),
    enquiryOptions: z.array(contactPageEnquiryOptionSchema).optional(),
    responseSteps: z.array(contactPageResponseStepSchema).optional(),
    routeCards: z.array(contactPageRouteCardSchema).optional(),
    privacyNote: editableCmsString,
    channelsEyebrow: editableCmsString,
    channelsTitle: editableCmsString,
    channelsDescription: editableCmsString,
    formEyebrow: editableCmsString,
    formTitle: editableCmsString,
    formDescription: editableCmsString,
    messageEyebrow: editableCmsString,
    messageTitle: editableCmsString,
    messageDescription: editableCmsString,
    privacyTitle: editableCmsString,
    routesEyebrow: editableCmsString,
    routesTitle: editableCmsString,
    routesDescription: editableCmsString,
    emailCtaLabel: editableCmsString,
    formCtaLabel: editableCmsString,
  })
  .partial();

export type ContactPagePayload = z.infer<typeof contactPageSchema>;

// ─── Impact stats validators ────────────────────────────────────────────────

export const impactStatsSchema = z.object({
  stats: z.array(highlightStatSchema).min(1),
});

export type ImpactStatsPayload = z.infer<typeof impactStatsSchema>;

export const impactPageSchema = z.record(z.unknown());

export type ImpactPagePayload = z.infer<typeof impactPageSchema>;

// ─── Partnership validators (Tier 1 with JSON bridges) ─────────────────────

const partnershipOverviewCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
});

const partnershipFocusCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
  icon: z.string().trim().min(1).default(""),
  // Optional image URL alternative to icon
  iconImage: optionalTrimmedString,
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const partnershipProcessStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add a step description."),
  icon: z.string().trim().min(1).default(""),
  // Optional image URL alternative to icon
  iconImage: optionalTrimmedString,
});

const partnershipScenarioSchema = z.object({
  title: z.string().trim().min(1, "Please add a scenario title."),
  partnerType: z.string().trim().min(1, "Please add a partner type."),
  summary: z.string().trim().min(1, "Please add a scenario summary."),
  outcome: z.string().trim().min(1, "Please add a scenario outcome."),
  highlight: z.string().trim().min(1).default(""),
});

const partnershipFaqSchema = z.object({
  question: z.string().trim().min(1, "Please add a question."),
  answer: z.string().trim().min(1, "Please add an answer."),
});

const partnershipContactCtaSchema = z.object({
  heading: z.string().trim().min(1, "Please add a contact heading."),
  description: z.string().trim().min(1, "Please add contact copy."),
  email: z.string().trim().min(1, "Please add a contact email."),
  primary: sitePageActionLinkSchema,
  secondary: sitePageActionLinkSchema,
});

export const partnershipOverviewSchema = z
  .object({
    eyebrow: optionalTrimmedString,
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    heroImage: optionalTrimmedString,
    stats: z.array(highlightStatSchema).optional(),
    overviewSectionEyebrow: optionalTrimmedString,
    overviewSectionTitle: optionalTrimmedString,
    overviewSectionDescription: optionalTrimmedString,
    tracksSectionEyebrow: optionalTrimmedString,
    tracksSectionTitle: optionalTrimmedString,
    tracksSectionDescription: optionalTrimmedString,
    partnerTypesSectionEyebrow: optionalTrimmedString,
    partnerTypesSectionTitle: optionalTrimmedString,
    partnerTypesSectionDescription: optionalTrimmedString,
    nextStepsSectionEyebrow: optionalTrimmedString,
    nextStepsSectionTitle: optionalTrimmedString,
    nextStepsSectionDescription: optionalTrimmedString,
    overviewVideoUrl: optionalTrimmedString,
    overviewVideoTitle: optionalTrimmedString,
    valueCards: z.array(partnershipOverviewCardSchema).optional(),
    partnerTypeCards: z.array(partnershipOverviewCardSchema).optional(),
    nextSteps: z.array(sitePageRouteCardSchema).optional(),
  })
  .partial();

export type PartnershipOverviewPayload = z.infer<typeof partnershipOverviewSchema>;

export const partnershipTrackSchema = z
  .object({
    slug: z.string().trim().min(2).optional(),
    eyebrow: optionalTrimmedString,
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    tagline: optionalTrimmedString,
    heroImage: optionalTrimmedString,
    snapshotEyebrow: optionalTrimmedString,
    stats: z.array(highlightStatSchema).optional(),
    overviewSectionEyebrow: optionalTrimmedString,
    overviewSectionTitle: optionalTrimmedString,
    overviewSectionDescription: optionalTrimmedString,
    overviewCardBadgeLabel: optionalTrimmedString,
    focusCards: z.array(partnershipFocusCardSchema).optional(),
    howItWorksSectionEyebrow: optionalTrimmedString,
    howItWorksSectionTitle: optionalTrimmedString,
    howItWorksSectionDescription: optionalTrimmedString,
    howItWorks: z.array(partnershipProcessStepSchema).optional(),
    scenariosSectionEyebrow: optionalTrimmedString,
    scenariosSectionTitle: optionalTrimmedString,
    scenariosSectionDescription: optionalTrimmedString,
    scenarios: z.array(partnershipScenarioSchema).optional(),
    faqsSectionEyebrow: optionalTrimmedString,
    faqsSectionTitle: optionalTrimmedString,
    faqsSectionDescription: optionalTrimmedString,
    faqs: z.array(partnershipFaqSchema).optional(),
    contactSectionEyebrow: optionalTrimmedString,
    contactCta: partnershipContactCtaSchema.optional(),
    relatedSectionEyebrow: optionalTrimmedString,
    relatedSectionTitle: optionalTrimmedString,
    relatedSectionDescription: optionalTrimmedString,
    related: z.array(sitePageRouteCardSchema).optional(),
    overviewVideoUrl: optionalTrimmedString,
    overviewVideoTitle: optionalTrimmedString,
  })
  .partial();

export type PartnershipTrackPayload = z.infer<typeof partnershipTrackSchema>;

// ─── User validators ───────────────────────────────────────────────────────────

export const userSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  email: z.string().trim().email("Please enter a valid email address."),
  role: z.enum(["super-admin", "editor", "viewer", "file-server-only"]).default("viewer"),
  status: z.enum(["active", "inactive"]).default("active"),
  notes: optionalTrimmedString,
});

export type UserPayload = z.infer<typeof userSchema>;

// ─── Admin update schemas for operational records ───────────────────────────

export const applicationAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "shortlisted", "rejected", "enrolled"]),
  notes: optionalTrimmedString,
});

export type ApplicationAdminUpdatePayload = z.infer<typeof applicationAdminUpdateSchema>;

export const contactMessageAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "archived"]),
  notes: optionalTrimmedString,
});

export type ContactMessageAdminUpdatePayload = z.infer<typeof contactMessageAdminUpdateSchema>;
