import { featuredStory, heroStats, testimonials as homepageTestimonials } from "@/lib/content/site-config";
import type {
  HighlightStat,
  ImpactOverviewContent,
  ImpactReportsContent,
  ImpactSdgsContent,
  ImpactTestimonialsContent,
} from "@/types/content";

const impactStats: HighlightStat[] = heroStats;

export const impactOverviewContent: ImpactOverviewContent = {
  eyebrow: "Our impact",
  title: "See the evidence, the stories, and the wider systems change behind the work",
  description:
    "Impact is not only a number and it is not only a story. This section is designed to show both: the measurable reach of the programmes and the lived human outcomes that make those numbers matter.",
  heroImage: "/images/randomPictures/frontalgraduation.jpg",
  stats: impactStats,
  heroAsideEyebrow: "Why this section exists",
  snapshotSectionEyebrow: "Headline snapshot",
  snapshotSectionTitle: "The quickest view of what the work is reaching",
  snapshotSectionDescription:
    "These top-line indicators are not the full story, but they provide a fast and practical sense of scale before you move into deeper reporting, stories, and alignment frameworks.",
  measurementSectionEyebrow: "Measurement",
  measurementSectionTitle: "How we think about impact, not only how we count it",
  measurementSectionDescription:
    "The framework below helps explain what kinds of evidence matter most when trying to understand the difference the work is making.",
  measurementCardBadgeLabel: "Evidence lens",
  routesSectionEyebrow: "Impact routes",
  routesSectionTitle: "Go deeper based on the kind of evidence you need",
  routesSectionDescription:
    "Some audiences need report briefs. Others need stories, or a development-alignment lens. These routes are designed to support each of those needs clearly.",
  partnersHeading:
    "Partners, institutions, and collaborators helping make the impact possible",
  measurementCards: [
    {
      title: "Reach",
      description: "We look at how many young people, schools, and communities the work is actually touching across routes and regions.",
      image: "/images/randomPictures/studentslistening.jpg",
      imageAlt: "A large group of learners listening during a school outreach session",
      icon: "📍",
      bullets: [
        "Tracks participation across training, outreach, clubs, and public activations.",
        "Helps show whether the ecosystem is widening access or staying too narrow.",
        "Supports clearer conversations with schools, funders, and public partners.",
      ],
    },
    {
      title: "Inclusion",
      description: "We pay close attention to who is being reached, especially where gender, geography, and access barriers can distort opportunity.",
      image: "/images/randomPictures/groupofgirlsentrance.jpg",
      imageAlt: "Young women arriving together for a Girls in Tech session",
      icon: "⚖️",
      bullets: [
        "Supports more honest conversations about who still gets left out.",
        "Helps make inclusion a practical design question instead of a slogan.",
        "Connects directly to girls-focused work and wider access pathways.",
      ],
    },
    {
      title: "Transition",
      description: "The strongest impact stories usually involve what happens after first contact, not only during a programme moment itself.",
      image: "/images/randomPictures/frontalgraduation.jpg",
      imageAlt: "Graduates receiving certificates at the end of a cohort",
      icon: "🚀",
      bullets: [
        "Looks at movement into work, deeper learning, projects, or entrepreneurship.",
        "Helps show whether the work builds confidence and progression over time.",
        "Supports stronger employer and partner understanding of pathway value.",
      ],
    },
    {
      title: "Systems value",
      description: "Impact also lives in partnerships, school relationships, civic credibility, and the strength of the ecosystem around young people.",
      image: "/images/randomPictures/graduations.jpg",
      imageAlt: "Partners, facilitators and graduates together at a cohort graduation",
      icon: "🧩",
      bullets: [
        "Shows why collaboration routes matter alongside direct learner delivery.",
        "Helps frame the work for institutions and development actors.",
        "Supports a more realistic understanding of what sustainable impact requires.",
      ],
    },
  ],
  proofPoints: [
    "Quantitative evidence helps show reach, participation, and progression trends.",
    "Qualitative stories help explain confidence, aspiration, and lived change that numbers alone cannot carry.",
    "SDG alignment helps translate the work for partners who need a wider development lens.",
    "The section is designed to be credible for learners, donors, institutions, and employers at the same time.",
  ],
  routeCards: [
    {
      href: "/our-impact/reports",
      eyebrow: "Evidence",
      title: "Impact Reports",
      description: "Explore report briefs, headline metrics, and the core evidence themes shaping the work.",
    },
    {
      href: "/our-impact/testimonials",
      eyebrow: "Stories",
      title: "Testimonials",
      description: "Read and watch the human stories behind the numbers.",
    },
    {
      href: "/our-impact/sdgs",
      eyebrow: "Framework",
      title: "UN SDGs",
      description: "See how the work aligns with education, gender, work, innovation, and partnership goals.",
    },
  ],
};

