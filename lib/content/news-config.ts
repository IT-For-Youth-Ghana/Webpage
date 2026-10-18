import type {
  ArticleCategory,
  ArticleCategoryContent,
  ArticleSeed,
  NewsHubContent,
} from "@/types/content";

export const articleCategories: ArticleCategory[] = ["news", "blogs"];

export const articleCategoryLabels: Record<ArticleCategory, string> = {
  news: "News",
  blogs: "Blogs",
};

export const newsHubContent: NewsHubContent = {
  eyebrow: "News & updates",
  title: "Follow the programmes, people, and ideas moving the mission forward",
  description:
    "A clearer editorial home for announcements, programme notes, field stories, blog essays, events, and press-facing updates from IT For Youth Ghana.",
  heroImage: "/images/randomPictures/studentpresenting.jpg",
  stats: [
    {
      value: "2",
      label: "Publishing lanes",
      description: "Fast updates through news and deeper reflections through blogs.",
      icon: "01",
    },
    {
      value: "8",
      label: "Seed articles",
      description: "Representative content is ready for the future CMS handoff.",
      icon: "02",
    },
    {
      value: "4",
      label: "Content labels",
      description: "News, blog, event, and press badges are supported from day one.",
      icon: "03",
    },
  ],
  editorialPillars: [
    {
      title: "Programme momentum",
      body:
        "Short updates that help learners, parents, partners, and supporters understand what is open, changing, or coming next.",
      bullets: [
        "Cohort announcements and application windows",
        "Event notices and programme milestones",
        "Partnership activity with a public-facing outcome",
      ],
    },
    {
      title: "Human evidence",
      body:
        "Stories and reflections that make the work feel specific, grounded, and accountable to the young people it exists to serve.",
      bullets: [
        "Learner progression and confidence stories",
        "School, mentor, and partner perspectives",
        "Field notes from clubs, outreach, and training spaces",
      ],
    },
    {
      title: "Thought leadership",
      body:
        "Longer-form writing for people who want to understand youth digital access, skills pathways, partnership design, and ecosystem gaps.",
      bullets: [
        "Practical arguments from delivery experience",
        "Guides for partners and institutions",
        "Reflections that connect the mission to broader SDG outcomes",
      ],
    },
  ],
  routeCards: [
    {
      href: "/news-and-updates/news",
      eyebrow: "Updates",
      title: "News",
      description:
        "Programme announcements, events, press notes, and time-sensitive updates from the ITFY ecosystem.",
    },
    {
      href: "/news-and-updates/blogs",
      eyebrow: "Reflections",
      title: "Blogs",
      description:
        "Longer-form ideas, field notes, and practical reflections on youth digital opportunity.",
    },
  ],
  heroCtas: [
    { label: "Read latest news", href: "/news-and-updates/news" },
    { label: "Explore blogs", href: "/news-and-updates/blogs" },
  ],
  featuredSectionEyebrow: "Featured",
  featuredSectionTitle: "A living front page for the latest mission signals",
  featuredSectionDescription: "Follow selected stories, announcements, and programme moments from across IT For Youth Ghana.",
  browseSectionEyebrow: "Browse",
  browseSectionTitle: "Choose the kind of update you need",
  browseSectionDescription: "News stays practical and current. Blogs give the team room to explain thinking, context, and lessons from the field.",
  editorialSectionEyebrow: "Editorial logic",
  editorialSectionTitle: "What the news system is designed to carry",
  editorialSectionDescription: "The content model supports quick updates, deeper analysis, and proof-led storytelling.",
  latestSectionEyebrow: "Latest",
  latestSectionTitle: "Recently published",
  latestSectionDescription: "A quick view of the newest published content across both news and blog routes.",
  subscribeSectionEyebrow: "Stay close",
  subscribeSectionTitle: "Get cohort windows, stories, and partner opportunities as they go live",
  subscribeSectionDescription: "Stay connected to new opportunities, programme milestones, and stories from the ITFY community.",
  subscribeCtas: [
    { label: "Contact the team", href: "/contact" },
    { label: "Apply for training", href: "/apply-for-training" },
  ],
};

