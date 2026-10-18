import type { Partner } from "@/components/home/patrners-strip";
import type {
  ArticleSeed,
  DepartmentProfile,
  HighlightStat,
  ImpactOverviewContent,
  InitiativePage,
  NewsHubContent,
  OrganisationOverviewContent,
  OrganisationServicePage,
  PartnershipOverviewContent,
  PartnershipTrackPage,
  RouteCard,
  SitePage,
  TrainingCohort,
  TrainingProcessStep,
  WhatWeDoOverviewContent,
} from "@/types/content";
import type {
  PageSection,
  SectionActionContent,
  SectionMediaContent,
  SectionItemContent,
  SectionMetricContent,
} from "@/types/page-sections";

/**
 * Design-phase placeholder photography.
 *
 * ITFYG replaces every image on the site before launch, so nothing here is a
 * record of a real ITFYG cohort, graduate or event. Each entry therefore pairs
 * the frame with a description of what the photograph actually shows, and call
 * sites use that description rather than inventing an ITFYG-specific caption
 * around a stock image. A CMS-supplied image and alt always win over these.
 */
const editorialMedia = {
  classroom: {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85",
    alt: "A group of students learning together in an informal collaborative setting",
  },
  facilitator: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85",
    alt: "A coding mentor and learner reviewing work together on a computer",
  },
  girls: {
    src: "https://images.unsplash.com/photo-1744809495173-217ca4faa8bc?auto=format&fit=crop&w=1600&q=85",
    alt: "A schoolgirl in Accra working carefully on a classroom exercise",
  },
  graduation: {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85",
    alt: "Young people smiling and standing together outdoors",
  },
  speaker: {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=85",
    alt: "A facilitator leading a learning session in front of a group",
  },
  learners: {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=85",
    alt: "Learners collaborating around laptops during a software development session",
  },
  presentation: {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85",
    alt: "A young team discussing ideas together around a work table",
  },
  community: {
    src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85",
    alt: "Young learners gathered during an educational community session",
  },
  belief: {
    src: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=1200&q=85",
    alt: "A young Ghanaian university student concentrating on work at a laptop",
  },
} as const satisfies Record<string, SectionMediaContent>;

/**
 * A section headline sets one phrase in italic and the accent colour. Where the
 * CMS headline has punctuation the renderer derives that phrase itself; these
 * headlines either have none to derive from, or read better broken elsewhere,
 * so the phrase is named here.
 *
 * Each is a substring of the seeded title. If an editor rewrites the title in
 * the CMS the accent simply stops matching and the headline falls back to a
 * derived accent, so this can go stale but never break.
 */
function accentPhrase(title: string, phrase: string): string | undefined {
  return title.includes(phrase) ? phrase : undefined;
}

function actions(values: { label: string; href: string }[]): SectionActionContent[] {
  return values.filter((value) => value.label.trim() && value.href.trim()).map((value, index) => ({
    ...value,
    style: index === 0 ? "gold" : "light",
  }));
}