export const impactReportsContent: ImpactReportsContent = {
  eyebrow: "Impact reports",
  title: "Evidence that makes the work easier to trust, understand, and support",
  description:
    "This page combines headline metrics, report briefs, and the core evidence themes that help explain what IT For Youth Ghana is changing and why that change matters.",
  heroImage: "/images/randomPictures/graduations.jpg",
  stats: impactStats,
  heroAsideEyebrow: "Reporting stance",
  snapshotSectionEyebrow: "Evidence snapshot",
  snapshotSectionTitle: "A quick view of the numbers before you open a brief",
  snapshotSectionDescription:
    "These top-line figures are meant to help readers orient themselves quickly before moving into the supporting documents and context below.",
  reportsSectionEyebrow: "Report briefs",
  reportsSectionTitle: "Open the latest evidence briefs and supporting notes",
  reportsSectionDescription:
    "These seeded report briefs give the route working downloads today, while leaving room for richer annual-report assets and PDFs later.",
  reportBadgeLabel: "Brief",
  methodSectionEyebrow: "Reading the evidence",
  methodSectionTitle: "What makes impact reporting credible here",
  methodSectionDescription:
    "These themes explain how the evidence is meant to be interpreted, especially by partners who need more than a simple list of metrics.",
  methodBadgeEyebrow: "Method notes",
  methodCardBadgeLabel: "Evidence theme",
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle:
    "Use the impact system based on what kind of proof you need next",
  nextStepsSectionDescription:
    "If the numbers raised questions, the stories and SDG routes below help provide the human and development context around them.",
  reportResources: [
    {
      id: "report-2025",
      year: "2025",
      title: "ITFY Impact Brief 2025",
      summary: "A concise snapshot of programme reach, learner progression, gender inclusion, and partner-supported growth indicators.",
      href: "/reports/itfy-impact-2025-brief.txt",
      fileLabel: "Download brief",
      highlights: [
        "Training and outreach reach summary",
        "Progression and employability signals",
        "Partnership and inclusion context",
      ],
    },
    {
      id: "report-2024",
      year: "2024",
      title: "ITFY Impact Brief 2024",
      summary: "A year-focused summary of cohort outcomes, school engagement, and the practical lessons shaping later programme design.",
      href: "/reports/itfy-impact-2024-brief.txt",
      fileLabel: "Download brief",
      highlights: [
        "Cohort and school-based activity overview",
        "Early evidence on learner confidence growth",
        "Programme lessons that informed the rebuild era",
      ],
    },
    {
      id: "report-sdg",
      year: "Framework",
      title: "ITFY SDG Alignment Brief",
      summary: "A supporting note on how the work maps into education, gender inclusion, decent work, innovation, and partnership goals.",
      href: "/reports/itfy-sdg-alignment-brief.txt",
      fileLabel: "Download brief",
      highlights: [
        "Goal-by-goal alignment summary",
        "Programme examples linked to each area",
        "Useful context for funders and development actors",
      ],
    },
  ],
  evidenceCards: [
    {
      title: "Headline metrics",
      description: "Top-line numbers help audiences understand scale quickly, but they matter most when paired with context.",
      icon: "📊",
      bullets: [
        "Youth trained and students reached are important signals of access.",
        "Female participation helps make inclusion visible in practical terms.",
        "Employment or transition outcomes show whether learning is moving beyond the classroom.",
      ],
    },
    {
      title: "Programme depth",
      description: "Not all impact comes from size. Some of the most important outcomes come from repetition, quality, and progression.",
      icon: "📚",
      bullets: [
        "Cohort depth and recurring engagement often matter more than one-off reach alone.",
        "School clubs, structured pathways, and challenge work add depth that broad activations cannot replace.",
        "This helps the organisation talk about substance, not only scale.",
      ],
    },
    {
      title: "Partner and ecosystem value",
      description: "Impact reporting should also show how institutions, schools, and collaborators help widen or sustain opportunity.",
      icon: "🤝",
      bullets: [
        "Partnerships expand access, trust, and implementation quality.",
        "The ecosystem around the learner is part of the impact story, not separate from it.",
        "This makes reports more useful for funders, public actors, and institutional partners.",
      ],
    },
    {
      title: "Learning and iteration",
      description: "Strong evidence does not only celebrate success. It also helps the team learn what needs to improve.",
      icon: "📝",
      bullets: [
        "Reports should clarify what is working, where gaps remain, and what is changing next.",
        "This strengthens trust because the story becomes more honest and less performative.",
        "It also supports better planning across future programmes and partnerships.",
      ],
    },
  ],
  methodologyPoints: [
    "Impact evidence is strongest when quantitative reach and qualitative learner voice are read together.",
    "Programme breadth matters, but depth, progression, and repeat engagement matter too.",
    "Partnership and institutional context often explain why some outcomes are possible and others remain hard.",
    "The reporting layer is designed to support donors, schools, partners, and learners without changing the core story for each audience.",
  ],
  related: [
    {
      href: "/our-impact/testimonials",
      eyebrow: "Stories",
      title: "Testimonials",
      description: "Pair report evidence with the lived learner, partner, and school stories behind it.",
    },
    {
      href: "/our-impact/sdgs",
      eyebrow: "Framework",
      title: "UN SDGs",
      description: "Translate programme outcomes into the wider development language partners may need.",
    },
    {
      href: "/partner-with-us/international-development",
      eyebrow: "Partner track",
      title: "International Development",
      description: "See how impact evidence supports donor- and agency-facing partnership trust.",
    },
  ],
};