export const articleCategoryContent: Record<ArticleCategory, ArticleCategoryContent> = {
  news: {
    category: "news",
    eyebrow: "News",
    title: "Programme updates, events, and public announcements",
    description:
      "Follow the most time-sensitive movement around cohorts, partnerships, community events, and public-facing milestones.",
    heroImage: "/images/randomPictures/graduationspeaking.jpg",
    emptyState:
      "No news articles are published yet. Once the CMS lands, published updates will appear here automatically.",
    heroCtaLabel: "Back to hub",
    leadSectionEyebrow: "Lead article",
    leadSectionTitle: "Start with the most recent published story",
    leadSectionDescription: "The newest published update appears first so important information is easy to find.",
    archiveSectionEyebrow: "Archive",
    archiveSectionTitle: "More news",
    archiveSectionDescription: "Browse earlier published updates from across the ITFY community.",
    topicsSectionEyebrow: "Topics",
    topicsSectionTitle: "Browse by signal",
    topicsSectionDescription: "These topics show the themes covered across the published collection.",
    latestSignalEyebrow: "Latest signal",
    latestSignalCtaLabel: "Read the lead article",
  },
  blogs: {
    category: "blogs",
    eyebrow: "Blogs",
    title: "Field notes and ideas from the youth digital skills ecosystem",
    description:
      "Read longer-form reflections on programme design, learner confidence, partnership building, and the systems around youth opportunity.",
    heroImage: "/images/randomPictures/mireiotalking.jpg",
    emptyState:
      "No blog articles are published yet. Future reflections and field notes will appear here automatically.",
    heroCtaLabel: "Back to hub",
    leadSectionEyebrow: "Lead article",
    leadSectionTitle: "Start with the most recent published story",
    leadSectionDescription: "The newest published reflection appears first so readers can begin with the latest thinking.",
    archiveSectionEyebrow: "Archive",
    archiveSectionTitle: "More blogs",
    archiveSectionDescription: "Browse earlier reflections, field notes, and practical ideas from the ITFY ecosystem.",
    topicsSectionEyebrow: "Topics",
    topicsSectionTitle: "Browse by signal",
    topicsSectionDescription: "These topics show the themes covered across the published collection.",
    latestSignalEyebrow: "Latest signal",
    latestSignalCtaLabel: "Read the lead article",
  },
};

