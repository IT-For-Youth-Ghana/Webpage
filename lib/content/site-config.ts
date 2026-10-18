/**
 * lib/content/site-config.ts
 *
 * Single source of truth for all static site content.
 * Replace your existing site-config.ts with this file entirely.
 */

import type { HeroSlide }       from "@/types/content";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { FeaturedProgram } from "@/components/home/featured-programs";
import type { ProgrammeShowcaseItem } from "@/components/home/programme-showcase";
import type { ChallengeSectionContent, MissionSectionContent, OverviewSectionContent } from "@/components/home/legacy-homepage-sections";
import type { DonationCampaignContent } from "@/types/content";
import type { FeaturedStoryContent } from "@/components/home/featured-story-video";
import type { JoinCtaCard } from "@/types/content";
import type { NewsletterSignupContent } from "@/types/content";
import type { FloatingElementsContent } from "@/components/layout/floating-elements";
import type { Testimonial }     from "@/components/home/testimonials-section";
import type { Partner }         from "@/components/home/patrners-strip";
import type { EventItem }       from "@/components/home/upcoming-events";
import type { Announcement }    from "@/components/layout/announcement-bar";
import type { AdminNavItem }    from "@/types/admin";
import { trainingCohorts, trainingProcessSteps } from "@/lib/content/training-config";
import type {
  ArticleSeed,
  DepartmentProfile,
  InitiativePage,
  SitePage,
  WhatWeDoOverviewContent,
  RouteCard,
} from "@/types/content";

// ─── Shared types (keep in sync with @/types/content) ────────────────────────

export type HighlightStat = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
};

export type NavItem = {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
};

export type NavigationColumn = {
  heading: string;
  links: Array<{ label: string; href: string }>;
};

// ─── Site metadata (shared defaults for layout and pages) ─────────────────────

export const siteMeta = {
  siteName: "IT For Youth Ghana",
  defaultTitle: "IT For Youth Ghana",
  titleTemplate: "%s | IT For Youth Ghana",
  description:
    "IT For Youth Ghana equips young Ghanaians — especially young women and those in underserved communities — with practical digital skills, mentorship, and clear pathways into work, further study, and entrepreneurship. 3,000+ youth trained. 85% progression rate.",
  openGraph: {
    siteName: "IT For Youth Ghana",
    locale: "en_GH" as const,
    type: "website" as const,
  },
};

// ─── Announcement bar ─────────────────────────────────────────────────────────

export const activeAnnouncement: Announcement = {
  id: "cohort-8-2026",
  variant: "urgent",
  label: "Cohort 8 open",
  message:
    "Applications for Cohort 8 are now open. Join a 12-week cohort-based programme in Accra and build practical digital skills with mentorship and real projects.",
  cta: { label: "Apply for Cohort 8", href: "/apply-for-training/courses" },
  startDate: "2026-07-01T00:00:00.000Z",
  endDate: "2026-08-15T23:59:59.000Z",
  countdownDate: "2026-08-15T23:59:59.000Z",
  dismissible: true,
};