export const impactTestimonialsContent: ImpactTestimonialsContent = {
  eyebrow: "Testimonials",
  title: "The human proof behind the numbers",
  description:
    "Stories show what it feels like when opportunity becomes more reachable, when confidence grows, and when support translates into real forward movement.",
  heroImage: "/images/randomPictures/UX4.jpg",
  heroAsideEyebrow: "Story themes",
  listSectionEyebrow: "Written and partner voices",
  listSectionTitle: "Different angles on what meaningful change feels like",
  listSectionDescription:
    "These stories are seeded to show the structure of the future testimonial system: learner progression, gender inclusion, partner trust, and transition into work.",
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle:
    "Use the wider impact system to add context around the stories",
  nextStepsSectionDescription:
    "Stories become more persuasive when they sit alongside the evidence base and the programme ecosystem they came from.",
  featuredStory: {
    label: featuredStory.label,
    headline: featuredStory.headline,
    quote: featuredStory.quote,
    name: featuredStory.name,
    role: featuredStory.role,
    programme: featuredStory.programme,
    backgroundImage: featuredStory.backgroundImage,
    videoUrl: featuredStory.videoUrl,
    primaryCtaLabel: featuredStory.primaryCtaLabel,
    secondaryCta: featuredStory.secondaryCta,
  },
  stories: [
    {
      id: "story-ama",
      title: "From training to first role",
      quote: homepageTestimonials[0]?.quote ?? "",
      name: homepageTestimonials[0]?.name ?? "Ama Kofi",
      role: homepageTestimonials[0]?.role ?? "Junior Developer",
      programme: homepageTestimonials[0]?.programme ?? "Digital Skills Bootcamp",
      year: homepageTestimonials[0]?.year ?? "Class of 2025",
      theme: "Employment transition",
      image: homepageTestimonials[0]?.avatar,
      format: "written",
    },
    {
      id: "story-efua",
      title: "Belonging in tech as a young woman",
      quote: homepageTestimonials[1]?.quote ?? "",
      name: homepageTestimonials[1]?.name ?? "Efua Asante",
      role: homepageTestimonials[1]?.role ?? "UX Designer",
      programme: homepageTestimonials[1]?.programme ?? "Girls in Tech",
      year: homepageTestimonials[1]?.year ?? "Class of 2024",
      theme: "Gender inclusion",
      image: homepageTestimonials[1]?.avatar,
      format: "written",
    },
    {
      id: "story-mensah",
      title: "A school partner sees the difference",
      quote: homepageTestimonials[2]?.quote ?? "",
      name: homepageTestimonials[2]?.name ?? "Mr. Isaac Mensah",
      role: homepageTestimonials[2]?.role ?? "Head of ICT",
      programme: homepageTestimonials[2]?.programme ?? "Community Outreach Partner",
      year: homepageTestimonials[2]?.year ?? "2026 partner voice",
      theme: "Institutional trust",
      image: homepageTestimonials[2]?.avatar,
      format: "partner",
    },
    {
      id: "story-belinda-video",
      title: "A graduate story in motion",
      quote: featuredStory.quote,
      name: featuredStory.name,
      role: featuredStory.role,
      programme: featuredStory.programme,
      year: "Featured story",
      theme: "Confidence and progression",
      image: "/images/randomPictures/UX4.jpg",
      format: "video",
    },
  ],
  themes: [
    "Employment transition",
    "Gender inclusion",
    "Institutional trust",
    "Confidence and progression",
  ],
  related: [
    {
      href: "/news-and-updates",
      eyebrow: "Stories",
      title: "News & Updates",
      description: "Follow the stories with fresher programme updates, blogs, and supporting context.",
    },
    {
      href: "/our-impact/reports",
      eyebrow: "Evidence",
      title: "Impact Reports",
      description: "Pair personal stories with the wider evidence base and headline metrics.",
    },
    {
      href: "/what-we-do",
      eyebrow: "Programmes",
      title: "What We Do",
      description: "See the initiative ecosystem these stories are emerging from.",
    },
  ],
};