export const articles: ArticleSeed[] = [
  {
    id: "article_cohort_8_scholarship_campaign",
    slug: "cohort-8-scholarship-campaign",
    category: "news",
    status: "published",
    type: "News",
    title: "ITFY launches a scholarship campaign for Cohort 8 applicants",
    excerpt:
      "The new campaign focuses on tuition support, devices, and mentoring so more learners can enter Cohort 8 without cost becoming a blocker.",
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    coverImage: "/images/randomPictures/UXteacher.png",
    coverAlt: "A facilitator teaching digital design skills to a youth cohort",
    tags: ["Scholarships", "Training", "Cohort 8"],
    author: {
      name: "IT For Youth Ghana",
      role: "Programme Team",
      avatar: "/images/logo/logo_small.jpg",
    },
    featured: true,
    readTimeMinutes: 4,
    seo: {
      title: "ITFY launches Cohort 8 scholarship campaign",
      description:
        "Scholarship support for IT For Youth Ghana Cohort 8 applicants, including tuition, devices, and mentoring.",
      ogImage: "/images/randomPictures/UXteacher.png",
    },
    content: [
      "The Cohort 8 scholarship campaign is designed to remove the barriers that keep talented young people from starting their digital journey.",
      "This phase of fundraising supports tuition waivers, learning devices, and wraparound mentorship for participants who are ready to take the next step.",
      "The campaign also gives partners and donors a clearer way to connect their support directly to learner outcomes.",
    ],
    contentHtml:
      "<p>The Cohort 8 scholarship campaign is designed to remove the barriers that keep talented young people from starting their digital journey.</p><p>This phase of fundraising supports tuition waivers, learning devices, and wraparound mentorship for participants who are ready to take the next step.</p><h2>Why this matters</h2><p>Training access is strongest when cost, device access, transport pressure, and mentoring needs are considered together. The campaign gives donors and partners a practical way to support the whole learner pathway.</p><ul><li>Tuition support for accepted learners who need fee relief.</li><li>Device support for learners who cannot practise consistently at home.</li><li>Mentorship support so learners have encouragement beyond the classroom.</li></ul><blockquote>The goal is not only to open seats. It is to help learners stay, practise, and complete with confidence.</blockquote><p>The campaign also gives partners and donors a clearer way to connect their support directly to learner outcomes.</p>",
  },
  {
    id: "article_community_tech_clubs_expansion",
    slug: "community-tech-clubs-expansion",
    category: "news",
    status: "published",
    type: "News",
    title: "Community tech clubs are expanding into more schools this term",
    excerpt:
      "A new rollout plan is helping ITFY strengthen recurring access points for students who need more than one-off exposure to technology.",
    publishedAt: "2026-05-13",
    updatedAt: "2026-05-13",
    coverImage: "/images/randomPictures/studentsblueclothing.jpg",
    coverAlt: "Students in blue uniforms gathered for a school-based digital learning session",
    tags: ["Tech Clubs", "Schools", "Community"],
    author: {
      name: "ITFY Field Team",
      role: "Community Programmes",
      avatar: "/images/logo/logo_small.jpg",
    },
    featured: true,
    readTimeMinutes: 3,
    seo: {
      title: "Community tech clubs expand into more schools",
      description:
        "ITFY is strengthening recurring access points for students through school-based community tech clubs.",
      ogImage: "/images/randomPictures/studentsblueclothing.jpg",
    },
    content: [
      "The next expansion of school-based tech clubs is focused on consistency, not just reach.",
      "By working with school leaders and local facilitators, the programme is building spaces where students can keep practicing over time.",
      "That recurring engagement is a key part of turning interest into confidence and confidence into pathway decisions.",
    ],
    contentHtml:
      "<p>The next expansion of school-based tech clubs is focused on consistency, not just reach.</p><p>By working with school leaders and local facilitators, the programme is building spaces where students can keep practicing over time.</p><h2>What changes in this phase</h2><p>The club model creates a bridge between first exposure and deeper training. Students can repeat, ask questions, support each other, and begin to see digital skills as something they can build into their everyday lives.</p><ul><li>More regular club sessions inside partner schools.</li><li>Facilitator support for repeatable learning activities.</li><li>Clearer pathways from clubs into training, challenges, and mentorship.</li></ul><p>That recurring engagement is a key part of turning interest into confidence and confidence into pathway decisions.</p>",
  },
  {
    id: "article_foundation_rebuild_live",
    slug: "rebuild-foundation-update",
    category: "news",
    status: "published",
    type: "Press",
    title: "The website rebuild foundation is now live",
    excerpt:
      "The new Next.js structure is in place with aligned navigation, homepage scaffolding, and stronger route foundations.",
    publishedAt: "2026-05-02",
    updatedAt: "2026-05-02",
    coverImage: "/images/randomPictures/maingraduationpic.jpg",
    coverAlt: "A graduation gathering representing the refreshed ITFY public platform",
    tags: ["Platform", "Website", "Rebuild"],
    author: {
      name: "ITFY Digital Team",
      role: "Website Rebuild",
      avatar: "/images/logo/logo_small.jpg",
    },
    readTimeMinutes: 4,
    seo: {
      title: "ITFY website rebuild foundation is live",
      description:
        "The IT For Youth Ghana website rebuild now has aligned navigation, App Router foundations, and route scaffolding.",
      ogImage: "/images/randomPictures/maingraduationpic.jpg",
    },
    content: [
      "The IT For Youth Ghana website rebuild has moved into an active implementation phase.",
      "This foundation pass establishes the public information architecture, the shared layout system, and the top-of-homepage experience.",
      "Upcoming passes will deepen the homepage, expand route-specific storytelling, and connect the future CMS.",
    ],
    contentHtml:
      "<p>The IT For Youth Ghana website rebuild has moved into an active implementation phase.</p><p>This foundation pass establishes the public information architecture, the shared layout system, and the top-of-homepage experience.</p><h2>What the foundation enables</h2><p>The new structure gives the organisation a stronger place to publish stories, explain programme routes, and support learners, partners, donors, and staff with clearer paths through the site.</p><ul><li>A single Next.js App Router project.</li><li>Shared design tokens and public layouts.</li><li>Stable route structures for future CMS content.</li></ul><p>Upcoming passes will deepen the homepage, expand route-specific storytelling, and connect the future CMS.</p>",
  },
  {
    id: "article_digital_skills_fair_preview",
    slug: "digital-skills-fair-preview",
    category: "news",
    status: "published",
    type: "Event",
    title: "Digital Skills Fair will connect learners, mentors, and partner organisations",
    excerpt:
      "The upcoming fair is being shaped as a practical discovery space for young people exploring digital skills pathways.",
    publishedAt: "2026-04-28",
    updatedAt: "2026-04-28",
    coverImage: "/images/randomPictures/studentpresentin.jpg",
    coverAlt: "Students presenting their work during a practical learning event",
    tags: ["Events", "Mentorship", "Learners"],
    author: {
      name: "ITFY Events Team",
      role: "Community Engagement",
      avatar: "/images/logo/logo_small.jpg",
    },
    readTimeMinutes: 3,
    seo: {
      title: "Digital Skills Fair preview",
      description:
        "A practical discovery space for learners, mentors, and partner organisations in the ITFY community.",
      ogImage: "/images/randomPictures/studentpresentin.jpg",
    },
    content: [
      "The Digital Skills Fair is being planned as a hands-on route into discovery, mentorship, and practical confidence.",
      "The event format will bring learners closer to real tools, real pathways, and people who can help them understand what the next step looks like.",
      "Partners will also be able to see where support can translate into stronger learner outcomes.",
    ],
    contentHtml:
      "<p>The Digital Skills Fair is being planned as a hands-on route into discovery, mentorship, and practical confidence.</p><p>The event format will bring learners closer to real tools, real pathways, and people who can help them understand what the next step looks like.</p><h2>What learners can expect</h2><ul><li>Short practical demonstrations across digital skills areas.</li><li>Mentor conversations about learning routes and career confidence.</li><li>Connections into applications, clubs, and future challenges.</li></ul><p>Partners will also be able to see where support can translate into stronger learner outcomes.</p>",
  },
  {
    id: "article_homepage_clarity",
    slug: "why-homepage-clarity-matters",
    category: "blogs",
    status: "published",
    type: "Blog",
    title: "Why homepage clarity matters for growing mission-driven teams",
    excerpt:
      "A stronger homepage sequence makes trust, urgency, and discovery easier for learners, funders, and partners.",
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    coverImage: "/images/randomPictures/mireiotalking.jpg",
    coverAlt: "A facilitator speaking with learners during a programme session",
    tags: ["Storytelling", "Website", "Strategy"],
    author: {
      name: "ITFY Digital Team",
      role: "Website Rebuild",
      avatar: "/images/logo/logo_small.jpg",
    },
    featured: true,
    readTimeMinutes: 5,
    seo: {
      title: "Why homepage clarity matters for mission-driven teams",
      description:
        "How a clearer homepage sequence can help learners, partners, funders, and supporters understand an NGO faster.",
      ogImage: "/images/randomPictures/mireiotalking.jpg",
    },
    content: [
      "For a growing NGO, the homepage has to do more than look polished. It has to guide multiple audiences quickly and clearly.",
      "That is why this rebuild gives special attention to the opening sequence: announcement, hero, ticker, and impact proof.",
      "That stack helps users understand the mission, the urgency, and the pathways available to them in just a few seconds.",
    ],
    contentHtml:
      "<p>For a growing NGO, the homepage has to do more than look polished. It has to guide multiple audiences quickly and clearly.</p><p>That is why this rebuild gives special attention to the opening sequence: announcement, hero, ticker, and impact proof.</p><h2>Clarity is a service</h2><p>Different audiences arrive with different questions. A learner wants to know how to apply. A partner wants to know whether the organisation is credible. A donor wants to understand why support matters now. The homepage has to respect all of those needs without becoming cluttered.</p><blockquote>Good structure makes generosity, trust, and action easier.</blockquote><p>That stack helps users understand the mission, the urgency, and the pathways available to them in just a few seconds.</p>",
  },
  {
    id: "article_partnership_storytelling",
    slug: "why-partnership-storytelling-builds-trust",
    category: "blogs",
    status: "published",
    type: "Blog",
    title: "Why partnership storytelling matters when an NGO is scaling",
    excerpt:
      "Partners do not just need a donation page. They need evidence, clarity, and a fast way to see where they fit in the mission.",
    publishedAt: "2026-04-17",
    updatedAt: "2026-04-17",
    coverImage: "/images/randomPictures/groupworkstudents.jpg",
    coverAlt: "Learners collaborating during group work",
    tags: ["Partnerships", "Trust", "Impact"],
    author: {
      name: "ITFY Partnerships",
      role: "Collaboration Team",
      avatar: "/images/logo/logo_small.jpg",
    },
    readTimeMinutes: 4,
    seo: {
      title: "Why partnership storytelling builds trust",
      description:
        "Why partners need evidence, clarity, and practical routes into an NGO mission before a conversation begins.",
      ogImage: "/images/randomPictures/groupworkstudents.jpg",
    },
    content: [
      "Good partnership storytelling creates confidence before a meeting ever happens.",
      "It helps potential collaborators understand what the organisation already does well and where support can amplify that work.",
      "That is why the rebuild makes room for partner-facing proof, clearer calls to action, and better visibility into programme outcomes.",
    ],
    contentHtml:
      "<p>Good partnership storytelling creates confidence before a meeting ever happens.</p><p>It helps potential collaborators understand what the organisation already does well and where support can amplify that work.</p><h2>What partners are really looking for</h2><ul><li>Evidence that the work is active and grounded.</li><li>A clear route that matches their institution type.</li><li>Examples of what collaboration could look like in practice.</li></ul><p>That is why the rebuild makes room for partner-facing proof, clearer calls to action, and better visibility into programme outcomes.</p>",
  },
  {
    id: "article_after_first_workshop",
    slug: "what-young-people-need-after-the-first-workshop",
    category: "blogs",
    status: "published",
    type: "Blog",
    title: "What young people need after the first digital skills workshop",
    excerpt:
      "The first workshop can spark confidence, but recurring practice and guided next steps turn that spark into a pathway.",
    publishedAt: "2026-04-10",
    updatedAt: "2026-04-10",
    coverImage: "/images/randomPictures/studentsBackcoding.jpg",
    coverAlt: "Students practising coding and digital skills together",
    tags: ["Digital Skills", "Practice", "Youth Pathways"],
    author: {
      name: "ITFY Learning Team",
      role: "Training Design",
      avatar: "/images/logo/logo_small.jpg",
    },
    readTimeMinutes: 6,
    seo: {
      title: "What young people need after a digital skills workshop",
      description:
        "Why recurring practice, mentoring, and visible next steps matter after first exposure to technology.",
      ogImage: "/images/randomPictures/studentsBackcoding.jpg",
    },
    content: [
      "A first workshop is powerful because it changes what a young person believes might be possible.",
      "But confidence needs repetition. Learners need a place to practise, ask questions, make mistakes, and see progress.",
      "The strongest programme routes treat exposure as the beginning of a pathway, not the end of the intervention.",
    ],
    contentHtml:
      "<p>A first workshop is powerful because it changes what a young person believes might be possible.</p><p>But confidence needs repetition. Learners need a place to practise, ask questions, make mistakes, and see progress.</p><h2>The follow-through matters</h2><p>Without next steps, interest can fade quickly. With clubs, training routes, challenges, and mentors, a young person can begin to translate curiosity into skill and confidence.</p><ul><li>Repeatable practice spaces make learning less intimidating.</li><li>Mentors help learners understand what progress looks like.</li><li>Visible application routes turn interest into action.</li></ul><p>The strongest programme routes treat exposure as the beginning of a pathway, not the end of the intervention.</p>",
  },
  {
    id: "article_mentor_lab_note",
    slug: "mentor-labs-and-practical-confidence",
    category: "blogs",
    status: "published",
    type: "Blog",
    title: "Mentor labs and the quiet work of building practical confidence",
    excerpt:
      "Mentorship becomes more useful when young people can connect encouragement to specific practice, feedback, and next actions.",
    publishedAt: "2026-04-03",
    updatedAt: "2026-04-03",
    coverImage: "/images/randomPictures/uXstudents.jpg",
    coverAlt: "Learners working through a digital design exercise",
    tags: ["Mentorship", "Confidence", "Learning Design"],
    author: {
      name: "ITFY Mentorship Team",
      role: "Learner Support",
      avatar: "/images/logo/logo_small.jpg",
    },
    readTimeMinutes: 5,
    seo: {
      title: "Mentor labs and practical confidence",
      description:
        "How mentorship can connect encouragement to practice, feedback, and next actions for young learners.",
      ogImage: "/images/randomPictures/uXstudents.jpg",
    },
    content: [
      "Mentorship works best when it moves beyond inspiration and into practical confidence.",
      "A mentor can help a learner name what they are trying to build, understand where they are stuck, and decide what to do next.",
      "That kind of feedback loop is one of the most important bridges between training and real-world readiness.",
    ],
    contentHtml:
      "<p>Mentorship works best when it moves beyond inspiration and into practical confidence.</p><p>A mentor can help a learner name what they are trying to build, understand where they are stuck, and decide what to do next.</p><h2>What useful mentorship feels like</h2><ul><li>Specific feedback on a learner's work.</li><li>Encouragement tied to the next achievable step.</li><li>Room to ask basic questions without embarrassment.</li></ul><p>That kind of feedback loop is one of the most important bridges between training and real-world readiness.</p>",
  },
];