export const floatingElementsContent: FloatingElementsContent = {
  donateButton: {
    label: "Donate now",
    href: "/donate",
    showAfterPx: 400,
    active: true,
  },
  scrollToTop: {
    showAfterPx: 600,
    ariaLabel: "Scroll back to top",
    active: true,
  },
  exitIntent: {
    id: "homepage-newsletter-2026",
    mode: "newsletter",
    headline: "Before you go, stay close to Cohort 8, stories, and opportunities",
    description:
      "Join the mailing list for application windows, programme updates, learner stories, and ways to support young people building their future in tech.",
    image: "/images/randomPictures/studentslisteningfrontal.JPG",
    delayMs: 60_000,
    dismissDays: 7,
    newsletterInterest: "exit-intent",
    active: true,
  },
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export const publicNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Who We Are",
    href: "/who-we-are",
    items: [
      { label: "About Us", href: "/who-we-are" },
      { label: "Our Team", href: "/who-we-are/team" },
      { label: "Departments", href: "/departments" },
      { label: "Our Partners", href: "/who-we-are/partners" },
      { label: "Join Our Team", href: "/who-we-are/careers" },
    ],
  },
  {
    label: "What We Do",
    href: "/what-we-do",
    items: [
      { label: "Girls in Tech", href: "/what-we-do/girls-in-tech" },
      { label: "Youth Tech Academy", href: "/what-we-do/youth-academy" },
      { label: "Entrepreneurship Hub", href: "/what-we-do/entrepreneurship-hub" },
      { label: "Code Impact Challenge", href: "/what-we-do/code-impact-challenge" },
      { label: "Rural Tech Connect", href: "/what-we-do/rural-tech-connect" },
      { label: "Community Outreach", href: "/what-we-do/community-outreach" },
      { label: "Advocacy", href: "/what-we-do/advocacy" },
      { label: "Tech Clubs", href: "/what-we-do/tech-clubs" },
    ],
  },
  {
    label: "Apply for Training",
    href: "/apply-for-training",
    items: [
      { label: "Who Can Apply", href: "/apply-for-training/who-can-apply" },
      { label: "Browse Courses", href: "/apply-for-training/courses" },
      { label: "How It Works", href: "/apply-for-training/how-it-works" },
    ],
  },
  {
    label: "For Organisations",
    href: "/for-organisations",
    items: [
      { label: "Corporate Training", href: "/for-organisations/corporate-training" },
      { label: "Sponsorships", href: "/for-organisations/sponsorships" },
      { label: "Hire Our Graduates", href: "/for-organisations/hire-graduates" },
      { label: "Staff Volunteering", href: "/for-organisations/staff-volunteering" },
    ],
  },
  {
    label: "Partner With Us",
    href: "/partner-with-us",
    items: [
      { label: "Educational Institutions", href: "/partner-with-us/educational" },
      { label: "Government", href: "/partner-with-us/government" },
      { label: "NGOs & Foundations", href: "/partner-with-us/ngo-foundations" },
      { label: "International Development", href: "/partner-with-us/international-development" },
      { label: "Technology Companies", href: "/partner-with-us/technology" },
    ],
  },
  {
    label: "Our Impact",
    /* Points at the hub, not past it. This column previously linked straight to
       /our-impact/reports, which left the hub reachable only by clicking a
       breadcrumb on one of its own children. */
    href: "/our-impact",
    items: [
      { label: "Impact Overview", href: "/our-impact" },
      { label: "Impact Reports", href: "/our-impact/reports" },
      { label: "Testimonials", href: "/our-impact/testimonials" },
      { label: "UN SDGs", href: "/our-impact/sdgs" },
    ],
  },
  {
    label: "News & Updates",
    href: "/news-and-updates",
    items: [
      { label: "News", href: "/news-and-updates/news" },
      { label: "Blogs", href: "/news-and-updates/blogs" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Footer links are maintained beside the header navigation to prevent route drift. */
export const footerNavigation: NavigationColumn[] = [
  {
    heading: "Who We Are",
    links: [
      { label: "About Us", href: "/who-we-are" },
      { label: "Our Team", href: "/who-we-are/team" },
      { label: "Our Partners", href: "/who-we-are/partners" },
      { label: "Join Our Team", href: "/who-we-are/careers" },
    ],
  },
  {
    heading: "What We Do",
    links: [
      { label: "Overview", href: "/what-we-do" },
      { label: "Girls in Tech", href: "/what-we-do/girls-in-tech" },
      { label: "Youth Tech Academy", href: "/what-we-do/youth-academy" },
      { label: "Entrepreneurship Hub", href: "/what-we-do/entrepreneurship-hub" },
      { label: "Tech Clubs", href: "/what-we-do/tech-clubs" },
    ],
  },
  {
    heading: "Apply & Partner",
    links: [
      { label: "Apply for Training", href: "/apply-for-training" },
      { label: "Browse Courses", href: "/apply-for-training/courses" },
      { label: "For Organisations", href: "/for-organisations" },
      { label: "Partner With Us", href: "/partner-with-us" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    heading: "Impact & Contact",
    links: [
      { label: "Impact Overview", href: "/our-impact" },
      { label: "Impact Reports", href: "/our-impact/reports" },
      { label: "Testimonials", href: "/our-impact/testimonials" },
      { label: "News", href: "/news-and-updates/news" },
      { label: "Blogs", href: "/news-and-updates/blogs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const legalNavigation = [
  { label: "Programs Portal", href: "/programs" },
  { label: "Admin Login", href: "/admin-login" },
  { label: "Contact", href: "/contact" },
];

// ─── Hero stats ───────────────────────────────────────────────────────────────

export const heroStats: HighlightStat[] = [
  {
    value: "3000+",
    label: "Youth Trained",
    description: "Across digital skills and employability pathways.",
    icon: "👩‍💻",
  },
  {
    value: "8500+",
    label: "Students Reached",
    description: "Through school outreach, clubs, and community activations.",
    icon: "🏫",
  },
  {
    value: "40%",
    label: "Female Participation",
    description: "Driving stronger gender inclusion in technology spaces.",
    icon: "📊",
  },
  {
    value: "85%",
    label: "Employment Rate",
    description: "Graduates in work, further learning, or business-building pathways.",
    icon: "✅",
  },
];

export const homepageTicker: MarqueeTickerContent = {
  mode: "stats",
  speed: "medium",
  pauseOnHover: true,
  items: [
    { label: "3,000+ Youth Trained" },
    { label: "8,500+ Students Reached" },
    { label: "40% Female Participation" },
    { label: "85% Progression Rate" },
    { label: "Cohort 8 Applications Now Open" },
  ],
};

type InitiativeSeedConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  tagline: string;
  accent: string;
  heroImage: string;
  /** What the photograph actually shows. Design-phase media, so it must not claim to depict a specific ITFYG cohort or event. */
  heroImageAlt?: string;
  overviewImage: string;
  overviewImageAlt?: string;
  stats: InitiativePage["stats"];
  mission: string;
  objectives: string[];
  howItWorks: InitiativePage["howItWorks"];
  impactStats: InitiativePage["impactStats"];
  audience: InitiativePage["audience"];
  gallery: InitiativePage["gallery"];
  testimonials: InitiativePage["testimonials"];
  partners: InitiativePage["partners"];
  faqs: InitiativePage["faqs"];
  related: InitiativePage["related"];
};

function buildInitiativePage(config: InitiativeSeedConfig): InitiativePage {
  return {
    slug: config.slug,
    eyebrow: config.eyebrow,
    title: config.title,
    description: config.description,
    intro: config.intro,
    ctas: [
      { label: "Apply for Cohort 8", href: "/apply-for-training/courses" },
      { label: "Contact the team", href: "/contact" },
    ],
    sections: [
      {
        title: "Mission",
        body: config.mission,
      },
      {
        title: "Objectives",
        body: "The initiative is designed around a practical set of outcomes that can later be managed from the CMS.",
        bullets: config.objectives,
      },
    ],
    related: config.related,
    stats: config.stats,
    tagline: config.tagline,
    accent: config.accent,
    heroImage: config.heroImage,
    heroImageAlt: config.heroImageAlt ?? `${config.title} programme activity`,
    overviewImage: config.overviewImage,
    mission: config.mission,
    objectives: config.objectives,
    howItWorks: config.howItWorks,
    impactStats: config.impactStats,
    audience: config.audience,
    gallery: config.gallery,
    testimonials: config.testimonials,
    partners: config.partners,
    faqs: config.faqs,
    applyCta: {
      heading: `Ready to explore ${config.title}?`,
      description:
        "Cohort 8 is now open. Join a 12-week, project-driven programme with mentorship and clear progression into work, further study, or entrepreneurship. Scholarships and device support are available for learners who need them. 85% of graduates progress within six months.",
      primary: { label: "Apply for Cohort 8", href: "/apply-for-training/courses" },
      secondary: { label: "Ask a question", href: "/contact" },
    },
    sectionContent: {
      overviewEyebrow: "Overview",
      overviewTitle: "A focused pathway with clear outcomes",
      overviewImageAlt: config.overviewImageAlt ?? `${config.title} participants and programme activity`,
      howItWorksEyebrow: "How it works",
      howItWorksTitle: "A programme journey that moves from access to confidence",
      howItWorksDescription: "Each initiative uses a clear process so participants and partners know what to expect from first contact to measurable outcomes.",
      impactEyebrow: "Impact stats",
      impactTitle: "Proof that the model is translating into real opportunity",
      impactDescription: "These indicators help show who the initiative is reaching, how consistently it is delivering, and why it matters.",
      audienceEyebrow: "Who it's for",
      eligibilityEyebrow: "Eligibility",
      galleryEyebrow: "Gallery",
      galleryTitle: "Scenes from the classrooms, workshops, and communities behind the work",
      galleryDescription: "See the people, learning environments, and shared moments that bring this initiative to life.",
      testimonialsEyebrow: "Testimonials",
      testimonialsTitle: "Stories that show what this initiative feels like from the inside",
      testimonialsDescription: "Participant and partner voices add the context that numbers alone cannot carry.",
      partnersEyebrow: "Partners & sponsors",
      partnersTitle: "Organisations that help this initiative reach further",
      partnersDescription: "Partnerships extend the reach, resources, and pathways available through this initiative.",
      partnerLinkLabel: "Learn more",
      faqsEyebrow: "FAQs",
      faqsTitle: "Answers to common questions about the initiative",
      faqsDescription: "Find practical information about participation, delivery, and the next steps available.",
      applyCtaEyebrow: "Take the next step",
      relatedEyebrow: "Related routes",
      relatedTitle: "Keep exploring the wider work around this initiative",
      relatedDescription: "These next links connect you to relevant training, partnership, and impact routes.",
      shareEyebrow: "Share this page",
      quickLinksEyebrow: "Quick routes",
    },
    quickLinks: [
      { label: "Apply for training", href: "/apply-for-training" },
      { label: "Partner with us", href: "/partner-with-us" },
      { label: "See our impact", href: "/our-impact/reports" },
    ],
  };
}

export const initiatives: InitiativePage[] = [
  buildInitiativePage({
    slug: "girls-in-tech",
    eyebrow: "Flagship initiative",
    title: "Girls in Tech",
    description:
      "Technical training, mentorship, and leadership pathways designed to increase the participation and advancement of young women in Ghana's digital economy.",
    intro:
      "Girls in Tech is IT For Youth Ghana's flagship programme for gender inclusion. It combines rigorous technical training with confidence-building, female mentorship, and structured pathways that help young women persist and advance in technology careers.",
    tagline:
      "Building the next generation of confident, skilled young women in technology.",
    accent: "#D70B52",
    heroImage: "https://images.unsplash.com/photo-1744809495173-217ca4faa8bc?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "A schoolgirl in Accra working carefully on a classroom exercise",
    overviewImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "A Ghanaian student concentrating on a classroom task",
    stats: [
      { value: "1,400+", label: "Young women reached", description: "Through training, mentorship, and leadership development programmes." },
      { value: "52%", label: "Female participation", description: "Across all ITFY training cohorts, reflecting our commitment to inclusion." },
      { value: "85%", label: "Progression rate", description: "Graduates advancing to further training, employment, or entrepreneurship." },
      { value: "7", label: "Regions engaged", description: "Expanding reach across Greater Accra and partner communities." },
    ],
    mission:
      "Girls in Tech exists to close the gender gap in technology by equipping young women with practical digital skills, sustained mentorship, and clear pathways into careers, further education, and entrepreneurship.",
    objectives: [
      "Equip young women with in-demand technical skills in software, design, and digital tools.",
      "Build confidence and leadership capacity through project-based learning and public showcases.",
      "Connect participants to female role models, mentors, and professional networks.",
      "Create measurable progression routes into employment, advanced training, and venture creation.",
    ],
    howItWorks: [
      { number: "01", title: "Recruit", description: "We partner with schools, community organisations, and youth networks to identify motivated young women ready to explore technology careers.", icon: "📣" },
      { number: "02", title: "Train", description: "Participants complete a structured curriculum covering web development, digital design, data fundamentals, and professional skills through hands-on projects.", icon: "💻" },
      { number: "03", title: "Mentor", description: "Each cohort is paired with female industry mentors who provide guidance, career insight, and real-world perspective throughout the programme.", icon: "🤝" },
      { number: "04", title: "Launch", description: "Graduates present portfolios, receive certificates, and are supported into internships, advanced training, employment, or entrepreneurship pathways.", icon: "🚀" },
    ],
    impactStats: [
      { value: "420+", label: "Young women trained", description: "Graduates of dedicated Girls in Tech cohorts since inception." },
      { value: "85%", label: "Progression rate", description: "Graduates advancing to employment, further training, or entrepreneurship." },
      { value: "180+", label: "Mentorship connections", description: "Structured matches with female professionals in technology." },
      { value: "35", label: "Scholarships awarded", description: "Full and partial scholarships enabling access for high-need learners." },
    ],
    audience: {
      summary:
        "Girls in Tech is designed for young women aged 16-28 who are curious about technology and ready to commit to structured learning. The programme is especially valuable for those who face barriers to entry or lack visible role models in tech.",
      groups: [
        "Senior high school and university students exploring technology careers.",
        "Young women transitioning from non-technical backgrounds into digital skills.",
        "Learners seeking female mentorship and peer community in technology spaces.",
      ],
      eligibility: [
        "Open to young women with demonstrated interest and commitment, regardless of prior technical experience.",
        "Applicants should be available for the full cohort duration and project work.",
        "Priority is given to applicants from underserved communities and those facing financial or access barriers.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1744809495173-217ca4faa8bc?auto=format&fit=crop&w=1400&q=85", alt: "A schoolgirl in Accra working carefully on a classroom exercise." },
      { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85", alt: "A Ghanaian student concentrating on a classroom task." },
      { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=85", alt: "Students working together in a classroom setting." },
      { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85", alt: "A group of students learning together in an informal collaborative setting." },
    ],
    testimonials: [
      { quote: "Before this programme, tech felt like something other people did. Now I can build, present, and apply with confidence.", name: "Benedicta O.", role: "Girls in Tech participant", avatar: "/images/people/benedicta.jpg" },
      { quote: "The mentorship made the biggest difference. It helped me imagine a future I could actually step into.", name: "Elisabeth A.", role: "Learner and emerging UX designer", avatar: "/images/people/elisabeth.jpg" },
      { quote: "Girls in Tech works because it combines technical learning with the emotional support learners need to persist.", name: "Danielle M.", role: "Volunteer mentor", avatar: "/images/people/danielle.jpg" },
    ],
    partners: [
      { name: "UNICEF Ghana", description: "Supports inclusive opportunity framing and youth-centered programme visibility.", logo: "/images/partnerorga/Download (1).jpg" },
      { name: "Vodafone Ghana", description: "Provides ecosystem visibility and practical partnership credibility for digital-skills programming.", logo: "/images/partnerorga/Download (4).jpg" },
    ],
    faqs: [
      { question: "Do participants need prior coding experience?", answer: "No. The initiative is designed to welcome learners at different starting points and build confidence alongside technical skill." },
      { question: "Is this separate from the Youth Tech Academy?", answer: "It can serve as an entry point, a confidence-building layer, or a connected pathway into deeper training depending on the learner’s stage." },
      { question: "How do mentors get involved?", answer: "Mentors can support through talks, feedback sessions, project reviews, or more structured guidance across a programme cycle." },
    ],
    related: [
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Cohort 8 is open. Move from interest into a 12-week, project-driven pathway with clear progression." },
      { href: "/partner-with-us", eyebrow: "Partner", title: "Partner With Us", description: "Support gender inclusion in tech through funding, mentoring, or collaboration." },
      { href: "/our-impact/testimonials", eyebrow: "Stories", title: "Read More Testimonials", description: "See more participant and partner stories across the platform." },
    ],
  }),
  buildInitiativePage({
    slug: "youth-academy",
    eyebrow: "Core training pathway",
    title: "Youth Tech Academy",
    description:
      "A 12-week, cohort-based digital skills programme that equips young Ghanaians with practical technical abilities, project experience, and career readiness.",
    intro:
      "The Youth Tech Academy is IT For Youth Ghana's flagship training pathway. It combines hands-on instruction in software development, design, and digital tools with real project work, mentorship, and structured transition support.",
    tagline:
      "From curiosity to capability — a disciplined pathway into Ghana's digital workforce.",
    accent: "#1E72BA",
    heroImage: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "Young African developers collaborating around computers during a coding session",
    overviewImage: "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "Two learners working together while reviewing code on laptop screens",
    stats: [
      { value: "1,800+", label: "Youth trained", description: "Graduates of the structured academy pathway since launch." },
      { value: "12", label: "Weeks per cohort", description: "Intensive, project-driven training with weekly deliverables." },
      { value: "85%", label: "Progression rate", description: "Graduates in employment, further study, or entrepreneurship within 6 months." },
      { value: "5", label: "Specialisation tracks", description: "Web development, UI/UX design, data fundamentals, digital marketing, and entrepreneurship." },
    ],
    mission:
      "Youth Tech Academy exists to transform motivated young people into job-ready digital professionals by delivering rigorous, practical training and visible progression pathways.",
    objectives: [
      "Build in-demand technical skills through project-based learning and real deliverables.",
      "Develop professional habits: communication, collaboration, time management, and problem-solving.",
      "Create portfolios that demonstrate capability to employers and clients.",
      "Support graduates into internships, employment, freelance work, or further training.",
    ],
    howItWorks: [
      { number: "01", title: "Apply & Assess", description: "Candidates complete an application and short assessment. We select motivated learners ready for a demanding cohort.", icon: "🧭" },
      { number: "02", title: "Train", description: "Participants complete daily technical sessions, assignments, and collaborative projects under experienced facilitators.", icon: "🧑‍🏫" },
      { number: "03", title: "Build & Present", description: "Every learner ships multiple projects, receives feedback, and presents work to peers, mentors, and industry guests.", icon: "🛠️" },
      { number: "04", title: "Transition", description: "Graduates receive career support, portfolio reviews, interview preparation, and direct introductions to hiring partners.", icon: "📈" },
    ],
    impactStats: [
      { value: "1,800+", label: "Graduates to date", description: "Young people who have completed the full academy programme." },
      { value: "85%", label: "Progression rate", description: "Graduates employed, in further training, or building ventures within six months." },
      { value: "420+", label: "Portfolio projects", description: "Publicly visible work produced across recent cohorts." },
      { value: "65+", label: "Hiring partners", description: "Organisations that have engaged with or hired ITFY graduates." },
    ],
    audience: {
      summary:
        "The Youth Tech Academy is for young Ghanaians aged 18-28 who are serious about building a career in technology and can commit to a full-time, 12-week intensive programme.",
      groups: [
        "Recent secondary or tertiary graduates seeking their first technical role.",
        "Career switchers with demonstrated motivation and basic digital literacy.",
        "Young people from underserved communities who need structured access to quality training.",
      ],
      eligibility: [
        "Must be available for the full cohort duration (typically 12 weeks, full-time).",
        "Basic computer literacy and reliable access to a device and internet are required.",
        "Strong preference for applicants who show initiative, resilience, and clear career intent.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&w=1400&q=85", alt: "Two learners working together while reviewing code on laptop screens." },
      { src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=85", alt: "Programming code displayed on a laptop screen." },
      { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85", alt: "Learners collaborating around laptops during a software development session." },
      { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85", alt: "Young adults gathered around a laptop while learning and discussing together." },
    ],
    testimonials: [
      { quote: "The academy changed how I approach learning. I stopped waiting to feel ready and started building real things.", name: "Mlan K.", role: "Youth Tech Academy graduate", avatar: "/images/people/Mlan.jpg" },
      { quote: "What stood out was the accountability. We were expected to ship work, improve, and present it clearly.", name: "Emmanuel T.", role: "Graduate and junior developer", avatar: "/images/people/emmanuel.jpg" },
      { quote: "The academy makes learners legible to employers because they leave with visible projects and better communication skills.", name: "Peter A.", role: "Industry mentor", avatar: "/images/people/peter.jpg" },
    ],
    partners: [
      { name: "Microsoft", description: "Signals the type of industry-facing standards and digital pathways the academy aligns with.", logo: "/images/partnerorga/Download (5).jpg" },
      { name: "Google.org", description: "Represents the kind of ecosystem support that strengthens training credibility and reach.", logo: "/images/partnerorga/Download.jpg" },
    ],
    faqs: [
      { question: "What kind of courses sit inside the academy?", answer: "The academy is designed as a structured pathway, so course themes can evolve while the overall learner journey stays stable." },
      { question: "Does the academy guarantee employment?", answer: "No programme can promise that, but the academy is intentionally designed to improve readiness, visibility, and transition outcomes." },
      { question: "Can beginners still apply?", answer: "Yes, if they are ready for committed learning and practical assignments. Some learners enter directly, while others come through adjacent initiatives first." },
    ],
    related: [
      { href: "/apply-for-training/courses", eyebrow: "Courses", title: "Browse Courses", description: "See the training catalogue and connected programme routes." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Explore how organisations can connect with emerging talent." },
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how training outcomes connect to the wider mission." },
    ],
  }),
  buildInitiativePage({
    slug: "entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description:
      "A structured support pathway that helps young Ghanaians turn digital skills and ideas into viable ventures, products, and income-generating opportunities.",
    intro:
      "The Entrepreneurship Hub bridges technical capability and business execution. It gives learners and early founders the tools, feedback, and networks they need to move from concept to customer, prototype to product, and idea to income.",
    tagline:
      "Where digital skills become ventures — disciplined entrepreneurship for Ghana's next generation of founders.",
    accent: "#0152BE",
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "A young team discussing ideas together around a work table",
    overviewImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "A small team discussing ideas around a table",
    stats: [
      { value: "320+", label: "Founders supported", description: "Young people who have explored or launched ventures through the hub." },
      { value: "85+", label: "Pitches delivered", description: "Public presentations to mentors, investors, and partners." },
      { value: "48", label: "Active ventures", description: "Businesses still operating or in active development post-programme." },
      { value: "22", label: "Revenue-generating founders", description: "Participants earning income from ventures launched or refined at ITFY." },
    ],
    mission:
      "The Entrepreneurship Hub exists to convert technical skill into sustainable economic opportunity by equipping young Ghanaians with the business discipline, market insight, and support networks required to build and grow ventures.",
    objectives: [
      "Help learners move from technical prototypes to validated business ideas.",
      "Build practical skills in customer discovery, pricing, financial basics, and go-to-market strategy.",
      "Create visible pathways from training into self-employment and venture creation.",
      "Connect promising founders to mentors, capital, and market opportunities.",
    ],
    howItWorks: [
      { number: "01", title: "Discover", description: "Participants identify real problems, validate demand, and define the value their idea could deliver.", icon: "🔍" },
      { number: "02", title: "Build", description: "Founders develop minimum viable products, test with real users, and refine based on feedback.", icon: "🧪" },
      { number: "03", title: "Pitch & Refine", description: "Regular pitch sessions and mentor clinics help founders sharpen their narrative and business model.", icon: "🎤" },
      { number: "04", title: "Launch & Scale", description: "Promising ventures receive introductions to partners, investors, and growth programmes.", icon: "🚀" },
    ],
    impactStats: [
      { value: "320+", label: "Founders trained", description: "Young people who have completed entrepreneurship modules or hub programmes." },
      { value: "48", label: "Ventures launched", description: "Businesses that began or were strengthened through ITFY support." },
      { value: "22", label: "Revenue-positive founders", description: "Participants generating consistent income from their ventures." },
      { value: "85%", label: "Founder progression", description: "Hub participants who report improved business clarity or income within 6 months." },
    ],
    audience: {
      summary:
        "The Entrepreneurship Hub is for young Ghanaians who have technical or creative skills and want to build income-generating ventures rather than (or alongside) traditional employment.",
      groups: [
        "Academy graduates exploring self-employment or product-based businesses.",
        "Young founders with early ideas who need structure, feedback, and accountability.",
        "Women and youth from underserved communities seeking dignified economic pathways.",
      ],
      eligibility: [
        "Open to participants with ideas at any stage — from concept to early revenue.",
        "Strongest fit for those willing to test assumptions, iterate, and engage with real customers.",
        "Priority given to founders whose ventures address local problems or serve Ghanaian markets.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85", alt: "A young team discussing ideas together around a work table." },
      { src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85", alt: "A small team discussing ideas around a table." },
      { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=85", alt: "Colleagues working together during a collaborative planning session." },
      { src: "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1400&q=85", alt: "People discussing communications material together around a table." },
    ],
    testimonials: [
      { quote: "This was the first place where my idea stopped feeling vague and started feeling buildable.", name: "Konadu A.", role: "Entrepreneurship Hub participant", avatar: "/images/people/konadu.jpg" },
      { quote: "The most useful part was getting practical feedback, not just encouragement. It made the next step obvious.", name: "Junior M.", role: "Young founder", avatar: "/images/people/junior.jpg" },
      { quote: "The hub is strongest when it helps participants see entrepreneurship as disciplined problem-solving, not just ambition.", name: "Peter S.", role: "Business mentor", avatar: "/images/people/peter.jpg" },
    ],
    partners: [
      { name: "Tony Elumelu Foundation", description: "Represents the type of ecosystem support that helps young founders think beyond the first idea.", logo: "/images/partnerorga/Download (6).jpg" },
      { name: "Mastercard Foundation", description: "Signals the role partnership can play in scaling youth employability and enterprise pathways.", logo: "/images/partnerorga/Download (3).jpg" },
    ],
    faqs: [
      { question: "Do participants need a registered business?", answer: "No. The hub supports learners from idea-stage through to clearer venture direction and early testing." },
      { question: "Is funding guaranteed?", answer: "No, but the hub improves founder readiness and visibility, which makes support pathways more realistic." },
      { question: "Can academy learners participate too?", answer: "Yes. The hub is designed to connect well with the wider ITFY training ecosystem." },
    ],
    related: [
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Support innovation, mentoring, and founder visibility through partnership." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Explore the training routes that feed into this entrepreneurship pathway." },
      { href: "/news-and-updates/blogs", eyebrow: "Read", title: "Blogs", description: "Follow ideas, reflections, and ecosystem stories across the platform." },
    ],
  }),
  buildInitiativePage({
    slug: "code-impact-challenge",
    eyebrow: "Challenge format",
    title: "Code Impact Challenge",
    description:
      "A challenge-led programme that connects technical learning with real-world problem solving through time-bound, team-based projects.",
    intro:
      "The Code Impact Challenge gives learners a public, mission-focused format to apply their skills, collaborate under pressure, and deliver solutions to meaningful local problems. It transforms classroom learning into visible, community-relevant impact.",
    tagline:
      "Where technical skills meet real constraints — building, presenting, and delivering under pressure.",
    accent: "#C44900",
    heroImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "Programming code displayed on a laptop screen",
    overviewImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "Young adults gathered around a laptop while learning and discussing together",
    stats: [
      { value: "14", label: "Challenge teams", description: "Learner groups building solutions around shared problem statements." },
      { value: "6", label: "Partner briefs", description: "Real-world themes and community-facing challenge prompts." },
      { value: "120+", label: "Participants", description: "Young people exposed to challenge-based collaborative learning." },
      { value: "4", label: "Showcase rounds", description: "Visible presentation milestones from concept to final demo." },
    ],
    mission:
      "Code Impact Challenge turns technical learning into active problem-solving by giving young Ghanaians structured opportunities to build around real community needs, present under pressure, and develop teamwork through challenge-based practice.",
    objectives: [
      "Strengthen problem-solving, collaboration, and communication through purposeful, time-bound competition.",
      "Help learners practice applied building and public presentation, not only private classroom work.",
      "Create visible moments where communities, partners, and stakeholders can see learner capability in action.",
      "Foster a culture of experimentation, iteration, feedback, and professional delivery.",
    ],
    howItWorks: [
      { number: "01", title: "Frame", description: "Teams receive challenge prompts tied to local, social, or ecosystem needs that require practical digital thinking and creative solutions.", icon: "🧩" },
      { number: "02", title: "Build", description: "Participants research, prototype, test, and refine possible responses within a structured challenge window with clear milestones.", icon: "⌨️" },
      { number: "03", title: "Present", description: "Teams pitch their work to peers, judges, and invited stakeholders with transparent criteria, deadlines, and constructive feedback.", icon: "🎯" },
      { number: "04", title: "Reflect", description: "Feedback and debrief sessions help participants carry lessons forward into future projects, deeper programmes, or venture work.", icon: "🔁" },
    ],
    impactStats: [
      { value: "28", label: "Prototype concepts", description: "Ideas developed into early challenge-ready solutions with real-world relevance.", icon: "🛠️" },
      { value: "11", label: "Judging mentors", description: "Partners and practitioners helping teams sharpen their thinking and delivery.", icon: "👥" },
      { value: "4", label: "Winning teams", description: "Outstanding participant groups recognized for execution, impact, and collaboration.", icon: "🏆" },
      { value: "88%", label: "Team completion", description: "A strong signal of engagement, accountability, and collaborative follow-through.", icon: "📈" },
    ],
    audience: {
      summary:
        "This initiative is best for learners who already have some technical exposure and want a more applied, collaborative, and time-bound format to stretch their skills and build visible portfolios.",
      groups: [
        "Participants ready to practice teamwork, problem-solving, and public presentation.",
        "Learners who benefit from challenge deadlines, feedback loops, and showcase moments.",
        "Young builders interested in innovation, prototyping, and community-relevant solutions.",
      ],
      eligibility: [
        "Works best for learners with some prior exposure to digital tools or technical learning pathways.",
        "Participants should be comfortable collaborating, presenting, and iterating quickly under guidance.",
        "Teams may combine different strengths, including design, coding, research, and storytelling.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=85", alt: "Programming code displayed on a laptop screen." },
      { src: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1400&q=85", alt: "Young African developers collaborating around computers during a coding session." },
      { src: "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&w=1400&q=85", alt: "Two learners working together while reviewing code on laptop screens." },
      { src: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85", alt: "A designer working with digital interface layouts on a computer." },
    ],
    testimonials: [
      { quote: "The challenge forced us to think clearly, move faster, and explain our decisions in a way we never had before.", name: "Saah J.", role: "Challenge participant", avatar: "/images/people/saah.jpg" },
      { quote: "It was one of the few experiences where you could see learners becoming more confident with every round.", name: "Amoako F.", role: "Volunteer judge", avatar: "/images/people/amoako.jpg" },
      { quote: "The strongest teams were not always the most technical. They were the ones that understood the problem best.", name: "Agboku E.", role: "Mentor and reviewer", avatar: "/images/people/agboku.jpg" },
    ],
    partners: [
      { name: "GIZ", description: "Supports challenge-based approaches that connect youth skills to broader development and innovation themes.", logo: "/images/partnerorga/Download (2).jpg" },
      { name: "USAID", description: "Represents public-interest alignment and the value of locally-led, challenge-driven problem solving.", logo: "/images/partnerorga/Download (6).jpg" },
    ],
    faqs: [
      { question: "Is the challenge only for advanced coders?", answer: "No. Teams can bring different strengths, and challenge design rewards research, design, communication, and execution alongside technical depth." },
      { question: "Do participants work alone or in teams?", answer: "The challenge is designed primarily around collaborative teams because teamwork, communication, and shared accountability are core learning outcomes." },
      { question: "What happens after the challenge ends?", answer: "Strong teams and individuals can be connected to future programmes, showcases, mentorship, or partnership opportunities based on performance and interest." },
    ],
    related: [
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how challenge-based learning fits into the wider mission and outcomes." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Explore the routes that can prepare learners for future challenge participation." },
      { href: "/partner-with-us/international-development", eyebrow: "Partner", title: "International Development", description: "See how challenge-led work can align with broader development and innovation goals." },
    ],
  }),
  buildInitiativePage({
    slug: "rural-tech-connect",
    eyebrow: "Access initiative",
    title: "Rural Tech Connect",
    description:
      "Bringing digital skills training and opportunity to underserved communities across Ghana through trusted local partnerships and targeted outreach.",
    intro:
      "Rural Tech Connect closes the geography gap in digital opportunity. It brings exposure, practical training, and partnership-driven support to communities beyond major urban centres, creating visible pathways into ITFY's core programmes.",
    tagline:
      "Digital inclusion that begins with access, trust, and locally relevant delivery.",
    accent: "#2A6F97",
    heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "Young learners gathered together in a community learning environment",
    overviewImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "Young learners gathered during an educational community session",
    stats: [
      { value: "9", label: "Community hubs", description: "Local partnership points anchoring delivery in underserved regions." },
      { value: "1,500+", label: "Learners reached", description: "Young people gaining first digital exposure beyond city centres." },
      { value: "22", label: "Outreach visits", description: "On-the-ground engagements building trust and readiness." },
      { value: "5", label: "Regional partners", description: "Institutions and organisations enabling sustainable local delivery." },
    ],
    mission:
      "Rural Tech Connect makes digital opportunity geographically inclusive by equipping young Ghanaians in underserved communities with exposure, practical skills, and trusted local support models that connect them to longer-term learning and economic pathways.",
    objectives: [
      "Reduce geographic barriers that limit access to quality digital skills training.",
      "Build local trust and readiness through deep partnerships with schools, leaders, and community institutions.",
      "Create clear, visible routes from initial outreach into ITFY's core training and club programmes.",
      "Develop a scalable, community-aware expansion model that prioritises inclusion over centralisation.",
    ],
    howItWorks: [
      { number: "01", title: "Partner", description: "Local schools, community leaders, and organisations identify needs and co-design delivery that fits the local context.", icon: "🫱" },
      { number: "02", title: "Activate", description: "Introductory sessions, workshops, and live demonstrations create first points of access and spark interest.", icon: "📍" },
      { number: "03", title: "Train", description: "Participants engage in practical digital skills sessions with structured follow-up and local mentorship where possible.", icon: "🧰" },
      { number: "04", title: "Link", description: "Promising learners are referred into cohort training, tech clubs, or partner-supported advancement pathways.", icon: "🔗" },
    ],
    impactStats: [
      { value: "42", label: "School activations", description: "Local moments of access that build awareness and digital confidence.", icon: "🏫" },
      { value: "380+", label: "Hands-on learners", description: "Participants who moved from exposure into practical skills engagement.", icon: "💻" },
      { value: "7", label: "District touchpoints", description: "Geographic reach through sustained partnerships and outreach.", icon: "🗺️" },
      { value: "60+", label: "Referral transitions", description: "Learners connected into deeper ITFY training and club pathways.", icon: "➡️" },
    ],
    audience: {
      summary:
        "Rural Tech Connect serves young people and communities in regions often excluded from centralised digital opportunities, especially where local access and trusted relationships are the key to participation.",
      groups: [
        "Young Ghanaians in communities beyond major urban centres.",
        "Schools and local actors seeking practical digital exposure pathways for their youth.",
        "Regional partners committed to geographically inclusive skills development.",
      ],
      eligibility: [
        "Entry often depends on local school partnerships, community activations, or regional outreach plans.",
        "No prior technical experience is required for initial engagement.",
        "Partner-supported pathways can extend opportunities for learners ready for deeper programmes.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85", alt: "Young learners gathered together in a community learning environment." },
      { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=85", alt: "Young learners gathered during an educational community session." },
      { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85", alt: "Young people smiling and standing together outdoors." },
      { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=85", alt: "Students working together in a classroom setting." },
    ],
    testimonials: [
      { quote: "Bringing the programme to us changed everything. It made technology feel close enough to belong to us too.", name: "Awartey L.", role: "Regional participant", avatar: "/images/people/awartey.jpg" },
      { quote: "Rural Tech Connect works because it respects local context and builds trust before expecting commitment.", name: "Avevor S.", role: "Community partner", avatar: "/images/people/avevor.jpg" },
      { quote: "The real value is not just the session itself. It is the route it opens for learners afterwards.", name: "Adjej K.", role: "Regional education supporter", avatar: "/images/people/adjej.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "School and local-institution partnerships are central to making regional activation work sustainable.", href: "/partner-with-us/educational" },
      { name: "Government", description: "Regional and public collaboration can help scale inclusive digital access models responsibly.", href: "/partner-with-us/government" },
    ],
    faqs: [
      { question: "Does Rural Tech Connect run year-round in every location?", answer: "No. Delivery depends on outreach schedules, partnerships, and regional planning, but the route is designed to scale over time." },
      { question: "Is this only an awareness programme?", answer: "No. It includes awareness, practical engagement, and referral into deeper pathways where possible." },
      { question: "How can organisations support this work?", answer: "Support can come through sponsorship, logistics, local connections, or partnership models that help reach more communities sustainably." },
    ],
    related: [
      { href: "/partner-with-us/educational", eyebrow: "Partner", title: "Educational Institutions", description: "Work with us to extend access through schools and learning communities." },
      { href: "/partner-with-us/government", eyebrow: "Collaborate", title: "Government", description: "Explore civic collaboration routes for broader youth digital inclusion." },
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how outreach and access connect to the wider mission." },
    ],
  }),
  buildInitiativePage({
    slug: "community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description:
      "High-visibility activations and learning experiences that introduce communities to digital opportunity and create trusted entry points into ITFY programmes.",
    intro:
      "Community Outreach is ITFY's front door. It meets young people, families, schools, and communities before they are ready to apply or commit, building the awareness, trust, and understanding that make future participation possible.",
    tagline:
      "Where visibility, access, and community presence turn possibility into participation.",
    accent: "#8B5E34",
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "Students working together in a classroom setting",
    overviewImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "A facilitator leading a learning session in front of a group",
    stats: [
      { value: "80+", label: "Outreach events", description: "Public activations creating first contact, awareness, and trust." },
      { value: "3,000+", label: "People reached", description: "Students, parents, schools, and communities engaged through visibility work." },
      { value: "16", label: "Partner venues", description: "Spaces that help ITFY show up consistently and visibly across communities." },
      { value: "420+", label: "Follow-up leads", description: "Individuals who took concrete next steps after outreach contact." },
    ],
    mission:
      "Community Outreach widens the top of the funnel by helping more young Ghanaians, families, schools, and communities understand that digital opportunity is possible, relevant, and directly connected to their futures — creating the conditions for the 85% progression outcomes ITFY is known for.",
    objectives: [
      "Create high-trust, low-barrier entry points into the wider ITFY ecosystem.",
      "Make programmes visible and credible to people who may not encounter them otherwise.",
      "Translate digital skills into language communities can understand, value, and act on.",
      "Build stronger, measurable referral pathways from outreach into training, clubs, and partnership routes.",
    ],
    howItWorks: [
      { number: "01", title: "Show up", description: "ITFY activates in schools, events, and community spaces where awareness gaps remain high and trust must be earned.", icon: "🚶" },
      { number: "02", title: "Demystify", description: "Facilitators turn big ideas about technology and opportunity into practical, relatable conversations that resonate locally.", icon: "💬" },
      { number: "03", title: "Engage", description: "Learners and community members interact through talks, mini-workshops, and early exposure activities that build confidence.", icon: "🧑‍🤝‍🧑" },
      { number: "04", title: "Convert", description: "Interested participants are linked into programmes, mailing lists, updates, or future engagement routes based on readiness.", icon: "📨" },
    ],
    impactStats: [
      { value: "210+", label: "School referrals", description: "Connections built between outreach work and formal next steps into training.", icon: "📚" },
      { value: "33", label: "Community sessions", description: "Structured public-facing activations hosted in partner spaces.", icon: "🏘️" },
      { value: "12", label: "Awareness campaigns", description: "Focused outreach pushes tied to programme cycles and application windows.", icon: "📢" },
      { value: "74%", label: "Follow-up engagement", description: "Participants taking at least one concrete next action after outreach contact.", icon: "✅" },
    ],
    audience: {
      summary:
        "Community Outreach is for anyone not yet inside the training pipeline but ready to engage — especially where awareness, access, or trust are still the primary barriers to participation.",
      groups: [
        "Students who need first exposure before they are ready to apply for cohort training.",
        "Parents, schools, and community leaders who influence learner decisions and participation.",
        "Partners seeking visible, community-facing engagement formats that build credibility.",
      ],
      eligibility: [
        "Most outreach formats are open-access and designed for broad participation.",
        "No prior technical background is required for entry-level engagement.",
        "Follow-up routes depend on interest, readiness, and the connected programme pathway.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=85", alt: "Young learners gathered during an educational community session." },
      { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85", alt: "Young learners gathered together in a community learning environment." },
      { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85", alt: "A facilitator leading a learning session in front of a group." },
      { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85", alt: "Young people smiling and standing together outdoors." },
    ],
    testimonials: [
      { quote: "The outreach event made the whole idea of digital skills feel concrete, not distant.", name: "White Lady A.", role: "Community participant", avatar: "/images/people/white lady-Cover.jpg" },
      { quote: "It helped our students understand that technology is not just something they consume. It is something they can build with.", name: "Mensah I.", role: "School partner", avatar: "/images/people/mensah.jpg" },
      { quote: "Outreach is where belief starts. Without it, a lot of learners would never take the first step.", name: "Belinda A.", role: "Programme facilitator", avatar: "/images/people/Belinda.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "Schools are a critical anchor point for effective community outreach and student referral pathways.", href: "/partner-with-us/educational" },
      { name: "NGOs & Foundations", description: "Mission-aligned collaborators can help widen reach and deepen community trust.", href: "/partner-with-us/ngo-foundations" },
    ],
    faqs: [
      { question: "Is Community Outreach the same as a training programme?", answer: "Not exactly. It is often the entry point that helps people understand and move toward deeper training opportunities." },
      { question: "Can schools request an outreach activation?", answer: "Yes. That kind of request is a strong fit for the partnership and contact routes already live on the site." },
      { question: "What happens after an outreach session?", answer: "Participants may join the mailing list, ask questions, apply for training, or enter future programme pathways depending on readiness." },
    ],
    related: [
      { href: "/contact", eyebrow: "Contact", title: "Request an Activation", description: "Start a conversation about outreach, school visits, or partner events." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Move from first exposure into deeper practical learning." },
      { href: "/news-and-updates/news", eyebrow: "Updates", title: "News", description: "Follow programme updates and community-facing stories." },
    ],
  }),
  buildInitiativePage({
    slug: "advocacy",
    eyebrow: "Influence work",
    title: "Advocacy",
    description:
      "Public-facing thought leadership and coalition work that widens opportunity for young Ghanaians in tech by shaping the ecosystem conditions around access, inclusion, and employability.",
    intro:
      "Advocacy gives ITFY a voice beyond direct programme delivery. It turns field experience from cohorts, clubs, and outreach into public-facing influence, evidence-based dialogue, and stronger alignment across the youth digital opportunity ecosystem.",
    tagline:
      "Shaping the wider conditions that make youth digital opportunity more possible and more equitable.",
    accent: "#A63D40",
    heroImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "Government and public-sector professionals gathered for an institutional meeting",
    overviewImage: "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "People discussing communications material together around a table",
    stats: [
      { value: "14", label: "Public engagements", description: "Talks, panels, and ecosystem-facing conversation spaces." },
      { value: "9", label: "Coalition touchpoints", description: "Moments where ITFY voice contributes to broader influence work." },
      { value: "5", label: "Policy themes", description: "Recurring issues around access, inclusion, and youth digital futures." },
      { value: "2", label: "Thought series", description: "Seeded content directions ready for deeper publishing later." },
    ],
    mission:
      "Advocacy ensures that youth digital opportunity is not treated as an isolated programme issue, but as a larger ecosystem priority that requires visibility, evidence, and coalition-building — grounded in ITFY's direct experience delivering 85% progression outcomes for young women and underserved communities.",
    objectives: [
      "Translate programme learning and 85% progression data into clearer public-facing insight and evidence.",
      "Support informed dialogue around access, gender equity, employability, and digital inclusion.",
      "Position ITFY as a credible, locally grounded voice in youth-technology and digital skills conversations.",
      "Create content and partnership routes that widen influence beyond direct training delivery.",
    ],
    howItWorks: [
      { number: "01", title: "Observe", description: "Insights from programmes, learners, and communities surface the issues that matter most on the ground.", icon: "👀" },
      { number: "02", title: "Frame", description: "Those insights are translated into public-facing themes, stories, and arguments that others can understand and engage with.", icon: "📝" },
      { number: "03", title: "Engage", description: "ITFY shows up in conversations, collaborations, and content spaces where influence can build over time.", icon: "🗣️" },
      { number: "04", title: "Align", description: "Partnership and ecosystem relationships help turn shared concerns into stronger collective action.", icon: "🤲" },
    ],
    impactStats: [
      { value: "18", label: "Audience touchpoints", description: "Public-facing opportunities to communicate programme insight and outcomes.", icon: "📡" },
      { value: "6", label: "Partner dialogues", description: "Cross-sector conversations about youth and digital opportunity.", icon: "🤝" },
      { value: "4", label: "Thematic priorities", description: "Issues consistently surfaced across ITFY’s work and evidence base.", icon: "🧭" },
      { value: "1", label: "Shared narrative", description: "A stronger public language for why the mission matters.", icon: "📘" },
    ],
    audience: {
      summary:
        "Advocacy is for partners, institutions, media, and ecosystem actors who want to understand the wider context around youth digital opportunity and where ITFY’s field experience and evidence can contribute.",
      groups: [
        "Funders and institutions looking for grounded programme insight and outcome data.",
        "Policy and development actors interested in local digital inclusion narratives from Ghana.",
        "Media, coalitions, and ecosystem partners engaging youth opportunity and skills themes.",
      ],
      eligibility: [
        "This route is open to institutions, collaborators, and public audiences, not only programme participants.",
        "Strong fit for groups seeking evidence-led partnership or ecosystem dialogue.",
        "Public-facing content and events can become the main entry points here over time.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=85", alt: "Government and public-sector professionals gathered for an institutional meeting." },
      { src: "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&w=1400&q=85", alt: "People discussing communications material together around a table." },
      { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=85", alt: "A team reviewing information together during an organisational planning meeting." },
      { src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=85", alt: "A newsroom style workspace with people producing media content." },
    ],
    testimonials: [
      { quote: "What matters here is that the message comes from lived programme experience, not from a distance.", name: "Agboku S.", role: "Ecosystem collaborator", avatar: "/images/people/agboku1.png" },
      { quote: "Advocacy helps us connect what we are seeing on the ground to the bigger systems conversation.", name: "Belinda K.", role: "Programme team member", avatar: "/images/people/Belinda.jpg" },
      { quote: "The strongest voice in these conversations is one that combines care, evidence, and credibility.", name: "Danielle F.", role: "Partner representative", avatar: "/images/people/danielle.jpg" },
    ],
    partners: [
      { name: "International Development", description: "A natural route for partners seeking credible, locally grounded programme insight and evidence.", href: "/partner-with-us/international-development" },
      { name: "Government", description: "Public collaboration can help translate youth digital inclusion priorities into more durable support frameworks.", href: "/partner-with-us/government" },
    ],
    faqs: [
      { question: "Is advocacy separate from programme work?", answer: "It is connected. Advocacy grows out of what ITFY sees through programme delivery and translates that into broader influence." },
      { question: "What kinds of issues does this work focus on?", answer: "The strongest themes include access, inclusion, employability, opportunity gaps, and the conditions needed for young people to thrive in tech." },
      { question: "How can institutions engage with this route?", answer: "Through dialogue, partnership, events, collaborative content, or contact around a shared area of interest." },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Partner", title: "International Development", description: "Explore donor- and agency-facing collaboration routes." },
      { href: "/our-impact/sdgs", eyebrow: "SDGs", title: "UN SDGs", description: "See how programme themes connect to wider development priorities." },
      { href: "/news-and-updates/blogs", eyebrow: "Read", title: "Blogs", description: "Follow longer-form reflections and thought leadership." },
    ],
  }),
  buildInitiativePage({
    slug: "tech-clubs",
    eyebrow: "School network",
    title: "Tech Clubs",
    description:
      "Recurring school-based clubs that turn initial curiosity into sustained digital skills practice and clear progression pathways.",
    intro:
      "Tech Clubs embed digital learning inside schools as a regular, peer-supported activity. Instead of isolated workshops, students gain consistent practice, build confidence together, and discover routes into deeper training and opportunity.",
    tagline:
      "Where weekly practice and peer community turn interest into lasting capability and visible next steps.",
    accent: "#1F7A8C",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85",
    heroImageAlt: "A group of students learning together in an informal collaborative setting",
    overviewImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
    overviewImageAlt: "People working together around a laptop in a collaborative environment",
    stats: [
      { value: "18", label: "School clubs", description: "Active or seeded club programmes operating across partner schools." },
      { value: "800+", label: "Students engaged", description: "Young people participating in recurring digital learning activities." },
      { value: "32", label: "Club sessions", description: "Structured practice sessions delivered across school terms." },
      { value: "6", label: "Competition entries", description: "Club members advancing into visible challenge and showcase formats." },
    ],
    mission:
      "Tech Clubs create recurring, low-barrier digital learning communities inside schools, equipping young Ghanaians—especially girls and learners from underserved communities—with the familiarity, confidence, and peer momentum needed to progress into cohort training and the 85% outcomes ITFY delivers.",
    objectives: [
      "Convert one-time exposure into sustained engagement and practical skill-building habits.",
      "Make digital learning feel accessible, social, and embedded within everyday school life.",
      "Identify and prepare learners ready for deeper academy training, challenges, or leadership roles.",
      "Give schools a repeatable structure for ongoing digital skills development without heavy lift.",
    ],
    howItWorks: [
      { number: "01", title: "Seed", description: "ITFY partners with schools to establish a club model tailored to local context, timetable, and student interest.", icon: "🏫" },
      { number: "02", title: "Meet", description: "Students gather regularly for guided activities, peer learning, hands-on projects, and exposure to real tech pathways.", icon: "👥" },
      { number: "03", title: "Build", description: "Mini-projects, presentations, and small challenges help learners develop confidence and a visible body of work.", icon: "🧗" },
      { number: "04", title: "Progress", description: "Strong performers are supported into outreach leadership, Code Impact Challenge, Girls in Tech, or full cohort training.", icon: "➡️" },
    ],
    impactStats: [
      { value: "260+", label: "Active club members", description: "Students maintaining regular participation beyond initial exposure.", icon: "🧑‍🤝‍🧑" },
      { value: "12", label: "School partners", description: "Institutions sustaining recurring engagement environments with ITFY support.", icon: "🏫" },
      { value: "48", label: "Peer-led activities", description: "Instances where students lead sessions or demonstrate growing ownership.", icon: "🙌" },
      { value: "21", label: "Pipeline transitions", description: "Club participants advancing into ITFY's deeper training or challenge programmes.", icon: "🚪" },
    ],
    audience: {
      summary:
        "Tech Clubs serve secondary students who benefit from regular, low-pressure digital practice and schools seeking a sustainable way to build digital culture without starting from scratch.",
      groups: [
        "Secondary school students seeking consistent exposure to technology and problem-solving.",
        "Schools and ICT leads wanting structured, recurring digital engagement for their learners.",
        "Young people—particularly girls and underserved learners—who may progress into formal training.",
      ],
      eligibility: [
        "Participation is coordinated through partner schools or school-based outreach activations.",
        "No prior coding experience is required; curiosity and commitment to attend are enough.",
        "Best results come from schools prepared to host recurring sessions and support student follow-through.",
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85", alt: "A group of students learning together in an informal collaborative setting." },
      { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85", alt: "People working together around a laptop in a collaborative environment." },
      { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85", alt: "Young adults gathered around a laptop while learning and discussing together." },
      { src: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=1400&q=85", alt: "A young Ghanaian university student concentrating on work at a laptop." },
    ],
    testimonials: [
      { quote: "The club gave us somewhere to keep going after the first workshop. That consistency changed everything for me.", name: "Emmanuel D.", role: "Tech Club member", avatar: "/images/people/emmanuel.jpg" },
      { quote: "Students need repetition to build real confidence. Clubs deliver that in a way one-off sessions simply cannot.", name: "Mr. Mensah", role: "School ICT lead", avatar: "/images/people/mensah.jpg" },
      { quote: "The real shift happens when students start leading sessions and teaching their peers. That is when ownership clicks.", name: "Amoako T.", role: "Club facilitator", avatar: "/images/people/amoako.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "School partnerships form the foundation for sustainable, recurring club activity.", href: "/partner-with-us/educational" },
      { name: "Corporate Training", description: "Future opportunities exist for staff volunteering and mentorship tied to school clubs.", href: "/for-organisations/staff-volunteering" },
    ],
    faqs: [
      { question: "How is a Tech Club different from a one-off workshop?", answer: "A workshop is a single event. A club creates continuity, peer accountability, and repeated practice that builds lasting skills and confidence." },
      { question: "Can a school request help starting a Tech Club?", answer: "Yes. The educational partnerships and contact routes on this site are the right starting point for that conversation." },
      { question: "Do club members advance into other ITFY programmes?", answer: "Yes. Clubs are a primary feeder into Code Impact Challenge, Girls in Tech, Rural Tech Connect, and full cohort training." },
    ],
    related: [
      { href: "/partner-with-us/educational", eyebrow: "Partner", title: "Educational Institutions", description: "Learn how schools can collaborate on sustainable club-based digital learning." },
      { href: "/what-we-do/code-impact-challenge", eyebrow: "Next step", title: "Code Impact Challenge", description: "See how club learners can stretch into applied building and competition work." },
      { href: "/apply-for-training/who-can-apply", eyebrow: "Apply", title: "Who Can Apply", description: "Understand the training routes available once learners are ready to go deeper." },
    ],
  }),
];

export const organisationPages: SitePage[] = [
  {
    slug: "corporate-training",
    eyebrow: "For organisations",
    title: "Corporate Training",
    description: "Practical digital skills training for teams that need to move faster and work smarter.",
    intro: "We design short, focused programmes for companies that want their people to gain real skills in web development, data, digital tools, or product thinking — delivered in Accra with projects that matter to your context.",
    stats: heroStats,
    sections: [
      {
        title: "What teams actually learn",
        body: "Sessions are hands-on. Participants ship small projects, present their work, and leave with skills they can use the next week. We adapt the focus to your industry and team size.",
      },
      {
        title: "Formats that fit real schedules",
        body: "Choose from multi-week cohorts, intensive bootcamps, or targeted workshops. We handle facilitation, materials, and progress tracking so your internal team can focus on outcomes.",
      },
    ],
    ctas: [
      { label: "Request a training brief", href: "/contact" },
      { label: "See sample curricula", href: "/what-we-do" },
    ],
    related: [
      { href: "/for-organisations/sponsorships", eyebrow: "Support", title: "Sponsorships", description: "Fund scholarships or full cohorts for young people while building your brand." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Meet learners who have already built portfolios and worked on real projects." },
    ],
  },
  {
    slug: "sponsorships",
    eyebrow: "For organisations",
    title: "Sponsorships",
    description: "Fund training access, devices, and pathways for young people who are ready to build.",
    intro: "Your sponsorship directly removes cost barriers for learners. Every sponsored place covers tuition, learning materials, and wraparound support so more young Ghanaians can complete the programme and move into work or enterprise.",
    stats: heroStats,
    sections: [
      {
        title: "Where sponsorship goes",
        body: "Tuition waivers for learners who cannot afford fees. Devices and data support. Mentorship coordination. Career transition support after graduation. You choose the focus or let us match you to the highest-need cohort.",
      },
      {
        title: "Recognition that feels right",
        body: "We credit sponsors in cohort communications, at graduation, and in impact reporting. We can also create private updates for your team or CSR reporting.",
      },
    ],
    ctas: [
      { label: "Sponsor Cohort 8", href: "/donate" },
      { label: "Talk to the team", href: "/contact" },
    ],
    related: [
      { href: "/our-impact/reports", eyebrow: "Proof", title: "See the Impact", description: "Read how past cohorts have translated support into real outcomes." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Connect directly with the young people your sponsorship helped train." },
    ],
  },
  {
    slug: "hire-graduates",
    eyebrow: "For organisations",
    title: "Hire Our Graduates",
    description: "Meet young people who have built real projects, worked in teams, and proved they can deliver.",
    intro: "Our graduates leave with portfolios, presentation experience, and a track record of completing a demanding 12-week programme. Many are ready for junior roles, internships, or freelance work from day one.",
    stats: heroStats,
    sections: [
      {
        title: "What makes them different",
        body: "They have shipped projects under time pressure. They have presented their thinking to mentors and peers. They have worked in mixed teams. They know how to learn fast because that is what the programme demanded.",
      },
      {
        title: "How to connect",
        body: "Share a role brief with us. We will introduce you to matched graduates, help you run a small project test, or set up a short internship window. No bloated processes — just direct access to people who are ready to work.",
      },
    ],
    ctas: [
      { label: "Share a role or brief", href: "/contact" },
      { label: "See recent graduate work", href: "/our-impact/testimonials" },
    ],
    related: [
      { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Build internal capability while you evaluate future hires." },
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Deeper collaboration routes for companies that want ongoing talent pipelines." },
    ],
  },
  {
    slug: "staff-volunteering",
    eyebrow: "For organisations",
    title: "Staff Volunteering",
    description: "Give your team structured ways to mentor, review work, and contribute real skills to young learners.",
    intro: "Many professionals want to give back but do not know where to start. We create clear, time-bounded roles — project reviewers, mentor sessions, career talks, mock interviews — so your staff can contribute without guesswork.",
    stats: heroStats,
    sections: [
      {
        title: "Roles that actually help",
        body: "One-off talks. Multi-week mentorship. Portfolio reviews. Mock interviews. Facilitation support during challenge weeks. We match the ask to the time your team can realistically give.",
      },
      {
        title: "What volunteers say",
        body: "People who volunteer with us often tell us it sharpened their own communication and leadership skills. It is not charity work — it is two-way professional development.",
      },
    ],
    ctas: [
      { label: "Propose a volunteering window", href: "/contact" },
      { label: "See current opportunities", href: "/partner-with-us" },
    ],
    related: [
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Turn volunteering relationships into hiring pipelines." },
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Structure a longer-term skills partnership." },
    ],
  },
];

export const partnershipPages: SitePage[] = [
  {
    slug: "educational",
    eyebrow: "Partnership track",
    title: "Educational Institutions",
    description: "Work with schools, universities, and learning communities to bring consistent digital skills access to students.",
    intro: "Schools and tertiary institutions are some of our strongest partners. We help them run tech clubs, host outreach, refer students into training, and create recurring pathways so young people do not just get one exposure — they get a route.",
    stats: heroStats,
    sections: [
      {
        title: "How schools and universities work with us",
        body: "We co-design club programmes, run teacher-facilitator training, bring challenge formats onto campus, and create clear referral routes into the academy and Girls in Tech. Partners choose the depth that fits their calendar and capacity.",
      },
      {
        title: "What partners gain",
        body: "Students get real, recurring practice. Teachers get support and visibility into industry expectations. Institutions strengthen their digital offering without building everything from scratch. We handle facilitation, materials, and measurement.",
      },
    ],
    ctas: [
      { label: "Start a school partnership", href: "/contact" },
      { label: "See Tech Clubs in action", href: "/what-we-do/tech-clubs" },
    ],
    related: [
      { href: "/what-we-do/tech-clubs", eyebrow: "Programme", title: "Tech Clubs", description: "Recurring school-based clubs that turn one-off interest into sustained practice." },
      { href: "/what-we-do/community-outreach", eyebrow: "Outreach", title: "Community Outreach", description: "First-contact activations that feed into deeper school partnerships." },
    ],
  },
  {
    slug: "government",
    eyebrow: "Partnership track",
    title: "Government",
    description: "Collaborate on scalable youth digital skills and inclusion programmes across regions and institutions.",
    intro: "Government agencies and public bodies can work with us to expand proven models — tech clubs in public schools, regional outreach, challenge programmes, and transition support — with the accountability and documentation that public programmes require.",
    stats: heroStats,
    sections: [
      {
        title: "Where public collaboration adds value",
        body: "We bring delivery experience, curriculum that has been tested with thousands of learners, and a track record of reaching young women and underserved communities. Partners bring scale, policy alignment, and reach into public systems.",
      },
      {
        title: "What we can deliver together",
        body: "Pilot programmes that can be evaluated and expanded. Regional rollouts with local partners. Data and stories that show real outcomes. Clear models for teacher support and student progression.",
      },
    ],
    ctas: [
      { label: "Explore a pilot or collaboration", href: "/contact" },
      { label: "See our reach and outcomes", href: "/our-impact/reports" },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Funders", title: "International Development", description: "Many government-aligned programmes are co-funded with development partners." },
      { href: "/what-we-do/rural-tech-connect", eyebrow: "Access", title: "Rural Tech Connect", description: "Geographic inclusion work that often needs public sector coordination." },
    ],
  },
  {
    slug: "ngo-foundations",
    eyebrow: "Partnership track",
    title: "NGOs & Foundations",
    description: "Mission-aligned partnerships for programme delivery, scholarships, and ecosystem building.",
    intro: "Local and international NGOs and foundations partner with us because we deliver at the last mile — with young people who are often missed by mainstream programmes — and we can show the numbers and the stories.",
    stats: heroStats,
    sections: [
      {
        title: "Partnership models that work",
        body: "Co-funded cohorts. Scholarship programmes for girls or rural learners. Joint challenge or entrepreneurship initiatives. Capacity support where our delivery model complements your existing work. We are comfortable being a strong implementing partner or a visible co-brand.",
      },
      {
        title: "Proof you can stand behind",
        body: "3,000+ youth trained. 40% female participation. 85% of graduates in work, learning, or building. Clear cohort reporting, participant stories, and financial transparency that meets funder expectations.",
      },
    ],
    ctas: [
      { label: "Discuss a partnership", href: "/contact" },
      { label: "Review our impact data", href: "/our-impact/reports" },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Scale", title: "International Development", description: "Many foundation partners work through or alongside development agencies." },
      { href: "/for-organisations/sponsorships", eyebrow: "Support", title: "Sponsorships", description: "A direct route for foundations that want to fund learner places at scale." },
    ],
  },
  {
    slug: "international-development",
    eyebrow: "Partnership track",
    title: "International Development",
    description: "Work with agencies and funders who need credible, locally grounded delivery on youth, skills, and digital inclusion.",
    intro: "We are a Ghanaian organisation with deep community roots and the operational discipline that international partners need. We have worked with Google.org, UNICEF, GIZ, Mastercard Foundation, USAID, and others because we deliver, we measure, and we tell the story honestly.",
    stats: heroStats,
    sections: [
      {
        title: "What development partners value",
        body: "Clear theory of change. Strong gender and inclusion practice. Geographic reach beyond Accra. Real participant data and stories. Reliable reporting and financial stewardship. A partner that can represent the work credibly in-country and in donor conversations.",
      },
      {
        title: "How we align with broader goals",
        body: "Our programmes map directly to skills development, youth employment, gender equity, and digital inclusion priorities. We can speak to SDG alignment and contribute grounded evidence to larger portfolios.",
      },
    ],
    ctas: [
      { label: "Start a conversation", href: "/contact" },
      { label: "See SDG alignment", href: "/our-impact/sdgs" },
    ],
    related: [
      { href: "/partner-with-us/ngo-foundations", eyebrow: "Ecosystem", title: "NGOs & Foundations", description: "Many international programmes are delivered through local NGO and foundation partnerships." },
      { href: "/our-impact/reports", eyebrow: "Evidence", title: "Impact Reports", description: "Review the data and stories that support larger programme reporting." },
    ],
  },
  {
    slug: "technology",
    eyebrow: "Partnership track",
    title: "Technology Companies",
    description: "Sponsor, mentor, volunteer, and hire through a partner that already produces job-ready young talent.",
    intro: "Technology companies in Ghana and beyond work with us for three reasons: they want to give back in a way that actually builds the pipeline; they need early talent that has already shipped projects; and they want structured ways for their own teams to engage without creating new programmes from scratch.",
    stats: heroStats,
    sections: [
      {
        title: "Ways to engage",
        body: "Sponsor full cohorts or targeted scholarships. Run staff volunteering and mentorship programmes. Host challenge briefs or innovation days. Hire directly from our graduate pool. Co-design corporate training that also creates social impact.",
      },
      {
        title: "Why it works for tech teams",
        body: "You get visibility into emerging talent before the market does. Your people get meaningful engagement that builds their own leadership and communication skills. The work is structured, time-bounded, and easy to report on internally.",
      },
    ],
    ctas: [
      { label: "Explore a company partnership", href: "/contact" },
      { label: "Hire our graduates", href: "/for-organisations/hire-graduates" },
    ],
    related: [
      { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Practical skills programmes for your own teams while supporting the mission." },
      { href: "/for-organisations/staff-volunteering", eyebrow: "Engage", title: "Staff Volunteering", description: "Structured roles for your engineers, designers, and leaders to contribute." },
    ],
  },
];

// ─── Hub pages (rich content replacing buildHubPage scaffolds) ─────────────────

export const whoWeAreHub: SitePage = {
  slug: "who-we-are",
  eyebrow: "About ITFY Ghana",
  title: "Who We Are",
  description: "A Ghanaian organisation building digital skills, confidence, and pathways for young people — especially young women and those in underserved communities.",
  intro: "We run cohort-based training, school clubs, outreach, and entrepreneurship support that turns curiosity into careers. 3,000+ youth trained. 85% of graduates in work, further study, or building within six months. We work with schools, companies, and development partners who want measurable outcomes, not just activity.",
  stats: heroStats,
  // Section headings/blurbs previously hardcoded in the component
  overviewTitle: "Built around access, confidence, and visible outcomes",
  overviewDescription:
    "IT For Youth Ghana exists to make digital opportunity practical, welcoming, and measurable for young people who are ready to build.",
  operatingEyebrow: "Operating model",
  operatingTitle: "The way we turn mission into repeatable delivery",
  operatingDescription:
    "These CMS-managed sections describe how ITFY moves from intent to learning environments, evidence, and partner trust.",
  principlesEyebrow: "Principles",
  principlesTitle: "A strong organisation is more than programmes on a calendar",
  principlesDescription:
    "The Who We Are story should show how decisions are made, what standards matter, and why partners can trust the delivery model.",
  principlesHeroEyebrow: "What we protect",
  principlesHeroTitle: "Trust, inclusion, and accountability as the work grows.",
  principlesImage: "/images/randomPictures/mireiotalking.jpg",
  principlesImageAlt: "IT For Youth Ghana facilitator speaking with learners",
  exploreEyebrow: "Keep exploring",
  exploreTitle: "Meet the people, partners, and opportunities behind the mission",
  exploreDescription: "These connected routes make the Who We Are page a hub, not a dead end.",
  nextStepEyebrow: "Next move",
  nextStepTitle: "Start with the route that matches how you want to join the mission.",
  nextStepDescription: "Whether you want to meet the team, partner with delivery, or support the next cohort, choose a clear next step.",
  sections: [
    {
      title: "What drives us",
      body: "Young people in Ghana have ambition and talent. What they often lack is consistent access to training, mentorship, devices, and a community that believes they belong in tech. We exist to close that gap with programmes that are practical, recurring, and honest about outcomes.",
      bullets: [
        "Start with learners who are often closest to opportunity gaps.",
        "Build confidence through practice, visibility, and peer support.",
        "Treat digital skills as a pathway into agency, income, and leadership.",
      ],
    },
    {
      title: "How we work",
      body: "Everything we run is cohort-based or club-based so learners get repetition, peer support, and real projects. We measure progression, not just attendance. We publish impact data and stories because partners and participants deserve transparency.",
      bullets: [
        "Cohorts, clubs, and outreach programmes are designed around repeated practice.",
        "Learners build visible projects instead of only completing lessons.",
        "Facilitators and mentors help translate skills into next-step readiness.",
      ],
    },
    {
      title: "What we measure",
      body: "We keep the work accountable by tracking access, completion, confidence, project output, and progression into employment, further study, entrepreneurship, or community leadership.",
      bullets: [
        "Attendance and completion show whether the environment is working.",
        "Portfolios and presentations show whether learners can apply the skills.",
        "Follow-up outcomes show whether training is becoming real opportunity.",
      ],
    },
    {
      title: "Who we build with",
      body: "The organisation works best as a bridge between learners, schools, companies, development partners, mentors, and volunteers. Each partner role is shaped around what learners need next.",
      bullets: [
        "Schools and communities help us reach learners early.",
        "Companies and mentors bring industry relevance into the room.",
        "Funding and implementation partners help us scale without diluting quality.",
      ],
    },
    {
      title: "What we protect",
      body: "As the work grows, we protect the standards that made it trusted: safe learning environments, inclusion for young women, honest reporting, and programmes that are useful beyond graduation day.",
      bullets: [
        "Inclusion is designed into recruitment, facilitation, and support.",
        "Safeguarding and learner dignity shape how programmes are delivered.",
        "Impact stories are paired with data so the narrative stays honest.",
      ],
    },
    {
      title: "Where we are going",
      body: "The next chapter is a stronger connected pathway: early exposure, deeper technical training, entrepreneurship support, employer relationships, alumni community, and partner-backed growth across more communities.",
      bullets: [
        "Make every public route a clear entry point into the mission.",
        "Use CMS-backed storytelling so the organisation can keep the story current.",
        "Scale partnerships around outcomes, not one-off activity.",
      ],
    },
  ],
  ctas: [
    { label: "Meet the team", href: "/who-we-are/team" },
    { label: "See our partners", href: "/who-we-are/partners" },
    { label: "Join our team", href: "/who-we-are/careers" },
  ],
  related: [
    { href: "/who-we-are/team", eyebrow: "People", title: "Our Team", description: "The facilitators, mentors, and operations team behind the programmes." },
    { href: "/who-we-are/partners", eyebrow: "Credibility", title: "Our Partners", description: "Google.org, UNICEF, GIZ, Mastercard Foundation and others who trust us with delivery." },
    { href: "/who-we-are/careers", eyebrow: "Join", title: "Join Our Team", description: "Roles, volunteering, and ways to contribute your skills to the mission." },
  ],
};

export const applyForTrainingHub: SitePage = {
  slug: "apply-for-training",
  eyebrow: "Learner pathway",
  title: "Apply for Training",
  description: "Cohort-based digital skills programmes in Accra. 12 weeks. Real projects. Clear progression into work or enterprise.",
  intro: "Our training is not a lecture series. You learn by building, presenting, and iterating with mentors who have shipped products. Cohorts run twice a year. Scholarships and device support are available for those who need them. 85% of graduates are in work, learning, or building within six months.",
  heroImage: "/images/randomPictures/peterblackboard.jpg",
  cohorts: trainingCohorts,
  process: trainingProcessSteps,
  processEyebrow: "Apply process",
  processTitle: "A clearer path from first click to first class",
  processDescription: "The training journey is intentionally simple: choose the right route, apply, hear back clearly, and start with a stronger sense of what to expect.",
  stats: heroStats,
  overviewTitle: "The training experience is built to turn interest into momentum",
  overviewDescription:
    "The public training routes help learners answer three practical questions quickly: am I a fit, what can I study, and what happens next if I apply?",
  operatingEyebrow: "Pathways",
  operatingTitle: "Start with the route that answers your biggest question first",
  operatingDescription:
    "Some learners need to confirm fit before anything else. Others need the catalog or application steps. The route structure supports both.",
  principlesEyebrow: "Upcoming cohorts",
  principlesTitle: "See what is opening next before you commit",
  principlesDescription:
    "Timing clarity helps learners decide whether to apply now, wait for a better-fit intake, or ask the team for guidance.",
  exploreEyebrow: "Ready to begin",
  exploreTitle: "Move from interest into the route that fits your next season best",
  exploreDescription:
    "If you are not sure where to begin, start with the course catalog and come back to the fit or process pages whenever you need more clarity.",
  sections: [
    {
      title: "Learning is practical, not abstract",
      body: "Courses are designed around projects, applied exercises, and the confidence that comes from doing real work rather than only hearing theory.",
      bullets: [
        "Build portfolio pieces and practical evidence of skill.",
        "Learn with peers, facilitators, and mentor feedback.",
        "Practice the habits needed to keep growing after the cohort.",
      ],
    },
    {
      title: "Routes are built for different starting points",
      body: "Some learners are discovering technology for the first time, while others are sharpening direction. The catalog is meant to support both.",
      bullets: [
        "Beginner-friendly pathways welcome serious first-time learners.",
        "Intermediate pathways help learners deepen a direction.",
        "Career and entrepreneurship routes connect skills to next steps.",
      ],
    },
    {
      title: "Support matters as much as content",
      body: "The strongest learner journeys include guidance, orientation, clearer expectations, and pathways beyond the first course.",
      bullets: [
        "You do not need to already feel like a tech expert to begin.",
        "Scholarship and device support may be available where barriers are real.",
        "Schedules are shared early so learners can plan around life commitments.",
      ],
    },
    {
      title: "Cohorts create accountability",
      body: "Cohort-based delivery gives learners structure, deadlines, peer momentum, and a shared rhythm for building confidence over time.",
      bullets: [
        "Attendance and project work matter because everyone is progressing together.",
        "Facilitators can spot support needs earlier in a cohort setting.",
        "Final presentations help learners practice showing their work in public.",
      ],
    },
  ],
  ctas: [
    { label: "Browse current courses", href: "/apply-for-training/courses" },
    { label: "Check if you can apply", href: "/apply-for-training/who-can-apply" },
    { label: "See how it works", href: "/apply-for-training/how-it-works" },
  ],
  related: [
    { href: "/apply-for-training/who-can-apply", eyebrow: "Eligibility", title: "Who Can Apply", description: "Age, commitment, and background guidance for prospective learners." },
    { href: "/apply-for-training/how-it-works", eyebrow: "Process", title: "How It Works", description: "From application to onboarding and what happens during the 12 weeks." },
    { href: "/apply-for-training/courses", eyebrow: "Programmes", title: "Browse Courses", description: "Youth Tech Academy, Girls in Tech, and other current offerings." },
  ],
};

export const newsAndUpdatesHub: SitePage = {
  slug: "news-and-updates",
  eyebrow: "Stories & updates",
  title: "News & Updates",
  description: "Programme announcements, graduate stories, and reflections on building digital opportunity in Ghana.",
  intro: "We share what is actually happening — cohort launches, scholarship campaigns, new school partnerships, graduate wins, and honest reflections on what is working and what we are still learning.",
  stats: heroStats,
  sections: [
    {
      title: "What you will find here",
      body: "News items cover time-sensitive updates: application windows, graduation dates, new partnerships, and campaign progress. Blogs are longer-form pieces on programme design, gender inclusion, rural access, and the realities of running skills programmes in Ghana.",
    },
  ],
  ctas: [
    { label: "Read the latest news", href: "/news-and-updates/news" },
    { label: "Explore our thinking", href: "/news-and-updates/blogs" },
  ],
  related: [
    { href: "/news-and-updates/news", eyebrow: "Updates", title: "News", description: "Cohort openings, events, partnerships, and operational announcements." },
    { href: "/news-and-updates/blogs", eyebrow: "Reflections", title: "Blogs", description: "Deeper writing on how we design programmes and why certain choices matter." },
    { href: "/our-impact/testimonials", eyebrow: "Voices", title: "Graduate Stories", description: "Real outcomes told by the young people who lived them." },
  ],
};

export const ourImpactHub: SitePage = {
  slug: "our-impact",
  eyebrow: "Proof & transparency",
  title: "Our Impact",
  description: "Numbers, stories, and alignment with national and global development goals.",
  intro: "We track progression, not just participation. 3,000+ youth trained. 40% female. 85% of graduates in work, further study, or enterprise within six months. Here is the data and the human stories behind it.",
  stats: heroStats,
  sections: [
    {
      title: "How we measure what matters",
      body: "We follow learners after they leave. We record employment, further education, and business starts at 3 months and 6 months. We also track gender balance, geographic spread, and partner feedback. Reports are published so you can see the real picture.",
    },
    {
      title: "Why transparency matters",
      body: "Partners, donors, schools, and families deserve to know what actually happens to the young people who train with us. We do not inflate numbers. We report what we can verify and we are honest about where we still need to improve.",
    },
  ],
  ctas: [
    { label: "Read the latest reports", href: "/our-impact/reports" },
    { label: "See graduate stories", href: "/our-impact/testimonials" },
  ],
  related: [
    { href: "/our-impact/reports", eyebrow: "Data", title: "Impact Reports", description: "Cohort outcomes, progression stats, and downloadable summaries." },
    { href: "/our-impact/testimonials", eyebrow: "Voices", title: "Testimonials", description: "Stories from graduates, school partners, and mentors." },
    { href: "/our-impact/sdgs", eyebrow: "Alignment", title: "UN SDGs", description: "How our work connects to global development priorities." },
  ],
};

// ─── Additional rich hubs (replacing remaining buildHubPage scaffolds) ─────────

export const forOrganisationsHub: SitePage = {
  slug: "for-organisations",
  eyebrow: "Collaborate",
  title: "For Organisations",
  description: "Corporate training, sponsorship, hiring pipelines, and staff volunteering that deliver measurable social impact.",
  intro: "Work with us to train your teams, sponsor young talent, hire graduates who have already shipped projects, or give your staff structured ways to mentor. 3,000+ youth trained. 85% progression rate. Partners include Google.org, UNICEF, GIZ, Mastercard Foundation, and Microsoft.",
  stats: heroStats,
  sections: [
    {
      title: "Four clear routes",
      body: "Corporate training builds internal capability. Sponsorships fund learner places with clear reporting. Hiring gives you direct access to job-ready graduates. Staff volunteering creates meaningful engagement for your people while supporting the mission.",
    },
    {
      title: "Why organisations choose ITFY",
      body: "You get structured programmes, verified outcomes, and Ghana-grounded delivery. No vague promises — we track progression and we publish the numbers. Your support creates visible impact and a stronger local talent pipeline.",
    },
  ],
  ctas: [
    { label: "Explore the routes", href: "/for-organisations/corporate-training" },
    { label: "Talk to the team", href: "/contact" },
  ],
  related: [
    { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Practical digital skills programmes for your staff while supporting young learners." },
    { href: "/for-organisations/sponsorships", eyebrow: "Fund", title: "Sponsorships", description: "Fund full cohorts or targeted scholarships with transparent reporting." },
    { href: "/for-organisations/hire-graduates", eyebrow: "Hire", title: "Hire Our Graduates", description: "Access young talent who have built portfolios and proved themselves in real projects." },
    { href: "/for-organisations/staff-volunteering", eyebrow: "Engage", title: "Staff Volunteering", description: "Structured mentoring, review, and career support roles for your team." },
  ],
};

export const partnerWithUsHub: SitePage = {
  slug: "partner-with-us",
  eyebrow: "Partnership tracks",
  title: "Partner With Us",
  description: "Five partnership routes for schools, government, NGOs, development agencies, and technology companies.",
  intro: "We work with educational institutions, public bodies, foundations, international development partners, and tech companies who want credible, locally grounded delivery on youth skills and digital inclusion. 8,500+ students reached through school and community partnerships.",
  stats: heroStats,
  sections: [
    {
      title: "Partnerships that scale",
      body: "Every track is designed for a different kind of partner. Schools get recurring clubs and referral routes. Government gets scalable models with documentation. NGOs and foundations get last-mile delivery with proof. Development agencies get in-country credibility and SDG alignment. Tech companies get talent pipelines and structured engagement.",
    },
  ],
  ctas: [
    { label: "Find your route", href: "/partner-with-us/educational" },
    { label: "Start a conversation", href: "/contact" },
  ],
  related: [
    { href: "/partner-with-us/educational", eyebrow: "Schools", title: "Educational Institutions", description: "Tech clubs, outreach, and clear pathways from classroom to training." },
    { href: "/partner-with-us/government", eyebrow: "Public", title: "Government", description: "Regional and national programmes with accountability and measurable reach." },
    { href: "/partner-with-us/ngo-foundations", eyebrow: "Mission", title: "NGOs & Foundations", description: "Co-funded cohorts, scholarships, and ecosystem partnerships." },
    { href: "/partner-with-us/international-development", eyebrow: "Scale", title: "International Development", description: "Locally rooted delivery for youth, skills, and inclusion portfolios." },
    { href: "/partner-with-us/technology", eyebrow: "Industry", title: "Technology Companies", description: "Sponsor, mentor, volunteer, and hire through a partner that produces ready talent." },
  ],
};

export const teamHub: SitePage = {
  slug: "team",
  eyebrow: "Our people",
  title: "Our Team",
  description: "Facilitators, mentors, and operations staff who run cohort training, school clubs, and partnerships across Ghana.",
  intro: "We are practitioners first — people who have built products, taught in classrooms, and worked with young people in real Ghanaian contexts. The team combines technical depth, facilitation experience, and operational discipline.",
  heroImage: "/images/randomPictures/mave_peter.JPG",
  heroImageAlt: "Two IT For Youth Ghana facilitators working together during a session",
  stats: heroStats,
  sections: [
    {
      title: "What the team actually does",
      body: "We design and deliver 12-week cohorts. We train and support school facilitators. We run outreach that turns first exposure into sustained interest. We manage partnerships, track outcomes, and publish honest reports. Every role exists to make the learner journey work.",
      image: "/images/randomPictures/peterTalking.jpg",
      imageAlt: "A facilitator explaining a concept to a group of learners",
    },
    {
      title: "How we stay grounded",
      body: "Most of us are Ghanaian or long-term residents. We hire alumni where possible. We spend time in schools and communities, not just offices. We measure what happens to learners after they leave, not just what happens in the room.",
      image: "/images/randomPictures/girlstaslkingUX.jpg",
      imageAlt: "Two young women discussing a user-experience exercise together",
    },
  ],
  ctas: [
    { label: "See open roles", href: "/who-we-are/careers" },
    { label: "Partner with the team", href: "/contact" },
  ],
  related: [
    { href: "/who-we-are/partners", eyebrow: "Credibility", title: "Our Partners", description: "The organisations that trust us to deliver at scale." },
    { href: "/who-we-are/careers", eyebrow: "Join", title: "Join Our Team", description: "Roles, volunteering, and ways to contribute your skills." },
  ],
};

export const partnersHub: SitePage = {
  slug: "partners",
  eyebrow: "Credibility",
  title: "Our Partners",
  description: "Google.org, UNICEF Ghana, GIZ, Mastercard Foundation, Vodafone Ghana, Microsoft, Tony Elumelu Foundation, and USAID — organisations that have chosen ITFY for delivery.",
  intro: "We do not list logos for decoration. Every partner on this page has worked with us on real programmes — funded cohorts, co-designed clubs, sponsored learners, or hired graduates. They return because we deliver numbers and stories they can stand behind.",
  heroImage: "/images/randomPictures/graduation.jpg",
  heroImageAlt: "Partners and graduates together at an IT For Youth Ghana graduation",
  stats: heroStats,
  sections: [
    {
      title: "What partners get",
      body: "Clear proposals. Reliable delivery. Cohort-level reporting. Participant stories with consent. Financial transparency. A Ghanaian organisation that can represent the work credibly in-country and in donor conversations.",
      image: "/images/randomPictures/studentpresentin.jpg",
      imageAlt: "A learner presenting project work to a room",
    },
    {
      title: "Partnership principles",
      body: "We say yes to work we can actually do well. We report honestly, including what did not go to plan. We protect learner dignity in all storytelling. We are comfortable being an implementing partner or a visible co-brand, depending on what serves the mission.",
      image: "/images/randomPictures/redclothingStudents.jpg",
      imageAlt: "Learners collaborating around a shared table during a session",
    },
  ],
  ctas: [
    { label: "Explore partnership routes", href: "/partner-with-us" },
    { label: "Talk to the team", href: "/contact" },
  ],
  related: [
    { href: "/partner-with-us", eyebrow: "Routes", title: "Partner With Us", description: "Five tracks for schools, government, NGOs, development, and tech companies." },
    { href: "/our-impact/reports", eyebrow: "Proof", title: "Impact Reports", description: "The data and stories that support every partnership." },
  ],
};

export const careersHub: SitePage = {
  slug: "careers",
  eyebrow: "Join the mission",
  title: "Join Our Team",
  description: "Roles, volunteering, and contribution pathways for people who want to build digital opportunity in Ghana.",
  intro: "We hire facilitators, programme coordinators, partnership leads, and operations staff who are serious about outcomes. We also create structured volunteering and internship routes for professionals and students who want to contribute without a full-time role.",
  heroImage: "/images/randomPictures/happystudentscasual.jpg",
  heroImageAlt: "Facilitators and learners talking informally between sessions",
  stats: heroStats,
  sections: [
    {
      title: "What we look for",
      body: "People who can teach or mentor at a high standard. People who can run operations without drama. People who treat young Ghanaians with respect and high expectations at the same time. Technical skill matters, but character and consistency matter more.",
      image: "/images/randomPictures/uXstudents.jpg",
      imageAlt: "Learners working through a design exercise at their laptops",
    },
    {
      title: "How to engage",
      body: "Full-time and contract roles are posted when open. Volunteering windows (mentorship, portfolio review, career talks) can be proposed anytime. Alumni often return as facilitators or mentors — that pipeline is real.",
      image: "/images/randomPictures/whiteLady.jpg",
      imageAlt: "A mentor working one to one with a learner",
    },
  ],
  ctas: [
    { label: "See current openings", href: "/contact" },
    { label: "Propose a volunteering window", href: "/contact" },
  ],
  related: [
    { href: "/who-we-are/team", eyebrow: "People", title: "Our Team", description: "Meet the facilitators and operations staff already on the ground." },
    { href: "/for-organisations/staff-volunteering", eyebrow: "Companies", title: "Staff Volunteering", description: "Structured ways for company teams to contribute." },
  ],
};

export const testimonialsHub: SitePage = {
  slug: "testimonials",
  eyebrow: "Real voices",
  title: "Testimonials",
  description: "Stories from graduates, school partners, and mentors who have lived the programmes.",
  intro: "Numbers tell part of the story. The rest comes from the young people who trained, the teachers who hosted clubs, and the professionals who mentored. These are the voices that keep us honest about what works.",
  stats: heroStats,
  sections: [
    {
      title: "How we collect stories",
      body: "We interview graduates at 3 and 6 months. We ask school partners for feedback after each term. We capture mentor reflections during and after cohorts. All stories are shared with consent and we are careful not to over-claim.",
    },
  ],
  ctas: [
    { label: "Read impact reports", href: "/our-impact/reports" },
    { label: "See the latest news", href: "/news-and-updates/news" },
  ],
  related: [
    { href: "/our-impact/reports", eyebrow: "Data", title: "Impact Reports", description: "Progression stats and cohort outcomes that sit alongside the stories." },
    { href: "/news-and-updates/blogs", eyebrow: "Reflections", title: "Blogs", description: "Deeper writing on programme design and what we are learning." },
  ],
};

export const sdgsHub: SitePage = {
  slug: "sdgs",
  eyebrow: "Global alignment",
  title: "UN SDGs",
  description: "How ITFY's work on youth skills, gender inclusion, and digital access connects to the Sustainable Development Goals.",
  intro: "We are a Ghanaian organisation first, but our programmes map directly to global development priorities. Skills development, youth employment, gender equity, and digital inclusion are not abstract goals — they are the daily work.",
  stats: heroStats,
  sections: [
    {
      title: "Primary alignments",
      body: "SDG 4 (Quality Education): cohort training, tech clubs, and teacher support that give young people practical digital skills. SDG 5 (Gender Equality): Girls in Tech and deliberate 40% female participation targets. SDG 8 (Decent Work): 85% progression into work, study, or enterprise within six months.",
    },
    {
      title: "Secondary alignments",
      body: "SDG 9 (Industry & Innovation): entrepreneurship support and challenge-based learning. SDG 10 (Reduced Inequalities): rural outreach and scholarships that reach learners who would otherwise be excluded. SDG 17 (Partnerships): every major programme is delivered with schools, companies, or development partners.",
    },
  ],
  ctas: [
    { label: "See impact data", href: "/our-impact/reports" },
    { label: "Partner on SDG-aligned work", href: "/partner-with-us/international-development" },
  ],
  related: [
    { href: "/partner-with-us/international-development", eyebrow: "Funders", title: "International Development", description: "The partnership track most aligned with SDG portfolios." },
    { href: "/our-impact/reports", eyebrow: "Evidence", title: "Impact Reports", description: "Data and stories that support SDG reporting." },
  ],
};

export const whoCanApplyHub: SitePage = {
  slug: "apply-for-training-who-can-apply",
  eyebrow: "Eligibility",
  title: "Who Can Apply",
  description: "Clear guidance on age, commitment, background, and what makes a strong applicant for ITFY training.",
  intro: "We are looking for young Ghanaians who are ready to commit 12 weeks of focused learning. No prior coding experience is required for beginner tracks. We especially welcome young women and learners from communities with limited tech access.",
  heroImage: "/images/randomPictures/studentsblueclothing.jpg",
  stats: heroStats,
  overviewTitle: "Different routes suit different starting points",
  overviewDescription:
    "Eligibility is not only about what a learner already knows. It is also about timing, commitment, and whether the course level matches what they need right now.",
  operatingEyebrow: "What helps",
  operatingTitle: "Readiness matters more than polish",
  operatingDescription:
    "Learners do not need to arrive with a perfect story. What matters more is whether they can engage honestly with the process and commit to showing up for the cohort.",
  exploreEyebrow: "Next steps",
  exploreTitle: "Once the fit feels clearer, keep moving",
  exploreDescription:
    "The next best step is usually to browse the course catalog or understand the application sequence for Cohort 8.",
  sections: [
    {
      title: "Beginners looking for a real entry point",
      body: "Learners who need a first serious path into technology, especially when they have interest but not yet structure.",
      bullets: [
        "No professional tech background required for beginner routes.",
        "Curiosity, consistency, and willingness to learn are stronger signals than polish.",
        "A basic comfort using a phone or computer helps, but it does not need to be advanced.",
      ],
    },
    {
      title: "Learners ready to deepen a direction",
      body: "People who have touched digital skills before and now want more focus, more discipline, or a clearer pathway.",
      bullets: [
        "Intermediate tracks work best when the learner can commit time outside class.",
        "A portfolio is useful for some routes but not always required to begin.",
        "The goal is not perfection before entry, but readiness to build on a foundation.",
      ],
    },
    {
      title: "Young people navigating transition moments",
      body: "School leavers, graduates, and early-career youth who need stronger digital confidence, a clearer portfolio, or a practical step toward work.",
      bullets: [
        "Transition periods are often the right time for structured cohort learning.",
        "Some pathways are especially useful when you are between school and work decisions.",
        "Attendance reliability matters because cohort momentum affects everyone.",
      ],
    },
    {
      title: "What makes an application strong",
      body: "Clear motivation, honest availability, willingness to work in teams, and evidence that the learner can persist through a structured programme.",
      bullets: [
        "Be honest about your goals, time, and support needs.",
        "Read the course notes carefully before choosing a route.",
        "If one course is not the right fit yet, another route may still work.",
      ],
    },
  ],
  ctas: [
    { label: "Browse current courses", href: "/apply-for-training/courses" },
    { label: "See how it works", href: "/apply-for-training/how-it-works" },
  ],
  related: [
    { href: "/apply-for-training/how-it-works", eyebrow: "Process", title: "How It Works", description: "From application to onboarding and what happens during the 12 weeks." },
    { href: "/apply-for-training/courses", eyebrow: "Programmes", title: "Browse Courses", description: "Youth Tech Academy, Girls in Tech, and current offerings." },
  ],
};

export const howItWorksHub: SitePage = {
  slug: "apply-for-training-how-it-works",
  eyebrow: "Learner journey",
  title: "How It Works",
  description: "From application to graduation: the steps, expectations, and support that define the ITFY training experience.",
  intro: "Our training is cohort-based and project-driven. You apply, get selected, join a 12-week programme, ship real work, present to mentors, and leave with a portfolio and a next-step plan. Scholarships, devices, and career support are available throughout.",
  heroImage: "/images/randomPictures/studentslisteningfrontal.JPG",
  stats: heroStats,
  overviewTitle: "Four steps, one clearer journey",
  overviewDescription:
    "The process gives learners a fuller explanation of what each stage is meant to do, from choosing a route to joining the cohort.",
  operatingEyebrow: "Timeline",
  operatingTitle: "What the process usually looks like in practice",
  operatingDescription:
    "Exact dates shift by cohort, but the overall sequence stays consistent enough that learners can plan with confidence.",
  principlesEyebrow: "Prepare well",
  principlesTitle: "Small preparation steps make the process smoother",
  principlesDescription:
    "Most friction in application flows comes from uncertainty. These preparation steps help learners submit with fewer surprises.",
  exploreEyebrow: "Next steps",
  exploreTitle: "Keep moving while the decision is still fresh",
  exploreDescription:
    "Once the process makes sense, the next useful move is either choosing a pathway or checking whether the fit is right before you apply.",
  sections: [
    {
      title: "Choose your route",
      body: "Start by finding the course or cohort that matches your stage, interests, schedule, and confidence level.",
      bullets: [
        "Read the course overview before applying.",
        "Check the level, duration, and delivery format.",
        "Compare timing with school, work, and family obligations.",
      ],
    },
    {
      title: "Apply with context",
      body: "Share basic background, motivation, and availability so the team can understand your fit and support needs.",
      bullets: [
        "Explain why the route matters for your next step.",
        "Be honest about availability and barriers.",
        "Tell us if fees, devices, or data support may be a blocker.",
      ],
    },
    {
      title: "Review and confirm",
      body: "Applications are reviewed, shortlisted learners are contacted, and final places are confirmed before onboarding.",
      bullets: [
        "The team reviews fit, readiness, and cohort capacity.",
        "Some routes may include a short conversation or task.",
        "Shortlisted learners receive clear next-step communication.",
      ],
    },
    {
      title: "Join the cohort",
      body: "Accepted learners receive orientation details, start dates, expectations, and the support notes they need for a strong first class.",
      bullets: [
        "Orientation explains tools, schedules, and attendance expectations.",
        "Learners start with a shared rhythm and support structure.",
        "Project work and feedback begin early in the cohort.",
      ],
    },
    {
      title: "Application window",
      body: "Applications open with a defined deadline so learners are not guessing when places might become available.",
      bullets: [
        "Watch cohort dates and deadlines closely.",
        "Prepare early if you need support documents or family approval.",
        "Ask questions before the deadline if timing is unclear.",
      ],
    },
    {
      title: "After graduation",
      body: "Graduates receive follow-up, alumni community access, job and internship referrals where relevant, and entrepreneurship support for those building.",
      bullets: [
        "Keep your project evidence and portfolio updated.",
        "Respond to 3-month and 6-month outcome check-ins.",
        "Use alumni and mentor connections to keep progressing.",
      ],
    },
  ],
  ctas: [
    { label: "Check if you can apply", href: "/apply-for-training/who-can-apply" },
    { label: "Apply for Cohort 8", href: "/apply-for-training/courses" },
  ],
  related: [
    { href: "/apply-for-training/who-can-apply", eyebrow: "Fit", title: "Who Can Apply", description: "Age, commitment, and background guidance." },
    { href: "/apply-for-training/courses", eyebrow: "Offerings", title: "Browse Courses", description: "Current programmes and application windows." },
  ],
};

export const trainingCoursesHub: SitePage = {
  slug: "apply-for-training-courses",
  eyebrow: "Course catalog",
  title: "Find the right training pathway",
  description: "Compare current programmes by level, format, and focus. Cohort 8 Foundations is now open, with short sprints and career labs starting through August.",
  intro: "Browse seeded and live options side by side. Every pathway is project-driven, with clear start dates, deadlines, and progression support. Use the timeline and process sections below to plan your application.",
  heroImage: "/images/randomPictures/studentslistening.jpg",
  cohorts: trainingCohorts,
  process: trainingProcessSteps,
  stats: heroStats,
  overviewTitle: "Compare the pathways before you choose",
  overviewDescription:
    "Review level, duration, delivery mode, cost, and start dates so you can select the route that matches your current stage and goals.",
  operatingEyebrow: "Upcoming cohorts",
  operatingTitle: "Cohort 8 Foundations is open. More programmes start in July and August.",
  operatingDescription:
    "Review exact dates, formats, and deadlines so you can plan your application and participation with confidence.",
  principlesEyebrow: "How to apply",
  principlesTitle: "Four clear steps from interest to your first class",
  principlesDescription:
    "We keep the process transparent. Know what to prepare, when decisions happen, and what support is available before you apply.",
  exploreEyebrow: "Next steps",
  exploreTitle: "Not sure which course is right yet?",
  exploreDescription:
    "Check eligibility guidance or review the full process before you apply. The team can also answer questions directly.",
  sections: [
    {
      title: "What you can compare",
      body: "Use the catalog to compare course level, duration, delivery mode, cost, and start dates before choosing a route.",
      image: "/images/randomPictures/UX4.jpg",
      imageAlt: "A learner comparing layout options on screen during a design session",
      bullets: [
        "Across more than six pathways, you can weigh software development, design, data, marketing, entrepreneurship, and employability against the kind of work you want to pursue.",
        "The catalog also makes the practical differences visible, from free and scholarship-supported options to modest-fee programmes, upcoming start dates, and application deadlines.",
      ],
    },
    {
      title: "How to shortlist well",
      body: "A strong shortlist starts with your current stage, not only the trendiest skill. Choose the route that matches what you can commit to now.",
      image: "/images/randomPictures/mave_peter.JPG",
      imageAlt: "Two facilitators reviewing course options together",
      bullets: [
        "Choose a beginner route when you need structure and confidence, or an intermediate route when you can practise consistently outside scheduled sessions.",
        "Career-focused routes make the most sense when you already have work to refine, package, and present to employers or clients.",
      ],
    },
  ],
  ctas: [
    { label: "Check who can apply", href: "/apply-for-training/who-can-apply" },
    { label: "See how it works", href: "/apply-for-training/how-it-works" },
  ],
  related: [
    { href: "/apply-for-training/who-can-apply", eyebrow: "Fit", title: "Who Can Apply", description: "Understand whether the training route matches your stage and readiness." },
    { href: "/apply-for-training/how-it-works", eyebrow: "Process", title: "How It Works", description: "Know what happens after you choose a route and submit interest." },
    { href: "/contact", eyebrow: "Support", title: "Ask a Question", description: "Reach the team if you need help choosing the right training pathway." },
  ],
};

export const articles: ArticleSeed[] = [
  {
    slug: "cohort-8-scholarship-campaign",
    category: "news",
    title: "ITFY launches a scholarship campaign for Cohort 8 applicants",
    excerpt: "The new campaign focuses on tuition support, devices, and mentoring so more learners can enter Cohort 8 without cost becoming a blocker.",
    publishedAt: "2026-04-23",
    coverImage: "/images/randomPictures/UXteacher.png",
    readTimeMinutes: 4,
    content: [
      "The Cohort 8 scholarship campaign is designed to remove the barriers that keep talented young people from starting their digital journey.",
      "This phase of fundraising supports tuition waivers, learning devices, and wraparound mentorship for participants who are ready to take the next step.",
      "The campaign also gives partners and donors a clearer way to connect their support directly to learner outcomes.",
    ],
  },
  {
    slug: "community-tech-clubs-expansion",
    category: "news",
    title: "Community tech clubs are expanding into more schools this term",
    excerpt: "A new rollout plan is helping ITFY strengthen recurring access points for students who need more than one-off exposure to technology.",
    publishedAt: "2026-04-21",
    coverImage: "/images/randomPictures/studentsblueclothing.jpg",
    readTimeMinutes: 3,
    content: [
      "The next expansion of school-based tech clubs is focused on consistency, not just reach.",
      "By working with school leaders and local facilitators, the programme is building spaces where students can keep practicing over time.",
      "That recurring engagement is a key part of turning interest into confidence and confidence into pathway decisions.",
    ],
  },
  {
    slug: "cohort-8-now-open",
    category: "news",
    title: "Cohort 8 applications are now open across Accra",
    excerpt: "Young people can apply for Cohort 8 of the Youth Tech Academy and Girls in Tech programmes. Scholarships and device support are available for those who need them.",
    publishedAt: "2026-04-18",
    coverImage: "/images/randomPictures/maingraduationpic.jpg",
    readTimeMinutes: 3,
    content: [
      "Cohort 8 is now accepting applications for the Youth Tech Academy and Girls in Tech programmes.",
      "The 12-week training covers web development, data fundamentals, and professional skills. Every participant ships real projects and presents to mentors.",
      "Scholarship places, device support, and data stipends are available for learners who would otherwise be unable to join.",
    ],
  },
  {
    slug: "why-homepage-clarity-matters",
    category: "blogs",
    title: "Why homepage clarity matters for growing mission-driven teams",
    excerpt: "A stronger homepage sequence makes trust, urgency, and discovery easier for learners, funders, and partners.",
    publishedAt: "2026-04-19",
    coverImage: "/images/randomPictures/mireiotalking.jpg",
    readTimeMinutes: 5,
    content: [
      "For a growing organisation, the homepage has to do more than look polished. It has to guide multiple audiences quickly and clearly.",
      "That is why we give special attention to the opening sequence: announcement, hero, impact proof, and clear next steps.",
      "That stack helps young people, partners, and organisations understand the mission and the pathways available to them in just a few seconds.",
    ],
  },
  {
    slug: "why-partnership-storytelling-builds-trust",
    category: "blogs",
    title: "Why partnership storytelling matters when an organisation is scaling",
    excerpt: "Partners do not just need a donation page. They need evidence, clarity, and a fast way to see where they fit in the mission.",
    publishedAt: "2026-04-17",
    coverImage: "/images/randomPictures/groupworkstudents.jpg",
    readTimeMinutes: 4,
    content: [
      "Good partnership storytelling creates confidence before a meeting ever happens.",
      "It helps potential collaborators understand what the organisation already does well and where support can amplify that work.",
      "That is why we make room for partner-facing proof, clearer calls to action, and better visibility into programme outcomes.",
    ],
  },
];

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    description: "Overview, activity, and publishing health.",
  },
  {
    label: "Usage & Documentation",
    href: "/admin/documentation",
    description: "CMS guide, page map, publishing rules, and update targets.",
  },
  {
    label: "Content",
    href: "/admin/content",
    description: "Content Explorer: hubs and page editors.",
  },
  {
    label: "What We Do",
    href: "/admin/programmes",
    description: "What We Do overview and initiative subpage CMS.",
  },
  {
    label: "What We Do Pages",
    href: "/admin/what-we-do-pages",
    description: "Custom pages below the What We Do hub.",
  },
  {
    label: "Who We Are",
    href: "/admin/content/who-we-are",
    description: "About page copy, stats, CTAs, and related routes.",
  },
  {
    label: "Who We Are Pages",
    href: "/admin/who-we-are-pages",
    description: "Custom pages below the Who We Are hub, such as board, governance, or advisors.",
  },
  {
    label: "Apply Training",
    href: "/admin/content/apply-for-training",
    description: "Training hub copy, stats, CTAs, and route cards.",
  },
  {
    label: "Training Fit",
    href: "/admin/content/apply-for-training-who-can-apply",
    description: "Eligibility guidance and learner readiness content.",
  },
  {
    label: "Training Process",
    href: "/admin/content/apply-for-training-how-it-works",
    description: "Application journey, timeline, and preparation content.",
  },
  {
    label: "Training Courses",
    href: "/admin/content/apply-for-training-courses",
    description: "Course catalog page copy and support route cards.",
  },
  {
    label: "Banner",
    href: "/admin/content/banner",
    description: "Top-of-site announcement bar.",
  },
  {
    label: "Hero Slides",
    href: "/admin/content/hero-slides",
    description: "Slideshow slides and CTAs.",
  },
  {
    label: "Donation Campaign",
    href: "/admin/content/donation-campaign",
    description: "Homepage donation campaign content.",
  },
  {
    label: "Featured Story",
    href: "/admin/content/featured-story",
    description: "Homepage story/video proof block.",
  },
  {
    label: "Floating Elements",
    href: "/admin/content/floating-elements",
    description: "Donate button, scroll-to-top, exit-intent.",
  },
  {
    label: "Impact Stats",
    href: "/admin/content/impact-stats",
    description: "Headline stats used across pages.",
  },
  {
    label: "Contact Page",
    href: "/admin/content/contact",
    description: "Contact hero, channels, enquiry options, and routing cards.",
  },
  {
    label: "Our Impact",
    href: "/admin/our-impact",
    description: "Impact overview, reports, testimonials, and SDG pages.",
  },
  {
    label: "Articles",
    href: "/admin/articles",
    description: "News and blog management scaffolding.",
  },
  {
    label: "News & Updates",
    href: "/admin/news-and-updates",
    description: "News hub and listing page content.",
  },
  {
    label: "Team",
    href: "/admin/team",
    description: "Profiles, departments, and featured people.",
  },
  {
    label: "Departments",
    href: "/admin/departments",
    description: "Department pages, responsibilities, priorities, teams, and resources.",
  },
  {
    label: "Partners",
    href: "/admin/partners",
    description: "Logos, links, and organisation metadata.",
  },
  {
    label: "Partner With Us",
    href: "/admin/partner-with-us",
    description: "Partnership overview and partner track pages.",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    description: "Training application review workflow.",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    description: "Public contact and integration status.",
  },
];

// ─── Hero slides ──────────────────────────────────────────────────────────────

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-students",
    eyebrow: "For young Ghanaians",
    heading: "Build practical digital skills. Gain confidence. Shape your future.",
    body: "Cohort-based training in Accra for young people ready to move from curiosity to real digital careers, entrepreneurship, or further study. 3,000+ youth trained. 85% of graduates progress into work, learning, or enterprise within six months.",
    image: "/images/randomPictures/maingraduationpic.jpg",
    overlayFrom: "rgba(10,15,40,0.88)",
    overlayTo: "rgba(10,15,40,0.35)",
    accent: "#1E72BA",
    mediaCaption: "Graduation day, Accra",
    cta: {
      primary:   { label: "Apply for Cohort 8", href: "/apply-for-training/courses" },
      secondary: { label: "See who can apply",  href: "/apply-for-training/who-can-apply" },
    },
  },
  {
    id: "slide-partners",
    eyebrow: "For partners & supporters",
    heading: "Invest in Ghana's next generation of digital talent.",
    body: "3,000+ youth trained. 8,500+ students reached through school and community partnerships. 40% female participation. Your support funds scholarships, devices, mentorship, and measurable pathways into work and enterprise.",
    image: "/images/randomPictures/groupworkstudents.jpg",
    overlayFrom: "rgba(5,25,15,0.88)",
    overlayTo: "rgba(5,25,15,0.40)",
    accent: "#D70B52",
    mediaCaption: "Practical session, group work",
    cta: {
      primary:   { label: "Donate to Cohort 8", href: "/donate" },
      secondary: { label: "See our impact",     href: "/our-impact/reports" },
    },
  },
  {
    id: "slide-organisations",
    eyebrow: "For organisations",
    heading: "Train your teams. Sponsor talent. Hire job-ready graduates.",
    body: "Partner with IT For Youth Ghana for corporate training, staff volunteering, scholarship sponsorship, or direct access to graduates who have built portfolios and demonstrated real project delivery.",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    overlayFrom: "rgba(30,15,5,0.88)",
    overlayTo: "rgba(30,15,5,0.40)",
    accent: "#0152BE",
    mediaCaption: "Cohort workstations, Accra",
    cta: {
      primary:   { label: "Work with us",        href: "/for-organisations" },
      secondary: { label: "Hire our graduates",  href: "/for-organisations/hire-graduates" },
    },
  },
];

// ─── Featured programs ────────────────────────────────────────────────────────

export const featuredPrograms: FeaturedProgram[] = [
  {
    id: "bootcamp",
    eyebrow: "Flagship Initiative",
    title: "Digital Skills Bootcamp",
    description:
      "A 12-week intensive programme in web development, data literacy, and digital entrepreneurship. Cohorts run with structured mentorship from day one, culminating in portfolio projects and career transition support.",
    image: "/images/randomPictures/groupworkstudents.jpg",
    href: "/apply-for-training/courses",
    cta: "Apply for Cohort 8",
    tags: ["12 weeks", "In-person", "Accra"],
    featured: true,
  },
  {
    id: "junior-coders",
    eyebrow: "For Schools",
    title: "Junior Coders Club",
    description:
      "Free, recurring coding clubs delivered in secondary schools across Accra, Kumasi, and Takoradi to build early digital fluency and interest.",
    href: "/what-we-do/tech-clubs",
    cta: "Enrol your school",
    tags: ["Free", "Secondary schools"],
  },
  {
    id: "tech-sisters",
    eyebrow: "For Women",
    title: "Tech Sisters Initiative",
    description:
      "Targeted scholarships, mentorship, and community support designed to increase the participation and leadership of young women in Ghana's digital economy.",
    href: "/what-we-do/girls-in-tech",
    cta: "Learn more",
    tags: ["Scholarships", "Mentorship"],
  },
  {
    id: "startup-launchpad",
    eyebrow: "For Entrepreneurs",
    title: "Startup Launchpad",
    description:
      "Practical venture training, prototype development support, and connections to early-stage funding and alumni networks for aspiring founders.",
    href: "/what-we-do/entrepreneurship-hub",
    cta: "Explore",
    tags: ["Venture support", "Networking"],
  },
];

export const overviewSectionContent: OverviewSectionContent = {
  title: "Digital opportunity",
  headline: "Skills that move young people forward",
  description: "IT For Youth Ghana helps young people build practical digital skills, confidence, and clear pathways into work, further study, and enterprise.",
  storyTitle: "Why we exist",
  storyHeadline: "Ghana’s digital growth should include every young person.",
  storyDescription: "Ghana’s digital economy is creating new possibilities, but access to quality training, devices, and career guidance remains uneven. We close that gap with structured learning built around the skills young people can use.",
  callout: "Our programmes prioritise young women and underserved communities. Each cohort combines hands-on training, mentorship, and real projects so participants leave with evidence of what they can do and a practical next step.",
  image: "/images/randomPictures/studentslistening.jpg",
  imageAlt: "Students learning technology",
  imageLabel: "Learning by doing",
  imageCaption: "Practical training, projects, and mentorship",
  ctaLabel: "Find your training pathway",
  ctaHref: "/apply-for-training",
  active: true,
};

export const challengeSectionContent: ChallengeSectionContent = {
  title: "The challenge",
  headline: "Talent is everywhere. Access is not.",
  description: "Ghana’s digital divide keeps capable young people from the learning, connections, and opportunities they need to participate in the digital economy.",
  image: "/images/randomPictures/children_holding_sign_in_streets.jpg",
  imageAlt: "Young people holding handwritten signs during a community outreach activity",
  stats: [
    { label: "Offline Population", value: "30.1%", description: "10.5M people without internet access" },
    { label: "Rural Digital Gap", value: "77.3%", description: "Rural residents without internet" },
    { label: "Limited Access", value: "25%", description: "Rural areas lack mobile coverage" },
    { label: "Skills Gap", value: "70%", description: "Youth lack digital skills" },
  ],
  comparisonTitle: "What the digital divide changes",
  problemTitle: "Without digital access",
  problemItems: [
    "Limited job opportunities",
    "Reduced access to education",
    "Isolation from digital economy",
    "Decreased social mobility",
  ],
  solutionTitle: "With IT For Youth Ghana",
  solutionItems: [
    "Practical digital skills training",
    "Mentorship and career guidance",
    "Real projects and portfolio building",
    "Pathways into work, study, and enterprise",
  ],
  ctaText: "Help more young people turn digital access into lasting opportunity.",
  ctaLabel: "Support digital skills training",
  ctaHref: "https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/",
  active: true,
};

export const missionSectionContent: MissionSectionContent = {
  title: "Our direction",
  headline: "A digital future shaped by every young Ghanaian",
  description: "We see a Ghana where geography, gender, or income does not decide who gets to learn, create, and lead with technology.",
  image: "/images/randomPictures/studentsblueclothing.jpg",
  imageAlt: "Students learning technology",
  imageLabel: "Building Ghana’s tech future",
  imageCaption: "Through inclusive technology education",
  missionTitle: "Our mission",
  missionHeadline: "Turn digital learning into real opportunity.",
  missionDescription: "We equip young Ghanaians—particularly women and underserved communities—with practical skills, mentorship, and pathways into employment, further study, and business-building.",
  ctaLabel: "Discover who we are",
  ctaHref: "/who-we-are",
  active: true,
};

export const programmeShowcase: ProgrammeShowcaseItem[] = [
  {
    id: "initiative-girls-in-tech",
    eyebrow: "Inclusion pathway",
    title: "Girls in Tech",
    description: "Mentorship, confidence-building, and technical training designed to increase the participation and leadership of young women in Ghana's digital economy.",
    href: "/what-we-do/girls-in-tech",
    image: "/images/randomPictures/group_girls.jpg",
    accent: "#D70B52",
    icon: "👩‍💻",
  },
  {
    id: "initiative-youth-academy",
    eyebrow: "Training pathway",
    title: "Youth Tech Academy",
    description: "Cohort-based digital skills training that takes young people from foundational skills to job-ready portfolios in 12 focused weeks.",
    href: "/what-we-do/youth-academy",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    accent: "#1E72BA",
    icon: "💡",
  },
  {
    id: "initiative-entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description: "Practical support for young founders turning digital skills into ideas, prototypes, and early-stage ventures that address local challenges.",
    href: "/what-we-do/entrepreneurship-hub",
    image: "/images/randomPictures/studentpresenting.jpg",
    accent: "#0152BE",
    icon: "🚀",
  },
  {
    id: "initiative-code-impact-challenge",
    eyebrow: "Challenge pathway",
    title: "Code Impact Challenge",
    description: "Time-bound, team-based challenges where participants build real solutions to problems that matter in their communities.",
    href: "/what-we-do/code-impact-challenge",
    image: "/images/randomPictures/redstudentgrouplesson.jpg",
    accent: "#C44900",
    icon: "🧠",
  },
  {
    id: "initiative-rural-tech-connect",
    eyebrow: "Access pathway",
    title: "Rural Tech Connect",
    description: "Extending training, devices, and opportunity to young people in communities beyond Accra through local school and community partnerships.",
    href: "/what-we-do/rural-tech-connect",
    image: "/images/randomPictures/children_holding_sign_in_streets.jpg",
    accent: "#2A6F97",
    icon: "🌍",
  },
  {
    id: "initiative-community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description: "School visits, activations, and events that convert first exposure into sustained interest and clear next steps for thousands of students.",
    href: "/what-we-do/community-outreach",
    image: "/images/randomPictures/studentslistening.jpg",
    accent: "#8B5E34",
    icon: "🤝",
  },
  {
    id: "initiative-advocacy",
    eyebrow: "Influence pathway",
    title: "Advocacy",
    description: "Thought leadership and coalition-building that elevates youth digital opportunity as a priority for institutions, policymakers, and funders.",
    href: "/what-we-do/advocacy",
    image: "/images/randomPictures/graduationspeaking.jpg",
    accent: "#A63D40",
    icon: "📣",
  },
  {
    id: "initiative-tech-clubs",
    eyebrow: "School pathway",
    title: "Tech Clubs",
    description: "Recurring, school-based clubs that provide students with consistent practice, peer learning, and sustained skill development over time.",
    href: "/what-we-do/tech-clubs",
    image: "/images/randomPictures/studentgroupguys.jpg",
    accent: "#1F7A8C",
    icon: "🏫",
  },
];

export const activeDonationCampaign: DonationCampaignContent = {
  id: "campaign-cohort-8-scholarships",
  eyebrow: "Active campaign",
  headline: "Fund scholarships for Cohort 8 learners",
  description:
    "Your support removes financial barriers for young Ghanaians ready to build careers in technology. Every contribution funds tuition, devices, mentorship, and structured pathways from training into work or enterprise.",
  image: "/images/randomPictures/UXteacher_opt.jpg",
  currency: "USD",
  goalAmount: 67500,
  raisedAmount: 45230,
  donorCount: 186,
  deadline: "2026-08-15T23:59:59.000Z",
  supportPoints: [
    "Sponsor full training access for learners who could not otherwise participate.",
    "Increase girls' participation through targeted scholarships and mentoring.",
    "Support graduates with career readiness, internships, and entrepreneurship pathways.",
  ],
  primaryCta: { label: "Donate now", href: "/donate" },
  secondaryCta: { label: "See how donations create impact", href: "/our-impact/reports" },
  active: true,
};

export const departments: DepartmentProfile[] = [
  {
    id: "programmes",
    slug: "programmes",
    eyebrow: "Delivery",
    title: "Programmes Department",
    summary: "Owns learner pathways, cohort delivery, mentoring rhythms, and programme quality.",
    description:
      "The Programmes Department turns IT For Youth Ghana's mission into structured learner experiences. It coordinates cohorts, mentors, facilitators, learner support, and the progression pathway from enrolment to portfolio, work, further study, or enterprise.",
    intro:
      "This department is the operating heart of the training experience, making sure young people move through clear, supportive, and measurable learning journeys.",
    mission:
      "Design and deliver reliable, inclusive programmes that help young Ghanaians build practical digital skills and confidence.",
    heroImage: "/images/randomPictures/groupworkstudents.jpg",
    icon: "🎓",
    color: "#1E72BA",
    responsibilities: [
      "Plan and coordinate cohort calendars, facilitator schedules, and learner support.",
      "Track attendance, learner progress, mentoring touchpoints, and completion readiness.",
      "Coordinate safeguarding, learner wellbeing, and escalation where extra support is needed.",
      "Connect programme outcomes to alumni, career, enterprise, and partner opportunities.",
    ],
    services: [
      {
        title: "Cohort delivery",
        body: "End-to-end delivery of training cohorts, from onboarding and weekly operations to graduation readiness.",
        bullets: ["Timetables", "Facilitator coordination", "Learner support"],
      },
      {
        title: "Mentorship coordination",
        body: "Matching learners with mentors, tracking check-ins, and keeping support relationships useful.",
        bullets: ["Mentor matching", "Progress check-ins", "Portfolio guidance"],
      },
    ],
    workflows: [
      { title: "Plan", description: "Confirm cohort goals, curriculum needs, facilitators, and learner support capacity." },
      { title: "Deliver", description: "Run sessions, monitor attendance, and respond to learner risks early." },
      { title: "Progress", description: "Move graduates into alumni, internship, job, or venture-building pathways." },
    ],
    priorities: [
      "Improve learner retention and completion.",
      "Strengthen mentorship and graduate transition support.",
      "Increase girls' participation in all programme pathways.",
    ],
    stats: [
      { value: "3,000+", label: "Youth trained", description: "Across digital skills and employability pathways." },
      { value: "85%", label: "Progression rate", description: "Graduates moving into work, further learning, or enterprise." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Apply for Training", href: "/apply-for-training", description: "Learner-facing training hub." },
      { label: "Courses", href: "/apply-for-training/courses", description: "Current course catalogue and cohort entry points." },
    ],
    contact: { name: "Programmes Lead", role: "Department contact", email: "programmes@itforyouthghana.org" },
    ctas: [
      { label: "Explore training", href: "/apply-for-training" },
      { label: "Partner on delivery", href: "/partner-with-us" },
    ],
    featured: true,
    status: "published",
    order: 1,
  },
  {
    id: "training-curriculum",
    slug: "training-curriculum",
    eyebrow: "Learning design",
    title: "Training & Curriculum Department",
    summary: "Builds curriculum, facilitator guides, learning projects, and assessment standards.",
    description:
      "Training & Curriculum keeps learning practical, current, and accessible. It shapes course outcomes, lesson plans, project briefs, facilitator resources, assessments, and learner feedback loops.",
    intro:
      "The department makes sure each course is not just inspiring, but teachable, measurable, and connected to real digital work.",
    mission: "Create practical curriculum that helps learners build usable skills, credible portfolios, and workplace confidence.",
    heroImage: "/images/randomPictures/UXteacher_opt.jpg",
    icon: "📘",
    color: "#0152BE",
    responsibilities: [
      "Design and maintain course outcomes, modules, assessments, and capstone projects.",
      "Support facilitators with teaching guides, rubrics, and learner feedback tools.",
      "Review curriculum against employer, partner, and learner needs.",
      "Document learning standards so programmes can scale without losing quality.",
    ],
    services: [
      {
        title: "Curriculum design",
        body: "Course maps, module outcomes, lesson flows, and practical project briefs.",
        bullets: ["Learning outcomes", "Project briefs", "Assessment rubrics"],
      },
      {
        title: "Facilitator enablement",
        body: "Guides and resources that help trainers deliver consistently across cohorts.",
        bullets: ["Trainer notes", "Feedback tools", "Session templates"],
      },
    ],
    workflows: [
      { title: "Research", description: "Collect input from learners, employers, facilitators, and programme data." },
      { title: "Design", description: "Turn skills into modules, practice tasks, assessments, and portfolio work." },
      { title: "Improve", description: "Use learner outcomes and feedback to update the curriculum after each cohort." },
    ],
    priorities: [
      "Keep curriculum aligned with Ghana's digital employment and entrepreneurship needs.",
      "Make learning materials more accessible for different starting skill levels.",
      "Standardise portfolio assessment across cohorts.",
    ],
    stats: [
      { value: "12", label: "Week cohort model", description: "Structured learning journey from foundations to portfolio." },
      { value: "8", label: "Initiative pathways", description: "Curriculum support across public programme routes." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Course catalogue", href: "/apply-for-training/courses" },
      { label: "How training works", href: "/apply-for-training/how-it-works" },
    ],
    contact: { name: "Curriculum Lead", role: "Learning design contact", email: "training@itforyouthghana.org" },
    ctas: [{ label: "View courses", href: "/apply-for-training/courses" }],
    featured: true,
    status: "published",
    order: 2,
  },
  {
    id: "partnerships",
    slug: "partnerships",
    eyebrow: "External relations",
    title: "Partnerships Department",
    summary: "Builds relationships with schools, funders, employers, NGOs, government, and technology partners.",
    description:
      "Partnerships turns shared interest into practical collaboration. The department manages sponsorships, institutional relationships, graduate hiring routes, corporate training, and ecosystem coalitions.",
    intro:
      "Its work helps IT For Youth Ghana scale opportunity through organisations that can fund, host, hire, mentor, or amplify young talent.",
    mission: "Build high-trust partnerships that create resources, access, and real next steps for learners.",
    heroImage: "/images/randomPictures/studentpresenting.jpg",
    icon: "🤝",
    color: "#D70B52",
    responsibilities: [
      "Manage partner pipelines, proposals, relationship notes, and follow-up actions.",
      "Coordinate sponsorships, corporate training, graduate hiring, and staff volunteering.",
      "Translate organisational needs into partnership tracks with clear value and accountability.",
      "Work with impact and communications teams to report partnership outcomes.",
    ],
    services: [
      {
        title: "Sponsorship development",
        body: "Scholarship, device, and programme sponsorship packages for supporters and institutions.",
        bullets: ["Campaign briefs", "Partner reporting", "Recognition assets"],
      },
      {
        title: "Employer and graduate pathways",
        body: "Routes for companies to engage, mentor, interview, and hire prepared graduates.",
        bullets: ["Talent showcases", "Internships", "Hiring introductions"],
      },
    ],
    workflows: [
      { title: "Qualify", description: "Understand partner goals, audience, budget, timing, and expected outcomes." },
      { title: "Design", description: "Shape a collaboration model with roles, deliverables, and reporting needs." },
      { title: "Steward", description: "Maintain relationship health, evidence, renewal opportunities, and next steps." },
    ],
    priorities: [
      "Grow scholarship and device support for Cohort 8.",
      "Build stronger employer pathways for graduates.",
      "Package partnership offers with clearer outcomes and reporting.",
    ],
    stats: [
      { value: "5", label: "Partner tracks", description: "Education, government, NGOs, development, and technology partners." },
      { value: "8,500+", label: "Students reached", description: "School and community reach supported by partnerships." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Partner With Us", href: "/partner-with-us" },
      { label: "For Organisations", href: "/for-organisations" },
    ],
    contact: { name: "Partnerships Lead", role: "Partnership contact", email: "partnerships@itforyouthghana.org" },
    ctas: [
      { label: "Partner with us", href: "/partner-with-us" },
      { label: "Hire graduates", href: "/for-organisations/hire-graduates" },
    ],
    featured: true,
    status: "published",
    order: 3,
  },
  {
    id: "community-outreach",
    slug: "community-outreach",
    eyebrow: "Access",
    title: "Community Outreach Department",
    summary: "Connects schools and communities to digital skills opportunities, events, clubs, and learner recruitment.",
    description:
      "Community Outreach creates the first touchpoints that help young people see themselves in technology. It manages school visits, tech clubs, events, community activations, and rural access relationships.",
    intro:
      "The department helps turn awareness into applications, participation, and long-term community trust.",
    mission: "Bring digital opportunity closer to young people, especially girls and underserved communities.",
    heroImage: "/images/randomPictures/studentslistening.jpg",
    icon: "📣",
    color: "#1E72BA",
    responsibilities: [
      "Plan school and community activations.",
      "Coordinate tech clubs, outreach calendars, and local partner communication.",
      "Support recruitment for cohorts and targeted initiatives.",
      "Feed community insights back into programme design and partnerships.",
    ],
    services: [
      {
        title: "School outreach",
        body: "Talks, demos, clubs, and application guidance for schools and youth groups.",
        bullets: ["School visits", "Tech clubs", "Application support"],
      },
      {
        title: "Community activation",
        body: "Events and local engagement that reduce barriers to awareness and participation.",
        bullets: ["Community sessions", "Parent engagement", "Local partner coordination"],
      },
    ],
    workflows: [
      { title: "Map", description: "Identify schools, communities, and groups that can benefit from access." },
      { title: "Engage", description: "Run talks, sessions, clubs, and follow-up guidance." },
      { title: "Refer", description: "Connect interested learners to programmes, clubs, or partner opportunities." },
    ],
    priorities: [
      "Increase outreach outside central Accra.",
      "Improve follow-up from outreach event to application.",
      "Strengthen girls' participation through targeted engagement.",
    ],
    stats: [
      { value: "8,500+", label: "Students reached", description: "Through school outreach, clubs, and activations." },
      { value: "40%", label: "Female participation", description: "A key inclusion target across outreach and cohorts." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Community Outreach", href: "/what-we-do/community-outreach" },
      { label: "Tech Clubs", href: "/what-we-do/tech-clubs" },
    ],
    contact: { name: "Outreach Lead", role: "Community contact", email: "outreach@itforyouthghana.org" },
    ctas: [{ label: "Invite outreach team", href: "/contact" }],
    featured: false,
    status: "published",
    order: 4,
  },
  {
    id: "monitoring-evaluation-learning",
    slug: "monitoring-evaluation-learning",
    eyebrow: "Evidence",
    title: "Monitoring, Evaluation & Learning Department",
    summary: "Tracks outcomes, learner progression, reporting evidence, and learning loops for improvement.",
    description:
      "Monitoring, Evaluation & Learning keeps the organisation accountable to outcomes. It gathers evidence, analyses programme data, supports impact reporting, and helps teams improve decisions with real learning.",
    intro:
      "The department makes sure impact is measured carefully and translated into better programming, stronger reporting, and clearer partner trust.",
    mission: "Use evidence to improve learner outcomes, programme quality, and stakeholder accountability.",
    heroImage: "/images/randomPictures/studentsBackcoding.jpg",
    icon: "📊",
    color: "#0152BE",
    responsibilities: [
      "Define indicators, data collection rhythms, and reporting templates.",
      "Track learner progression, completion, placement, and alumni outcomes.",
      "Support impact reports, donor updates, and SDG-aligned evidence.",
      "Help teams use data for improvement, not only reporting.",
    ],
    services: [
      {
        title: "Impact measurement",
        body: "Indicators, dashboards, outcome tracking, and reporting evidence.",
        bullets: ["Learner outcomes", "Partner reports", "Impact briefs"],
      },
      {
        title: "Learning reviews",
        body: "Post-cohort reviews and practical recommendations for programme improvement.",
        bullets: ["Data quality", "Feedback loops", "Improvement actions"],
      },
    ],
    workflows: [
      { title: "Define", description: "Agree what success means for each initiative, cohort, or partnership." },
      { title: "Collect", description: "Capture data ethically and consistently across programme touchpoints." },
      { title: "Learn", description: "Turn findings into decisions, reports, and improvements." },
    ],
    priorities: [
      "Improve graduate outcome tracking.",
      "Standardise dashboards for programme and partnership reporting.",
      "Publish clearer impact evidence for supporters.",
    ],
    stats: [
      { value: "85%", label: "Progression tracked", description: "Core measure for work, learning, and enterprise outcomes." },
      { value: "4", label: "Evidence streams", description: "Training, outreach, partnerships, and alumni outcomes." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Impact Reports", href: "/our-impact/reports" },
      { label: "SDG Alignment", href: "/our-impact/sdgs" },
    ],
    contact: { name: "Impact Lead", role: "MEL contact", email: "impact@itforyouthghana.org" },
    ctas: [{ label: "View impact", href: "/our-impact/reports" }],
    featured: false,
    status: "published",
    order: 5,
  },
  {
    id: "operations",
    slug: "operations",
    eyebrow: "Systems",
    title: "Operations Department",
    summary: "Keeps finance, logistics, procurement, facilities, compliance, and delivery support running.",
    description:
      "Operations provides the systems that make delivery possible. The department manages logistics, finance coordination, procurement, facilities, vendor support, documentation, and compliance routines.",
    intro:
      "It helps programme teams focus on learners by making sure the practical details are planned, resourced, and documented.",
    mission: "Build reliable operating systems that support accountable, scalable programme delivery.",
    heroImage: "/images/randomPictures/studentgroupguys.jpg",
    icon: "⚙️",
    color: "#1A1A1A",
    responsibilities: [
      "Coordinate budgets, procurement, logistics, venues, equipment, and vendor relationships.",
      "Maintain operational documentation, policies, and internal routines.",
      "Support compliance, safeguarding processes, and risk tracking.",
      "Help teams plan resource needs before delivery bottlenecks appear.",
    ],
    services: [
      {
        title: "Delivery logistics",
        body: "Venue, materials, devices, connectivity, procurement, and supplier coordination.",
        bullets: ["Venues", "Devices", "Procurement"],
      },
      {
        title: "Operational controls",
        body: "Routine documentation, budgets, approvals, and internal accountability.",
        bullets: ["Budget support", "Documentation", "Compliance routines"],
      },
    ],
    workflows: [
      { title: "Prepare", description: "Confirm resources, budgets, spaces, vendors, and risk items." },
      { title: "Support", description: "Resolve delivery needs and document operational decisions." },
      { title: "Close", description: "Reconcile, archive, and share lessons for the next cycle." },
    ],
    priorities: [
      "Improve procurement and device tracking.",
      "Document repeatable operations for programme scale.",
      "Strengthen budget visibility across departments.",
    ],
    stats: [
      { value: "100%", label: "Delivery support", description: "Every cohort needs logistics, finance, and operational controls." },
      { value: "5", label: "Core systems", description: "Finance, procurement, facilities, compliance, and documentation." },
    ],
    teamMemberIds: [],
    resources: [{ label: "Contact operations", href: "/contact" }],
    contact: { name: "Operations Lead", role: "Operations contact", email: "operations@itforyouthghana.org" },
    ctas: [{ label: "Contact us", href: "/contact" }],
    featured: false,
    status: "published",
    order: 6,
  },
  {
    id: "communications",
    slug: "communications",
    eyebrow: "Storytelling",
    title: "Communications Department",
    summary: "Manages storytelling, campaigns, media, content, brand, newsletters, and public updates.",
    description:
      "Communications helps the public understand the work and why it matters. The department manages campaigns, stories, newsletters, media requests, brand consistency, and public-facing content.",
    intro:
      "It turns programme proof, learner journeys, and partner activity into clear stories that build trust and action.",
    mission: "Tell truthful, useful stories that help learners, partners, supporters, and communities engage with the mission.",
    heroImage: "/images/randomPictures/graduationspeaking.jpg",
    icon: "✍️",
    color: "#D70B52",
    responsibilities: [
      "Plan content calendars, campaigns, newsletters, and public updates.",
      "Support photography, consent, brand consistency, and story collection.",
      "Coordinate media, press, and public information requests.",
      "Work with programmes and impact teams to communicate evidence responsibly.",
    ],
    services: [
      {
        title: "Content and campaigns",
        body: "News, blogs, campaign pages, newsletters, and social storytelling.",
        bullets: ["News", "Newsletter", "Campaign copy"],
      },
      {
        title: "Brand and media",
        body: "Brand guidance, media assets, consent-aware storytelling, and public enquiries.",
        bullets: ["Brand assets", "Media requests", "Story collection"],
      },
    ],
    workflows: [
      { title: "Collect", description: "Gather stories, proof, photos, consent, and stakeholder context." },
      { title: "Shape", description: "Turn raw updates into clear audience-specific messages." },
      { title: "Publish", description: "Distribute content and watch for engagement, corrections, and follow-up." },
    ],
    priorities: [
      "Improve alumni and learner storytelling.",
      "Keep campaign pages current and conversion-ready.",
      "Build a stronger newsletter and media rhythm.",
    ],
    stats: [
      { value: "3", label: "Core audiences", description: "Learners, partners, and supporters." },
      { value: "Always", label: "Brand consistency", description: "Every public touchpoint should feel like ITFY." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "News & Updates", href: "/news-and-updates" },
      { label: "Contact media", href: "/contact" },
    ],
    contact: { name: "Communications Lead", role: "Media contact", email: "media@itforyouthghana.org" },
    ctas: [{ label: "Read updates", href: "/news-and-updates" }],
    featured: false,
    status: "published",
    order: 7,
  },
  {
    id: "people-governance",
    slug: "people-governance",
    eyebrow: "Stewardship",
    title: "People & Governance Department",
    summary: "Supports staff, mentors, volunteers, governance routines, policies, and organisational culture.",
    description:
      "People & Governance focuses on the humans and stewardship behind the mission. It supports staff, mentors, volunteers, board routines, policy hygiene, role clarity, and organisational culture.",
    intro:
      "The department helps the organisation grow with clarity, accountability, care, and strong governance habits.",
    mission: "Support people, culture, and governance systems that make the organisation trustworthy and sustainable.",
    heroImage: "/images/randomPictures/maingraduationpic.jpg",
    icon: "🧭",
    color: "#1E72BA",
    responsibilities: [
      "Support recruitment, onboarding, volunteer coordination, and role clarity.",
      "Maintain governance calendars, policy updates, and board/staff documentation.",
      "Coordinate people development, performance rhythms, and culture rituals.",
      "Keep safeguarding and accountability practices visible across the organisation.",
    ],
    services: [
      {
        title: "People systems",
        body: "Recruitment, onboarding, volunteer coordination, and staff support.",
        bullets: ["Recruitment", "Onboarding", "Volunteer coordination"],
      },
      {
        title: "Governance support",
        body: "Board routines, policy updates, documentation, and accountability practices.",
        bullets: ["Policies", "Board routines", "Safeguarding"],
      },
    ],
    workflows: [
      { title: "Clarify", description: "Define roles, expectations, policies, and decision rights." },
      { title: "Support", description: "Help people do good work with the right tools and feedback." },
      { title: "Review", description: "Keep governance, safeguarding, and organisational routines current." },
    ],
    priorities: [
      "Improve volunteer and mentor onboarding.",
      "Strengthen role documentation and governance calendars.",
      "Support a healthy, accountable staff and mentor culture.",
    ],
    stats: [
      { value: "1", label: "Shared mission", description: "Every team aligned around youth digital opportunity." },
      { value: "Many", label: "Contributors", description: "Staff, mentors, board, volunteers, and partners." },
    ],
    teamMemberIds: [],
    resources: [
      { label: "Team", href: "/who-we-are/team" },
      { label: "Careers", href: "/who-we-are/careers" },
    ],
    contact: { name: "People Lead", role: "People and governance contact", email: "people@itforyouthghana.org" },
    ctas: [{ label: "Join our team", href: "/who-we-are/careers" }],
    featured: false,
    status: "published",
    order: 8,
  },
];

export const featuredStory: FeaturedStoryContent = {
  id: "story-belinda",
  label: "Graduate story",
  headline: "From first steps to building production-ready products in six months",
  quote:
    "IT For Youth Ghana gave me structure, community, and the confidence to pursue opportunities I once thought were out of reach.",
  name: "Belinda A.",
  role: "Frontend Developer",
  programme: "Youth Tech Academy, Cohort 6",
  backgroundImage: "/images/randomPictures/UX4.jpg",
  videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  primaryCtaLabel: "Watch her story",
  secondaryCta: { label: "Read more graduate stories", href: "/our-impact/testimonials" },
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The academy gave me structure and accountability I had never experienced. I moved from not knowing what a portfolio was to presenting real projects to mentors. Six months after graduating, I started as a junior developer in Accra.",
    name: "Ama Kofi",
    role: "Junior Developer",
    programme: "Youth Tech Academy",
    year: "Cohort 6",
    avatar: "/images/people/Belinda.jpg",
    initials: "AK",
  },
  {
    id: "t2",
    quote:
      "Before Girls in Tech, I was curious but unsure whether tech was for someone like me. The mentorship and cohort community made it feel achievable. I now work as a UX designer and mentor the next group of young women coming through the programme.",
    name: "Efua Asante",
    role: "UX Designer",
    programme: "Girls in Tech",
    year: "Cohort 5",
    avatar: "/images/people/elisabeth.jpg",
    initials: "EA",
  },
  {
    id: "t3",
    quote:
      "We partnered with IT For Youth Ghana to run tech clubs in our school. The consistency of the sessions transformed how our students see technology. Several have now joined the academy, and one is already interning with a local tech company.",
    name: "Mr. Isaac Mensah",
    role: "Head of ICT",
    programme: "Tech Clubs & Community Outreach",
    year: "School partner 2025",
    avatar: "/images/people/mensah.jpg",
    initials: "IM",
  },
];

// ─── Partners ─────────────────────────────────────────────────────────────────
// Add `logo: "/images/partners/name.svg"` once assets are available.

export const partners: Partner[] = [
  { id: "p1", name: "Google.org", logo: "/images/partnerorga/Download.jpg" },
  { id: "p2", name: "UNICEF Ghana", logo: "/images/partnerorga/Download (1).jpg" },
  { id: "p3", name: "GIZ", logo: "/images/partnerorga/Download (2).jpg" },
  { id: "p4", name: "Mastercard Foundation", logo: "/images/partnerorga/Download (3).jpg" },
  { id: "p5", name: "Vodafone Ghana", logo: "/images/partnerorga/Download (4).jpg" },
  { id: "p6", name: "Microsoft", logo: "/images/partnerorga/Download (5).jpg" },
  { id: "p7", name: "Tony Elumelu Foundation", logo: "/images/partnerorga/Download (6).jpg" },
  { id: "p8", name: "USAID" },
];

export const joinCtaCards: JoinCtaCard[] = [
  {
    id: "join-students",
    image: "/images/randomPictures/UXcours.jpg",
    imageAlt: "A learner working through a design exercise at a laptop",
    eyebrow: "For learners",
    title: "Apply for training",
    description: "Review eligibility, browse current courses, and take the next step from interest to enrolment with clear guidance.",
    href: "/apply-for-training",
    buttonLabel: "Start your application",
    icon: "students",
  },
  {
    id: "join-organisations",
    image: "/images/randomPictures/studentpresenting.jpg",
    imageAlt: "A graduate presenting project work to an audience",
    eyebrow: "For organisations",
    title: "Partner with us",
    description: "Explore sponsorship, graduate hiring, staff volunteering, and custom corporate training designed for mission-aligned partners.",
    href: "/for-organisations",
    buttonLabel: "Explore partnership routes",
    icon: "organisations",
  },
  {
    id: "join-volunteer",
    image: "/images/randomPictures/petertalkingtostudentscoloful.jpg",
    imageAlt: "A volunteer mentor talking with a small group of learners",
    eyebrow: "For volunteers",
    title: "Contribute your expertise",
    description: "Mentor learners, review projects, deliver guest sessions, or support programme delivery where your skills can create lasting impact.",
    href: "/partner-with-us",
    buttonLabel: "See how to get involved",
    icon: "volunteer",
  },
];

export const newsletterSignupContent: NewsletterSignupContent = {
  eyebrow: "Mailing list",
  heading: "Stay close to the work as new cohorts, stories, and opportunities go live",
  description:
    "Join the mailing list for programme openings, impact updates, upcoming events, and stories from the learners and partners shaping the mission.",
  privacyNote:
    "We’ll only send relevant updates, and every email includes a simple unsubscribe link.",
  interest: "homepage",
  active: true,
};

// ─── Events ───────────────────────────────────────────────────────────────────

export const upcomingEvents: EventItem[] = [
  {
    id: "ev1",
    date: "12 Jun 2026",
    month: "Jun",
    day: "12",
    title: "Cohort 8 Open Day — Accra",
    location: "ITFY Learning Centre, Accra",
    type: "Information Session",
    href: "/news-and-updates/news",
    featured: true,
  },
  {
    id: "ev2",
    date: "26 Jun 2026",
    month: "Jun",
    day: "26",
    title: "Tech Sisters Mentorship Kickoff",
    location: "Online (Zoom)",
    type: "Webinar",
    href: "/news-and-updates/news",
  },
  {
    id: "ev3",
    date: "18 Jul 2026",
    month: "Jul",
    day: "18",
    title: "Junior Coders Regional Showcase",
    location: "Kumasi, Ghana",
    type: "Student Showcase",
    href: "/news-and-updates/news",
  },
  {
    id: "ev4",
    date: "05 Sep 2026",
    month: "Sep",
    day: "05",
    title: "Cohort 8 Graduation Ceremony",
    location: "National Theatre, Accra",
    type: "Graduation",
    href: "/news-and-updates/news",
  },
];

// ─── Public hubs (navigation cards) ──────────────────────────────────────────

export const publicHubs: RouteCard[] = [
  {
    href: "/who-we-are",
    eyebrow: "About us",
    title: "Who We Are",
    description:
      "A Ghanaian organisation delivering cohort training, school clubs, and strategic partnerships. 3,000+ youth trained. 85% progression into work, further study, or enterprise within six months.",
  },
  {
    href: "/what-we-do",
    eyebrow: "Programmes",
    title: "What We Do",
    description:
      "Eight connected initiatives: Youth Tech Academy, Girls in Tech, Tech Clubs, Entrepreneurship Hub, Rural Tech Connect, Community Outreach, Corporate Training, and Advocacy — all designed for measurable progression.",
  },
  {
    href: "/apply-for-training",
    eyebrow: "Start here",
    title: "Apply for Training",
    description:
      "12-week cohort programmes in Accra. No prior experience required for beginner tracks. Scholarships, devices, and mentorship available. 85% of graduates progress into opportunity within six months.",
  },
  {
    href: "/for-organisations",
    eyebrow: "Collaborate",
    title: "For Organisations",
    description:
      "Corporate training, cohort sponsorships, staff volunteering, and direct access to job-ready graduates. Partners include Google.org, UNICEF, GIZ, and Mastercard Foundation.",
  },
  {
    href: "/partner-with-us",
    eyebrow: "Partnerships",
    title: "Partner With Us",
    description:
      "Five partnership tracks for schools, government, NGOs, international development, and technology companies. 8,500+ students reached through school and community routes.",
  },
  {
    href: "/our-impact/reports",
    eyebrow: "Proof",
    title: "Our Impact",
    description:
      "Cohort outcomes, progression data, graduate stories, and SDG alignment. We publish what happens after training — not just participation numbers.",
  },
  {
    href: "/news-and-updates",
    eyebrow: "Stories",
    title: "News & Updates",
    description:
      "Cohort announcements, graduate wins, partnership updates, and honest reflections on building sustainable digital opportunity for young Ghanaians.",
  },
  {
    href: "/contact",
    eyebrow: "Talk to us",
    title: "Contact Us",
    description:
      "Reach the team in Accra for training enquiries, partnerships, sponsorships, or media. Clear response times and office hours.",
  },
];

// ─── What We Do overview content ───────────────────────────────────────────

export const whatWeDoOverviewContent: WhatWeDoOverviewContent = {
  eyebrow: "What we do",
  title: "Eight connected initiatives expanding youth digital opportunity in Ghana",
  description:
    "IT For Youth Ghana runs a deliberate ecosystem: access, training, and transition work that moves young Ghanaians — especially young women and learners from underserved communities — from first exposure to measurable progression. 3,000+ trained. 85% progress into work, study, or enterprise within six months.",
  heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=85",
  heroStats: [
    {
      label: "Live initiative routes",
      description: "Dedicated public pages with galleries, testimonials, and clear next steps.",
    },
    {
      label: "Seeded gallery images",
      description: "Local visuals already mapped into every initiative experience.",
    },
    {
      label: "Initiative testimonials",
      description: "Learner, facilitator, and partner voices across the full portfolio.",
    },
    {
      label: "Partner references",
      description: "Organisations and routes that sustain and scale this work.",
    },
  ],
  overviewSectionEyebrow: "Overview",
  overviewSectionTitle: "Designed as one connected system",
  overviewSectionDescription:
    "We do not treat access, training, entrepreneurship, and advocacy as separate silos. The strongest outcomes happen when these pieces reinforce each other — turning curiosity into capability and capability into lasting opportunity.",
  ecosystemCards: [
    {
      eyebrow: "Access",
      title: "We widen the front door into digital opportunity",
      description:
        "Community outreach, school clubs, and regional activation help more young people — especially girls and learners outside Accra — encounter technology in ways that feel relevant and reachable.",
    },
    {
      eyebrow: "Training",
      title: "We turn curiosity into practical capability",
      description:
        "Structured cohort pathways, challenge formats, and focused inclusion initiatives move participants from first contact to real competence, portfolios, and confidence.",
    },
    {
      eyebrow: "Transition",
      title: "We connect learning to longer-term outcomes",
      description:
        "Entrepreneurship support, employability work, partner routes, and advocacy carry the impact of training into communities, institutions, and sustainable careers.",
    },
  ],
  initiativesSectionEyebrow: "Initiatives",
  initiativesSectionTitle: "Explore each initiative in more depth",
  initiativesSectionDescription:
    "Every initiative page has a dedicated structure: mission, objectives, how it works, impact stats, galleries, testimonials, FAQs, and partner references.",
  gallerySectionEyebrow: "In action",
  gallerySectionTitle: "See what learning looks like on the ground",
  gallerySectionDescription:
    "From practical sessions to community outreach, these moments show young people learning together, building confidence, and putting digital skills to work.",
  galleryItems: [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85",
      title: "Peer learning",
      description: "Young adults gathered around a laptop, working a problem through together rather than alone.",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85",
      title: "Mentorship",
      description: "A mentor and a learner reviewing work side by side, at the point where feedback is most useful.",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1600&q=85",
      title: "Building in teams",
      description: "Developers collaborating around computers, splitting a build between them.",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=85",
      title: "Facilitated practice",
      description: "A facilitator leading a session in front of a group, holding the room through an exercise.",
    },
  ],
  pathwaysSectionEyebrow: "Pathways",
  pathwaysSectionTitle: "From first exposure to longer-term opportunity",
  pathwaysSectionDescription:
    "The strongest version of this work helps a learner move forward over time, not just attend one moment. These pathways show how the portfolio supports that progression.",
  pathwayCards: [
    {
      title: "Discover",
      description:
        "Community Outreach, Rural Tech Connect, and Tech Clubs bring more learners into the ecosystem early and repeatedly — especially in schools and underserved communities.",
      initiativeSlugs: ["community-outreach", "rural-tech-connect", "tech-clubs"],
    },
    {
      title: "Develop",
      description:
        "Girls in Tech and Youth Tech Academy create the confidence, discipline, and practical skills needed for deeper progress and 85% progression outcomes.",
      initiativeSlugs: ["girls-in-tech", "youth-academy"],
    },
    {
      title: "Apply",
      description:
        "Code Impact Challenge and Entrepreneurship Hub help learners test their skills in public, collaborative, and venture-facing formats with real stakes.",
      initiativeSlugs: ["code-impact-challenge", "entrepreneurship-hub"],
    },
    {
      title: "Amplify",
      description:
        "Advocacy and partner-facing work ensure the wider ecosystem keeps making youth digital opportunity more possible at scale.",
      initiativeSlugs: ["advocacy"],
    },
  ],
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle: "Choose the right entry point into the work",
  nextStepsSectionDescription:
    "Whether you are a learner, partner, or supporter, the next move should feel clear from here.",
  nextSteps: [
    {
      href: "/apply-for-training",
      eyebrow: "Apply",
      title: "Apply for Training",
      description:
        "Move from exploration into the right 12-week cohort route for your stage, interests, and goals.",
    },
    {
      href: "/partner-with-us",
      eyebrow: "Partner",
      title: "Partner With Us",
      description:
        "Support delivery, mentoring, sponsorship, and expansion across the initiative ecosystem.",
    },
    {
      href: "/our-impact/reports",
      eyebrow: "Impact",
      title: "See Our Impact",
      description:
        "Explore how the initiative portfolio connects to measurable outcomes and wider mission credibility.",
    },
  ],
};

// ─── Header CTAs ────────────────────────────────────────────────────────────

export const headerCtas = {
  primary: { label: "Apply for training", href: "/apply-for-training/courses" },
  secondary: { label: "Donate", href: "/donate" },
};

// ─── Breadcrumb labels ──────────────────────────────────────────────────────

export const breadcrumbs = {
  home: "Home",
  apply: {
    root: "Apply for Training",
    courses: "Courses",
    howItWorks: "How It Works",
    whoCanApply: "Who Can Apply",
  },
  impact: {
    root: "Our Impact",
    reports: "Impact Reports",
    testimonials: "Testimonials",
    sdgs: "UN SDGs",
  },
  whatWeDo: { root: "What We Do" },
  whoWeAre: { root: "Who We Are" },
  organisations: { root: "For Organisations" },
  partnerships: { root: "Partner With Us" },
  contact: { root: "Contact" },
} as const;

export const homepageSections: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  variant?: "navy" | "gold" | "default";
  items?: string[];
  cta?: { label: string; href: string };
}[] = [];