export const impactSdgsContent: ImpactSdgsContent = {
  eyebrow: "UN SDGs",
  title: "How the work maps into wider development priorities",
  description:
    "The programmes are locally grounded first, but they also connect clearly to wider education, gender, work, innovation, inequality, and partnership goals that many collaborators need to understand.",
  heroImage: "/images/randomPictures/groupworkstudents.jpg",
  stats: impactStats,
  heroAsideEyebrow: "Alignment note",
  snapshotSectionEyebrow: "Impact snapshot",
  snapshotSectionTitle:
    "The same headline evidence can be read through a development lens",
  snapshotSectionDescription:
    "These top-line metrics help anchor the SDG conversation in the same real programme evidence used elsewhere on the site.",
  goalsSectionEyebrow: "Goal mapping",
  goalsSectionTitle:
    "The work contributes across education, inclusion, opportunity, innovation, and partnership goals",
  goalsSectionDescription:
    "The mapping below is meant to help partners and funders understand relevance without flattening the local programme logic that actually drives the work.",
  principlesSectionEyebrow: "Alignment principles",
  principlesSectionTitle: "How the SDG lens is meant to be used here",
  principlesSectionDescription:
    "The goal mapping helps translate the work for development audiences, but it should always stay anchored in the lived local reality of the programmes.",
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle:
    "Move into the route that adds the next layer of context",
  nextStepsSectionDescription:
    "If the development lens is useful, the routes below help connect it to the partnership and evidence pages that support deeper conversations.",
  goals: [
    {
      goal: "SDG 4",
      title: "Quality Education",
      summary: "The work expands practical, future-facing learning opportunities beyond traditional classroom limitations.",
      icon: "📘",
      contributions: [
        "Supports structured digital-skills learning across training, clubs, and school engagement.",
        "Creates more accessible routes for learners who need practical and applied educational experiences.",
        "Strengthens progression pathways from exposure into deeper competence.",
      ],
      linkedRoutes: [
        { href: "/apply-for-training", eyebrow: "Learner route", title: "Apply for Training", description: "See how structured cohort learning creates a direct education pathway." },
        { href: "/what-we-do/youth-academy", eyebrow: "Initiative", title: "Youth Tech Academy", description: "Explore the practical education model behind the training journey." },
      ],
    },
    {
      goal: "SDG 5",
      title: "Gender Equality",
      summary: "Girls-focused pathways and wider inclusion design help make technology spaces more reachable and more representative.",
      icon: "👩‍💻",
      contributions: [
        "Supports targeted participation and visibility for girls and young women in technology.",
        "Helps shift perception about who belongs in digital-skills environments.",
        "Makes gender inclusion a practical delivery question rather than a symbolic claim.",
      ],
      linkedRoutes: [
        { href: "/what-we-do/girls-in-tech", eyebrow: "Initiative", title: "Girls in Tech", description: "See the initiative focused directly on gender inclusion in technology." },
        { href: "/our-impact/testimonials", eyebrow: "Stories", title: "Testimonials", description: "Read stories that show inclusion in lived and human terms." },
      ],
    },
    {
      goal: "SDG 8",
      title: "Decent Work and Economic Growth",
      summary: "The work helps young people move toward employability, entrepreneurship, and more credible transition routes into opportunity.",
      icon: "💼",
      contributions: [
        "Builds practical skills that connect to work, projects, and business-building pathways.",
        "Supports employability, confidence, and earlier career exposure.",
        "Creates stronger bridges between learning and the realities of work.",
      ],
      linkedRoutes: [
        { href: "/for-organisations/hire-graduates", eyebrow: "Organisation route", title: "Hire Our Graduates", description: "See how employers can connect with emerging talent." },
        { href: "/what-we-do/entrepreneurship-hub", eyebrow: "Initiative", title: "Entrepreneurship Hub", description: "Explore how skills connect to business-building and venture pathways." },
      ],
    },
    {
      goal: "SDG 9",
      title: "Industry, Innovation and Infrastructure",
      summary: "Digital capability, applied problem solving, and ecosystem collaboration all contribute to a more innovative and inclusive technology environment.",
      icon: "🛠️",
      contributions: [
        "Helps expand the base of future builders, problem solvers, and technology workers.",
        "Supports innovation through challenge work, product thinking, and applied digital skills.",
        "Strengthens the human side of digital infrastructure by building capability and access.",
      ],
      linkedRoutes: [
        { href: "/what-we-do/code-impact-challenge", eyebrow: "Initiative", title: "Code Impact Challenge", description: "See where innovation and applied learning become visible publicly." },
        { href: "/partner-with-us/technology", eyebrow: "Partner track", title: "Technology Companies", description: "Explore the ecosystem route for industry partners." },
      ],
    },
    {
      goal: "SDG 10",
      title: "Reduced Inequalities",
      summary: "The work matters most where young people face unequal access because of gender, geography, resources, or institutional gaps.",
      icon: "⚖️",
      contributions: [
        "Expands access beyond the learners who are already closest to opportunity.",
        "Supports regional and community-based inclusion models through outreach and partnerships.",
        "Keeps participation barriers visible in programme and partnership design.",
      ],
      linkedRoutes: [
        { href: "/what-we-do/rural-tech-connect", eyebrow: "Initiative", title: "Rural Tech Connect", description: "Explore how geography and access barriers are addressed directly." },
        { href: "/partner-with-us/ngo-foundations", eyebrow: "Partner track", title: "NGOs & Foundations", description: "See a route for mission-aligned access and inclusion support." },
      ],
    },
    {
      goal: "SDG 17",
      title: "Partnerships for the Goals",
      summary: "The wider ecosystem matters. Schools, funders, employers, public actors, and technology partners all shape what becomes possible.",
      icon: "🤝",
      contributions: [
        "The work relies on collaboration across institutions rather than isolated delivery.",
        "Partnership structures help extend trust, reach, and implementation quality.",
        "This makes ecosystem-building part of the impact model itself.",
      ],
      linkedRoutes: [
        { href: "/partner-with-us", eyebrow: "Partner", title: "Partner With Us", description: "Explore the five partner tracks that help sustain the wider ecosystem." },
        { href: "/for-organisations", eyebrow: "Collaborate", title: "For Organisations", description: "See the service-facing routes for training, sponsorship, volunteering, and talent." },
      ],
    },
  ],
  alignmentPrinciples: [
    "SDG mapping is most useful when it clarifies the work, not when it replaces the local story with generic global language.",
    "The same programme can contribute to more than one goal because learners experience change across education, confidence, work, and access at once.",
    "Partnership and systems-building are part of the impact model, not only supporting context around it.",
    "The alignment view helps donors and development actors interpret the work without flattening its local nuance.",
  ],
  related: [
    {
      href: "/partner-with-us/international-development",
      eyebrow: "Partner track",
      title: "International Development",
      description: "See how SDG alignment supports development-facing collaboration and evidence framing.",
    },
    {
      href: "/our-impact/reports",
      eyebrow: "Evidence",
      title: "Impact Reports",
      description: "Return to the reporting layer for briefs, metrics, and wider evidence context.",
    },
    {
      href: "/what-we-do/advocacy",
      eyebrow: "Initiative",
      title: "Advocacy",
      description: "Explore one route where ecosystem language and development priorities intersect directly.",
    },
  ],
};