function metrics(values: HighlightStat[]): SectionMetricContent[] {
  return values.filter((value) => value.value.trim() && value.label.trim()).map((value, index) => ({
    id: `metric-${index}-${value.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    value: value.value,
    label: value.label,
    explanation: value.description,
  }));
}

function routeItems(values: RouteCard[]): SectionItemContent[] {
  return values.filter((value) => value.title.trim() && value.href.trim()).map((value, index) => ({
    id: `route-${index}-${value.href.replace(/[^a-z0-9]+/gi, "-")}`,
    eyebrow: value.eyebrow,
    title: value.title,
    body: value.description,
    media: value.image ? { src: value.image, alt: value.imageAlt || value.title } : undefined,
    action: { label: `Explore ${value.title}`, href: value.href, style: "text" },
  }));
}

export function buildWhoWeAreSections(page: SitePage): PageSection[] {
  const [story, mission, vision, ...principles] = page.sections;
  const primaryMedia = page.heroImage || editorialMedia.classroom.src;

  return [
    {
      id: "who-hero", componentType: "hero", variant: "split", theme: "warm",
      slides: [{
        id: "who-hero-slide", eyebrow: page.eyebrow, title: page.title, body: page.description,
        media: { src: primaryMedia, alt: page.heroImageAlt || editorialMedia.classroom.alt },
        actions: actions(page.ctas), caption: page.intro,
      }],
    },
    {
      id: "who-story", componentType: "mediaNarrative", variant: "split", anchor: "story", navLabel: "Our story", theme: "paper",
      heading: { eyebrow: story?.title || "Our story", title: page.overviewTitle || "We started with access. The work grew into opportunity.", body: page.overviewDescription || story?.body || page.intro },
      media: { src: page.principlesImage || editorialMedia.facilitator.src, alt: page.principlesImageAlt || editorialMedia.facilitator.alt },
      items: story?.bullets?.length ? [{ id: "story-points", title: "What the work keeps learning", bullets: story.bullets }] : undefined,
    },
    {
      // `page.intro` used to be piped in here as the headline. It is a
      // paragraph of prose, so the manifesto rendered a 300-character display
      // heading; the statement belongs in `principlesHeroTitle`, which the CMS
      // already exposes and nothing else on this page consumes.
      id: "who-manifesto", componentType: "editorialIntro", variant: "manifesto", anchor: "belief", navLabel: "What we believe", theme: "navy",
      heading: {
        eyebrow: "What we believe",
        title: page.principlesHeroTitle || "Talent is everywhere. Opportunity should be too.",
        titleAccent: accentPhrase(page.principlesHeroTitle || "", "as the work grows."),
        body: page.description || page.intro,
      },
      media: editorialMedia.belief,
      metrics: metrics(page.stats),
    },
    {
      id: "who-mission", componentType: "featureCollection", variant: "featuredPair", anchor: "mission", navLabel: "Mission", theme: "mist",
      heading: { eyebrow: page.operatingEyebrow || "Mission and vision", title: page.operatingTitle || "The destination shapes the way we work.", body: page.operatingDescription },
      items: [mission, vision].filter(Boolean).map((item, index) => ({ id: `mission-${index}`, title: item!.title, body: item!.body, bullets: item!.bullets, media: { src: index === 0 ? editorialMedia.learners.src : editorialMedia.graduation.src, alt: index === 0 ? editorialMedia.learners.alt : editorialMedia.graduation.alt } })),
    },
    {
      id: "who-principles", componentType: "linkedIndex", variant: "rows", anchor: "principles", navLabel: "Principles", theme: "paper",
      heading: { eyebrow: page.principlesEyebrow || "Principles", title: page.principlesTitle || "Principles that keep the work grounded.", body: page.principlesDescription },
      items: principles.filter((item) => item.title || item.body).map((item, index) => ({ id: `principle-${index}`, title: item.title, body: item.body, bullets: item.bullets, action: { label: "Learn more", href: "/who-we-are", style: "text" } })),
    },
    {
      id: "who-people", componentType: "mediaNarrative", variant: "capsule", anchor: "people", navLabel: "People", theme: "warm",
      heading: { eyebrow: "Our people", title: "Built by people who keep the work close to the learner.", body: "Meet the team that organises, teaches, coordinates and keeps the mission moving." },
      media: { src: editorialMedia.presentation.src, alt: editorialMedia.presentation.alt },
      actions: [{ label: "Meet the team", href: "/who-we-are/team", style: "navy" }],
    },
    {
      id: "who-partners", componentType: "relationshipMap", variant: "orbit", anchor: "partners", navLabel: "Partners", theme: "mist",
      heading: { eyebrow: "Our ecosystem", title: "No organisation builds an ecosystem alone.", body: page.exploreDescription }, centerLabel: "IT For Youth Ghana",
      items: routeItems(page.related.length ? page.related : [{ title: "Our partners", description: "Organisations helping extend digital opportunity.", href: "/who-we-are/partners" }]),
    },
    {
      id: "who-closing", componentType: "callToAction", variant: "band", theme: "paper",
      heading: { eyebrow: page.nextStepEyebrow || "Keep exploring", title: page.nextStepTitle || "Who we are matters because of what young people can become.", body: page.nextStepDescription || page.exploreDescription },
      actions: actions(page.ctas.length ? page.ctas : [{ label: "Explore our work", href: "/what-we-do" }]),
    },
  ];
}

/**
 * Adopted from `docs/design_templates/03-what-we-do.html`.
 *
 * The template does not treat the eight initiatives as eight equal cards. Four
 * carry their own chapter, the Entrepreneurship Hub's chapter is followed by its
 * own venture path, and the three community programmes are read as one idea
 * ("Opportunity has to travel.") rather than three more chapters. Everything
 * still appears in the index below, so nothing is hidden by the grouping.
 */
const WHAT_WE_DO_CHAPTERS = ["youth-academy", "girls-in-tech", "entrepreneurship-hub", "code-impact-challenge"] as const;
const WHAT_WE_DO_COMMUNITY = ["rural-tech-connect", "community-outreach", "tech-clubs"] as const;

export function buildWhatWeDoSections(content: WhatWeDoOverviewContent, initiatives: InitiativePage[]): PageSection[] {
  const toItem = (initiative: InitiativePage): SectionItemContent => ({
    id: `initiative-${initiative.slug}`, eyebrow: initiative.eyebrow, title: initiative.title,
    body: initiative.description || initiative.tagline,
    media: { src: initiative.overviewImage || initiative.heroImage, alt: initiative.sectionContent?.overviewImageAlt || initiative.title },
    action: { label: `Explore ${initiative.title}`, href: `/what-we-do/${initiative.slug}`, style: "text" as const },
    bullets: initiative.objectives?.slice(0, 3),
  });

  const bySlug = new Map(initiatives.map((initiative) => [initiative.slug, initiative]));
  const pick = (slugs: readonly string[]) => slugs.map((slug) => bySlug.get(slug)).filter((entry): entry is InitiativePage => Boolean(entry));

  const initiativeItems = initiatives.map(toItem);
  const chapterSources = pick(WHAT_WE_DO_CHAPTERS);
  // A CMS that renamed or removed the template's four falls back to whatever
  // the first four initiatives are, so the page is never left without chapters.
  const chapters = chapterSources.length ? chapterSources : initiatives.slice(0, 4);
  const communitySources = pick(WHAT_WE_DO_COMMUNITY);

  const programmeChapters: PageSection[] = chapters.map((initiative, index) => {
    const item = toItem(initiative);
    return {
      id: `work-programme-${index + 1}`,
      componentType: "mediaNarrative",
      variant: (["split", "capsule", "collage", "overlay"] as const)[index % 4],
      anchor: index === 0 ? "programmes" : undefined,
      navLabel: index === 0 ? "Programmes" : undefined,
      theme: (["mist", "warm", "paper", "navy"] as const)[index % 4],
      // The initiative's tagline is its own editorial line; `overviewTitle` is
      // shared boilerplate and gave all four chapters an identical headline.
      heading: { eyebrow: initiative.title, title: initiative.tagline || item.title, body: item.body },
      media: item.media ?? editorialMedia.learners,
      secondaryMedia: index === 2 ? initiative.gallery.slice(0, 2).map((image) => ({ src: image.src, alt: image.alt || editorialMedia.learners.alt })) : undefined,
      items: item.bullets?.length ? [{ id: `${item.id}-objectives`, title: "What this pathway develops", bullets: item.bullets }] : undefined,
      actions: item.action ? [item.action] : undefined,
    };
  });

  // The venture path sits directly under the chapter it belongs to, so the
  // chapter list is split around it rather than the path being appended.
  const venture = bySlug.get("entrepreneurship-hub");
  const ventureAt = chapters.findIndex((initiative) => initiative.slug === "entrepreneurship-hub");
  const ventureSteps = venture?.howItWorks.slice(0, 4) ?? [];
  const cut = ventureAt >= 0 && ventureSteps.length ? ventureAt + 1 : programmeChapters.length;
  const chaptersBeforeVenture = programmeChapters.slice(0, cut);
  const chaptersAfterVenture = programmeChapters.slice(cut);

  return [
    { id: "work-hero", componentType: "hero", variant: "immersive", theme: "warm", slides: [{ id: "work-hero-slide", eyebrow: content.eyebrow, title: content.title, titleAccent: accentPhrase(content.title, "expanding youth digital opportunity in Ghana"), body: content.description, media: { src: content.heroImage || editorialMedia.learners.src, alt: editorialMedia.learners.alt }, actions: actions([{ label: "Explore programmes", href: "#programmes" }, { label: "Apply for training", href: "/apply-for-training" }]) }] },
    { id: "work-journey", componentType: "processPath", variant: "bridge", anchor: "journey", navLabel: "The journey", theme: "paper", heading: { eyebrow: content.overviewSectionEyebrow || "One mission, different pathways", title: content.overviewSectionTitle || "Not every learner needs the same door.", body: content.overviewSectionDescription }, items: content.pathwayCards.map((stage, index) => ({ id: `journey-${index}`, title: stage.title, body: stage.description })) },
    ...chaptersBeforeVenture,
    ...(venture && ventureSteps.length ? [{
      id: "work-venture", componentType: "processPath", variant: "venture", theme: "paper",
      heading: {
        eyebrow: venture.sectionContent?.howItWorksEyebrow || "A venture pathway",
        title: venture.sectionContent?.howItWorksTitle || "Ideas become stronger when someone helps you test them.",
        body: venture.sectionContent?.howItWorksDescription || venture.tagline,
      },
      media: { src: venture.heroImage || editorialMedia.presentation.src, alt: editorialMedia.presentation.alt },
      items: ventureSteps.map((step, index) => ({ id: `venture-${index}`, eyebrow: step.number, title: step.title, body: step.description })),
    } as PageSection] : []),
    ...chaptersAfterVenture,
    ...(communitySources.length ? [{
      id: "work-community", componentType: "featureCollection", variant: "overlay",
      anchor: "community", navLabel: "Beyond the room", theme: "paper",
      heading: {
        eyebrow: "Beyond the training room",
        title: "Opportunity has to travel.",
        body: "Digital opportunity should not stop at the edge of a city. These programmes carry the work into schools, districts and communities that a single training room never reaches.",
      },
      // The lead card states the idea; the two beside it name the programmes.
      items: communitySources.map((initiative, index) => {
        const item = toItem(initiative);
        return index === 0 ? { ...item, eyebrow: initiative.title, title: initiative.tagline || item.title } : item;
      }),
    } as PageSection] : []),
    { id: "work-gallery", componentType: "featureCollection", variant: "filmstrip", anchor: "gallery", navLabel: "In action", theme: "navy", heading: { eyebrow: content.gallerySectionEyebrow || "Inside the work", title: content.gallerySectionTitle || "The programmes look different because the moments inside them are different.", body: content.gallerySectionDescription }, items: content.galleryItems.map((item, index) => ({ id: `gallery-${index}`, title: item.title, body: item.description, media: { src: item.type === "video" ? item.thumbnailUrl || item.url : item.url, alt: item.title } })) },
    { id: "work-index", componentType: "linkedIndex", variant: "rows", anchor: "index", navLabel: "Programme index", theme: "mist", heading: { eyebrow: content.nextStepsSectionEyebrow || "Programme index", title: content.nextStepsSectionTitle || "Find the path that fits.", body: content.nextStepsSectionDescription }, items: initiativeItems },
    { id: "work-closing", componentType: "callToAction", variant: "band", theme: "paper", heading: { eyebrow: "Where to start", title: "There is more than one way into the work.", body: content.nextStepsSectionDescription || content.description }, actions: actions([{ label: "Apply for training", href: "/apply-for-training" }, { label: "Partner with us", href: "/partner-with-us" }]) },
  ];
}


export function buildDepartmentsSections(departments: DepartmentProfile[]): PageSection[] {
  const published = departments.filter((department) => department.status === "published");
  const items = published.map((department) => ({
    id: `department-${department.slug}`, eyebrow: department.eyebrow, title: department.title,
    body: department.summary || department.description,
    media: department.heroImage ? { src: department.heroImage, alt: `${department.title} team and programme activity` } : undefined,
    bullets: department.responsibilities.slice(0, 3),
    action: { label: `Explore ${department.title}`, href: `/departments/${department.slug}`, style: "text" as const },
  }));
  const allStats = published.flatMap((department) => department.stats).slice(0, 4);

  return [
    { id: "departments-hero", componentType: "hero", variant: "split", theme: "warm", slides: [{ id: "departments-hero-slide", eyebrow: "Organisation ecosystem", title: "One mission. Many systems making it possible.", body: "Explore the teams that turn IT For Youth Ghana's mission into programmes, partnerships, operations and learner support.", media: { src: editorialMedia.classroom.src, alt: editorialMedia.classroom.alt }, actions: actions([{ label: "Explore the ecosystem", href: "#map" }, { label: "Meet the team", href: "/who-we-are/team" }]) }] },
    { id: "departments-intro", componentType: "editorialIntro", variant: "centered", theme: "paper", heading: { eyebrow: "How we work", title: "Departments are connected parts of one learner journey.", body: "Each team owns a distinct responsibility while sharing the same outcome: practical, dependable routes into digital opportunity." }, metrics: metrics(allStats) },
    { id: "departments-map", componentType: "relationshipMap", variant: "network", anchor: "map", navLabel: "Ecosystem", theme: "mist", heading: { eyebrow: "The organisation map", title: "Different functions. One connected mission.", body: "Move through the network to see what each department owns and how it supports delivery." }, centerLabel: "One mission", items },
    { id: "departments-delivery", componentType: "featureCollection", variant: "featuredPair", anchor: "delivery", navLabel: "Delivery", theme: "paper", heading: { eyebrow: "Programme delivery", title: "The point where strategy becomes an experience for a learner." }, items: items.filter((item) => /program|training|outreach|community/i.test(item.title)).slice(0, 3) },
    { id: "departments-systems", componentType: "processPath", variant: "numbered", theme: "navy", heading: { eyebrow: "Enabling systems", title: "The work also needs systems that make it dependable." }, items: items.filter((item) => !/program|training|outreach|community/i.test(item.title)).slice(0, 4) },
    { id: "departments-communications", componentType: "mediaNarrative", variant: "collage", theme: "warm", heading: { eyebrow: "Communication", title: "The work has to be understood, not merely completed.", body: "Clear communication connects learner experience, public accountability and future partnerships." }, media: { src: editorialMedia.speaker.src, alt: editorialMedia.speaker.alt }, secondaryMedia: [{ src: editorialMedia.presentation.src, alt: editorialMedia.presentation.alt }, { src: editorialMedia.community.src, alt: editorialMedia.community.alt }] },
    { id: "departments-people", componentType: "mediaNarrative", variant: "capsule", theme: "mist", heading: { eyebrow: "People systems", title: "Strong programmes still depend on strong people systems.", body: "Leadership, operations, safeguarding and talent development create the conditions in which programme teams can do their best work." }, media: { src: editorialMedia.facilitator.src, alt: editorialMedia.facilitator.alt }, actions: [{ label: "Meet the team", href: "/who-we-are/team", style: "navy" }] },
    { id: "departments-index", componentType: "linkedIndex", variant: "rows", anchor: "index", navLabel: "Department index", theme: "paper", heading: { eyebrow: "Directory", title: "Explore each part of the organisation." }, items },
    { id: "departments-closing", componentType: "callToAction", variant: "band", theme: "paper", heading: { eyebrow: "The connected mission", title: "Departments make sense when you can see the mission they support.", body: "Explore the programmes and partnerships these teams make possible." }, actions: actions([{ label: "What we do", href: "/what-we-do" }, { label: "Partner with us", href: "/partner-with-us" }]) },
  ];
}

export function buildTrainingSections(
  page: SitePage,
  cohorts: TrainingCohort[],
  process: TrainingProcessStep[],
): PageSection[] {
  const [support, ...focus] = page.sections;
  const courseRoute = page.related.find((card) => /course/i.test(`${card.title} ${card.href}`));
  const eligibilityRoute = page.related.find((card) => /who-can-apply|eligible|fit/i.test(`${card.title} ${card.href}`));

  return [
    { id: "training-hero", componentType: "hero", variant: "split", theme: "warm", slides: [{ id: "training-hero-slide", eyebrow: page.eyebrow, title: page.title, body: page.description, media: { src: page.heroImage || editorialMedia.facilitator.src, alt: page.heroImageAlt || editorialMedia.facilitator.alt }, actions: actions(page.ctas), caption: page.intro }] },
    { id: "training-intro", componentType: "editorialIntro", variant: "split", theme: "paper", heading: { eyebrow: "Before you begin", title: page.overviewTitle || "You do not need to know everything before you begin.", body: page.overviewDescription || page.intro }, media: { src: editorialMedia.learners.src, alt: editorialMedia.learners.alt }, items: focus.slice(0, 2).map((item, index) => ({ id: `training-intro-${index}`, title: item.title, body: item.body })) },
    { id: "training-pathway", componentType: "processPath", variant: "arc", anchor: "pathway", navLabel: "Application path", theme: "mist", heading: { eyebrow: page.processEyebrow || "How to apply", title: page.processTitle || "A clear path from interest to training.", body: page.processDescription }, items: process.map((step, index) => ({ id: `training-step-${index}`, eyebrow: step.number, title: step.title, body: step.description })) },
    { id: "training-courses", componentType: "linkedIndex", variant: "tiles", anchor: "courses", navLabel: "Courses", theme: "paper", heading: { eyebrow: page.operatingEyebrow || "Courses", title: page.operatingTitle || "Choose a direction. Then go deeper.", body: page.operatingDescription }, items: routeItems(courseRoute ? [courseRoute, ...page.related.filter((card) => card !== courseRoute).slice(0, 2)] : page.related) },
    { id: "training-experience", componentType: "mediaNarrative", variant: "overlay", theme: "navy", heading: { eyebrow: "Inside the experience", title: "Less watching. More doing.", body: focus[0]?.body || support?.body || page.description }, media: { src: editorialMedia.presentation.src, alt: editorialMedia.presentation.alt }, items: focus.slice(0, 3).map((item, index) => ({ id: `training-focus-${index}`, title: item.title, body: item.body, bullets: item.bullets })) },
    { id: "training-eligibility", componentType: "featureCollection", variant: "mosaic", anchor: "eligibility", navLabel: "Who can apply", theme: "warm", heading: { eyebrow: "Who can apply", title: "Readiness is more than previous experience.", body: eligibilityRoute?.description || support?.body }, items: focus.length ? focus.map((item, index) => ({ id: `training-fit-${index}`, title: item.title, body: item.body, bullets: item.bullets, media: { src: index % 2 === 0 ? editorialMedia.girls.src : editorialMedia.classroom.src, alt: index % 2 === 0 ? editorialMedia.girls.alt : editorialMedia.classroom.alt } })) : routeItems(eligibilityRoute ? [eligibilityRoute] : page.related.slice(0, 3)) },
    { id: "training-outcomes", componentType: "metricStory", variant: "mosaic", theme: "mist", heading: { eyebrow: page.principlesEyebrow || "Beyond the course", title: page.principlesTitle || "The course is not the destination.", body: page.principlesDescription }, metrics: metrics(page.stats.length ? page.stats : [{ value: `${cohorts.length}`, label: "Cohorts listed", description: "Current and upcoming routes into training." }]), media: { src: editorialMedia.graduation.src, alt: editorialMedia.graduation.alt } },
    { id: "training-story", componentType: "mediaNarrative", variant: "capsule", theme: "paper", heading: { eyebrow: "Learner growth", title: "The confidence to build is part of the outcome too.", body: support?.body || page.intro }, media: { src: editorialMedia.speaker.src, alt: editorialMedia.speaker.alt }, items: support?.bullets?.length ? [{ id: "training-support", title: support.title, bullets: support.bullets }] : undefined },
    { id: "training-apply", componentType: "callToAction", variant: "application", anchor: "apply", navLabel: "Apply", theme: "paper", heading: { eyebrow: page.exploreEyebrow || "Ready to apply", title: page.exploreTitle || "Choose the course that fits your next step, then start the application.", body: page.exploreDescription }, actions: actions(page.ctas.length ? page.ctas : [{ label: "Browse courses", href: "/apply-for-training/courses" }]) },
  ];
}

export function buildOrganisationSections(
  content: OrganisationOverviewContent,
  services: OrganisationServicePage[],
): PageSection[] {
  const serviceItems: SectionItemContent[] = services.map((service) => ({
    id: `service-${service.slug}`, eyebrow: service.eyebrow, title: service.title,
    body: service.description || service.tagline,
    media: { src: service.heroImage, alt: `${service.title} partnership activity` },
    bullets: service.overviewCards.flatMap((card) => card.bullets).slice(0, 3),
    action: { label: `Explore ${service.title}`, href: `/for-organisations/${service.slug}`, style: "text" },
  }));
  const graduates = serviceItems.find((item) => /talent|graduate|recruit/i.test(item.title));
  const volunteering = serviceItems.find((item) => /volunteer|employee|mentor/i.test(item.title));

  return [
    { id: "org-hero", componentType: "hero", variant: "split", theme: "warm", slides: [{ id: "org-hero-slide", eyebrow: content.eyebrow, title: content.title, titleAccent: accentPhrase(content.title, "in ways that create practical value on both sides"), body: content.description, media: { src: content.heroImage || editorialMedia.presentation.src, alt: editorialMedia.presentation.alt }, actions: actions([{ label: "Explore services", href: "#services" }, { label: "Start a conversation", href: "/contact" }]) }] },
    { id: "org-intro", componentType: "editorialIntro", variant: "split", theme: "paper", heading: { eyebrow: content.overviewSectionEyebrow || "Why collaborate", title: content.overviewSectionTitle || "Good partnership should create something neither side could do alone.", body: content.overviewSectionDescription || content.description }, media: { src: editorialMedia.classroom.src, alt: editorialMedia.classroom.alt }, metrics: metrics(content.stats), items: content.valueCards.slice(0, 2).map((card, index) => ({ id: `org-value-${index}`, title: card.title, body: card.description })) },
    { id: "org-services", componentType: "featureCollection", variant: "featuredPair", anchor: "services", navLabel: "Services", theme: "mist", heading: { eyebrow: content.servicesSectionEyebrow || "Ways to work together", title: content.servicesSectionTitle || "Different organisations need different forms of partnership.", body: content.servicesSectionDescription }, items: serviceItems },
    { id: "org-engagement", componentType: "processPath", variant: "numbered", anchor: "engagement", navLabel: "Engagement", theme: "paper", heading: { eyebrow: content.engagementSectionEyebrow || "Engagement model", title: content.engagementSectionTitle || "Start with the outcome, then design the partnership around it.", body: content.engagementSectionDescription }, items: content.engagementCards.map((card, index) => ({ id: `org-engagement-${index}`, title: card.title, body: card.description })) },
    { id: "org-evidence", componentType: "metricStory", variant: "mosaic", anchor: "evidence", navLabel: "Evidence", theme: "navy", heading: { eyebrow: "Visible outcomes", title: "Partnership should be visible in the work, not only in the announcement.", body: content.overviewSectionDescription }, metrics: metrics(content.stats), media: { src: editorialMedia.graduation.src, alt: editorialMedia.graduation.alt } },
    { id: "org-graduates", componentType: "mediaNarrative", variant: "split", theme: "paper", heading: { eyebrow: graduates?.eyebrow || "Graduate talent", title: graduates?.title || "Talent pipelines should feel closer to the work people actually do.", body: graduates?.body || content.valueCards[0]?.description }, media: graduates?.media || { src: editorialMedia.speaker.src, alt: editorialMedia.speaker.alt }, actions: graduates?.action ? [graduates.action] : [{ label: "Explore services", href: "#services", style: "navy" }] },
    { id: "org-volunteer", componentType: "mediaNarrative", variant: "capsule", theme: "mist", heading: { eyebrow: volunteering?.eyebrow || "Employee volunteering", title: volunteering?.title || "Give expertise somewhere it can become useful.", body: volunteering?.body || content.valueCards[1]?.description }, media: volunteering?.media || { src: editorialMedia.facilitator.src, alt: editorialMedia.facilitator.alt }, actions: volunteering?.action ? [volunteering.action] : [{ label: "Start a conversation", href: "/contact", style: "navy" }] },
    { id: "org-story", componentType: "mediaNarrative", variant: "overlay", theme: "navy", heading: { eyebrow: "Partnership stories", title: "The best partnership stories are about what became possible.", body: content.valueCards[2]?.description || content.description }, media: { src: editorialMedia.community.src, alt: editorialMedia.community.alt }, actions: [{ label: "See our impact", href: "/our-impact", style: "light" }] },
    { id: "org-closing", componentType: "callToAction", variant: "partnership", anchor: "contact", navLabel: "Contact", theme: "paper", heading: { eyebrow: content.nextStepsSectionEyebrow || "Start the conversation", title: content.nextStepsSectionTitle || "Tell us what your organisation wants to make possible.", body: content.nextStepsSectionDescription }, actions: actions(content.nextSteps.length ? content.nextSteps.map((card) => ({ label: card.title, href: card.href })) : [{ label: "Contact ITFYG", href: "/contact" }]) },
  ];
}

export function buildPartnershipSections(
  content: PartnershipOverviewContent,
  tracks: PartnershipTrackPage[],
): PageSection[] {
  const trackItems: SectionItemContent[] = tracks.map((track) => ({
    id: `track-${track.slug}`, eyebrow: track.eyebrow, title: track.title,
    body: track.description || track.tagline,
    media: { src: track.image || track.heroImage, alt: track.imageAlt || `${track.title} collaboration` },
    action: { label: `Explore ${track.title}`, href: `/partner-with-us/${track.slug}`, style: "text" },
  }));

  return [
    { id: "partner-hero", componentType: "hero", variant: "immersive", theme: "warm", slides: [{ id: "partner-hero-slide", eyebrow: content.eyebrow, title: content.title, titleAccent: accentPhrase(content.title, "in ways that are practical, credible, and locally grounded"), body: content.description, media: { src: content.heroImage || editorialMedia.community.src, alt: editorialMedia.community.alt }, actions: actions([{ label: "Explore the ecosystem", href: "#ecosystem" }, { label: "Start a conversation", href: "/contact" }]) }] },
    { id: "partner-intro", componentType: "editorialIntro", variant: "centered", theme: "paper", heading: { eyebrow: content.overviewSectionEyebrow || "Why partnership matters", title: content.overviewSectionTitle || "Meaningful opportunity has to connect the systems around a young person.", body: content.overviewSectionDescription || content.description }, metrics: metrics(content.stats) },
    { id: "partner-ecosystem", componentType: "relationshipMap", variant: "ecosystem", anchor: "ecosystem", navLabel: "Ecosystem", theme: "mist", heading: { eyebrow: content.tracksSectionEyebrow || "Partnership ecosystem", title: content.tracksSectionTitle || "Different institutions. Shared possibility.", body: content.tracksSectionDescription }, centerLabel: "Shared opportunity", items: trackItems },
    { id: "partner-sectors", componentType: "featureCollection", variant: "mosaic", anchor: "sectors", navLabel: "Partner types", theme: "paper", heading: { eyebrow: content.partnerTypesSectionEyebrow || "Partner types", title: content.partnerTypesSectionTitle || "The relationship changes depending on what each partner can make possible.", body: content.partnerTypesSectionDescription }, items: content.partnerTypeCards.map((card, index) => ({ id: `partner-type-${index}`, title: card.title, body: card.description, media: card.image ? { src: card.image, alt: card.imageAlt || card.title } : { src: index % 2 === 0 ? editorialMedia.presentation.src : editorialMedia.classroom.src, alt: index % 2 === 0 ? editorialMedia.presentation.alt : editorialMedia.classroom.alt } })) },
    { id: "partner-development", componentType: "mediaNarrative", variant: "split", theme: "navy", heading: { eyebrow: "Development partnership", title: "Connect local delivery with wider development goals.", body: content.valueCards[0]?.description || content.description }, media: { src: editorialMedia.community.src, alt: editorialMedia.community.alt }, items: content.valueCards.slice(1).map((card, index) => ({ id: `partner-value-${index}`, title: card.title, body: card.description })) },
    { id: "partner-model", componentType: "processPath", variant: "numbered", anchor: "model", navLabel: "Partnership model", theme: "paper", heading: { eyebrow: "How partnership works", title: "Start with the outcome, not the logo placement.", body: content.overviewSectionDescription }, items: content.valueCards.map((card, index) => ({ id: `partner-model-${index}`, title: card.title, body: card.description })) },
    { id: "partner-story", componentType: "mediaNarrative", variant: "overlay", theme: "navy", heading: { eyebrow: "Collaboration in practice", title: "Tell the story of what the collaboration enabled.", body: content.partnerTypesSectionDescription || content.description }, media: { src: editorialMedia.graduation.src, alt: editorialMedia.graduation.alt }, actions: [{ label: "Explore impact", href: "/our-impact", style: "light" }] },
    { id: "partner-index", componentType: "linkedIndex", variant: "rows", anchor: "index", navLabel: "Partner tracks", theme: "mist", heading: { eyebrow: "Find your route", title: "Choose the conversation that fits your organisation.", body: content.nextStepsSectionDescription }, items: trackItems },
    { id: "partner-closing", componentType: "callToAction", variant: "partnership", anchor: "contact", navLabel: "Contact", theme: "paper", heading: { eyebrow: content.nextStepsSectionEyebrow || "Start a conversation", title: content.nextStepsSectionTitle || "Tell us what your organisation wants to help make possible.", body: content.nextStepsSectionDescription }, actions: actions(content.nextSteps.length ? content.nextSteps.map((card) => ({ label: card.title, href: card.href })) : [{ label: "Contact ITFYG", href: "/contact" }]) },
  ];
}

export function buildImpactSections(
  content: ImpactOverviewContent,
  partners: Partner[],
): PageSection[] {
  const impactMetrics = metrics(content.stats);
  const [headlineMetric, ...supportingMetrics] = impactMetrics;
  const proofItems = content.proofPoints.filter(Boolean).map((point, index) => ({
    id: `proof-${index}`,
    title: index === 0 ? "Access" : index === 1 ? "Capability" : index === 2 ? "Opportunity" : `Evidence ${index + 1}`,
    body: point,
  }));

  return [
    { id: "impact-hero", componentType: "hero", variant: "data", theme: "warm", slides: [{ id: "impact-hero-slide", eyebrow: content.eyebrow, title: content.title, body: content.description, media: { src: content.heroImage || editorialMedia.graduation.src, alt: content.imageAlt || editorialMedia.graduation.alt }, metrics: impactMetrics.slice(0, 4), actions: actions([{ label: "Explore the evidence", href: "#evidence" }, { label: "Read impact reports", href: "/our-impact/reports" }]) }] },
    { id: "impact-intro", componentType: "editorialIntro", variant: "centered", theme: "paper", heading: { eyebrow: content.snapshotSectionEyebrow || "How we read impact", title: content.snapshotSectionTitle || "Count the reach. Then ask what changed.", body: content.snapshotSectionDescription || content.description }, items: proofItems.slice(0, 3) },
    { id: "impact-big-number", componentType: "metricStory", variant: "headline", theme: "navy", heading: { eyebrow: "Headline reach", title: "One number. Thousands of different journeys.", body: content.snapshotSectionDescription }, metrics: headlineMetric ? [headlineMetric] : [{ id: "impact-record", value: "Evidence", label: "Impact record", explanation: "Current impact figures are managed in the CMS." }], media: { src: content.image || editorialMedia.classroom.src, alt: content.imageAlt || editorialMedia.classroom.alt } },
    { id: "impact-arc", componentType: "processPath", variant: "arc", theme: "mist", heading: { eyebrow: "The impact pathway", title: "Impact should show a pathway, not just a total.", body: content.measurementSectionDescription }, items: proofItems.length ? proofItems : content.measurementCards.slice(0, 4).map((card, index) => ({ id: `impact-stage-${index}`, title: card.title, body: card.description })) },
    { id: "impact-reach", componentType: "mediaNarrative", variant: "split", theme: "paper", heading: { eyebrow: "Reach and context", title: "Impact has geography.", body: content.proofPoints.join(" ") || content.description }, media: { src: editorialMedia.community.src, alt: editorialMedia.community.alt }, items: content.measurementCards.slice(0, 2).map((card, index) => ({ id: `reach-${index}`, title: card.title, body: card.description, bullets: card.bullets })) },
    { id: "impact-stats", componentType: "metricStory", variant: "mosaic", anchor: "evidence", navLabel: "Evidence", theme: "mist", heading: { eyebrow: content.measurementSectionEyebrow || "Evidence", title: content.measurementSectionTitle || "Give different outcomes different visual weight.", body: content.measurementSectionDescription }, metrics: supportingMetrics.length ? supportingMetrics : impactMetrics, media: { src: editorialMedia.presentation.src, alt: editorialMedia.presentation.alt } },
    { id: "impact-story", componentType: "mediaNarrative", variant: "capsule", anchor: "story", navLabel: "Human story", theme: "navy", heading: { eyebrow: "Stories of change", title: "Impact becomes clearer when someone explains what changed.", body: "The testimonials and stories archive connects programme evidence with the experiences of learners, graduates and partners." }, media: { src: editorialMedia.speaker.src, alt: editorialMedia.speaker.alt }, actions: [{ label: "Read impact stories", href: "/our-impact/testimonials", style: "light" }] },
    { id: "impact-evidence", componentType: "linkedIndex", variant: "tiles", anchor: "routes", navLabel: "Evidence routes", theme: "paper", heading: { eyebrow: content.routesSectionEyebrow || "Evidence library", title: content.routesSectionTitle || "Different evidence needs different places to live.", body: content.routesSectionDescription }, items: routeItems(content.routeCards) },
    ...(partners.length ? [{ id: "impact-partners", componentType: "relationshipMap" as const, variant: "orbit" as const, theme: "mist" as const, heading: { eyebrow: "Partners", title: content.partnersHeading || "Impact is built with institutions and communities.", body: "These organisations help extend the reach and quality of the work." }, centerLabel: "Shared impact", items: partners.filter((partner) => partner.active !== false).slice(0, 8).map((partner, index) => ({ id: `impact-partner-${partner.id || index}`, title: partner.name, media: partner.logo ? { src: partner.logo, alt: `${partner.name} logo` } : undefined, action: { label: `Visit ${partner.name}`, href: partner.href || "/who-we-are/partners", style: "text" as const } })) }] : []),
    { id: "impact-closing", componentType: "callToAction", variant: "band", theme: "paper", heading: { eyebrow: "Move the work forward", title: "Help more young people move from access to capability to opportunity.", body: content.description }, actions: actions([{ label: "Partner with us", href: "/partner-with-us" }, { label: "Support the work", href: "/donate" }]) },
  ];
}

export function buildNewsSections(
  content: NewsHubContent,
  articles: ArticleSeed[],
): PageSection[] {
  const published = articles.filter((article) => article.status !== "draft" && article.status !== "archived");
  const sorted = [...published].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  const articleItems: SectionItemContent[] = sorted.map((article) => ({
    id: `article-${article.id || article.slug}`,
    eyebrow: article.type || article.category,
    title: article.title,
    body: article.excerpt,
    meta: article.publishedAt,
    media: article.coverImage ? { src: article.coverImage, alt: article.coverAlt || article.title } : undefined,
    action: { label: "Read article", href: `/news-and-updates/${article.category}/${article.slug}`, style: "text" },
  }));
  const [lead, ...remaining] = articleItems;

  return [
    { id: "news-hero", componentType: "hero", variant: "publication", theme: "warm", slides: [{ id: "news-hero-slide", eyebrow: content.eyebrow, title: content.title, body: content.description, media: lead?.media || { src: content.heroImage || editorialMedia.speaker.src, alt: editorialMedia.speaker.alt }, caption: lead?.title, actions: lead?.action ? [lead.action, ...actions(content.heroCtas).slice(0, 1)] : actions(content.heroCtas) }] },
    { id: "news-desk", componentType: "publicationFeed", variant: "newsDesk", anchor: "news-desk", navLabel: "News desk", theme: "paper", heading: { eyebrow: content.featuredSectionEyebrow, title: content.featuredSectionTitle || "A news desk, not a wall of identical cards.", body: content.featuredSectionDescription }, items: articleItems.slice(0, 5) },
    { id: "news-ideas", componentType: "publicationFeed", variant: "essayGrid", anchor: "ideas", navLabel: "Ideas", theme: "mist", heading: { eyebrow: content.editorialSectionEyebrow, title: content.editorialSectionTitle || "Some stories need room to think.", body: content.editorialSectionDescription }, items: remaining.filter((item) => /blog|idea|opinion|insight/i.test(`${item.eyebrow} ${item.title}`)).slice(0, 4).length ? remaining.filter((item) => /blog|idea|opinion|insight/i.test(`${item.eyebrow} ${item.title}`)).slice(0, 4) : remaining.slice(0, 4) },
    { id: "news-essay", componentType: "mediaNarrative", variant: "overlay", theme: "navy", heading: { eyebrow: content.latestSectionEyebrow, title: content.latestSectionTitle || "A good publication should help the organisation think in public.", body: content.latestSectionDescription }, media: { src: editorialMedia.facilitator.src, alt: editorialMedia.facilitator.alt }, items: content.editorialPillars.slice(0, 2).map((pillar, index) => ({ id: `editorial-pillar-${index}`, title: pillar.title, body: pillar.body, bullets: pillar.bullets })) },
    { id: "news-topics", componentType: "linkedIndex", variant: "tiles", anchor: "topics", navLabel: "Topics", theme: "paper", heading: { eyebrow: content.browseSectionEyebrow, title: content.browseSectionTitle || "Find the part of the story you care about.", body: content.browseSectionDescription }, items: routeItems(content.routeCards) },
    { id: "news-newsletter", componentType: "newsletterSignup", variant: "editorial", anchor: "newsletter", navLabel: "Newsletter", theme: "navy", heading: { eyebrow: content.subscribeSectionEyebrow, title: content.subscribeSectionTitle || "Follow the work as it develops.", body: content.subscribeSectionDescription }, interest: "news-and-updates" },
  ];
}