export function isArticleCategory(category: string): category is ArticleCategory {
  return articleCategories.includes(category as ArticleCategory);
}

export function getArticleLabel(article: ArticleSeed) {
  return article.type ?? (article.category === "blogs" ? "Blog" : "News");
}

export function getArticleReadTime(article: ArticleSeed) {
  if (article.readTimeMinutes) {
    return article.readTimeMinutes;
  }

  const htmlText = article.contentHtml?.replace(/<[^>]+>/g, " ") ?? "";
  const words = `${article.excerpt} ${article.content.join(" ")} ${htmlText}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(2, Math.ceil(words / 180));
}

export function getPublishedArticles() {
  return articles
    .filter((article) => article.status !== "draft" && article.status !== "archived")
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    );
}

export function getArticlesByCategory(category: ArticleCategory) {
  return getPublishedArticles().filter((article) => article.category === category);
}

export function getFeaturedArticles(limit = 3) {
  return getPublishedArticles().filter((article) => article.featured).slice(0, limit);
}

export function getArticleBySlug(category: ArticleCategory, slug: string) {
  return getPublishedArticles().find(
    (article) => article.category === category && article.slug === slug,
  );
}

export function getRelatedArticles(article: ArticleSeed, limit = 3) {
  const articleTags = new Set(article.tags ?? []);

  return getPublishedArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter((tag) => articleTags.has(tag)).length;
      const categoryScore = candidate.category === article.category ? 1 : 0;

      return {
        article: candidate,
        score: sharedTags + categoryScore,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (
        new Date(right.article.publishedAt).getTime() -
        new Date(left.article.publishedAt).getTime()
      );
    })
    .slice(0, limit)
    .map((entry) => entry.article);
}

export function getAllArticleTags(category?: ArticleCategory) {
  const scopedArticles = category ? getArticlesByCategory(category) : getPublishedArticles();

  return Array.from(
    new Set(scopedArticles.flatMap((article) => article.tags ?? [])),
  ).sort((left, right) => left.localeCompare(right));
}
