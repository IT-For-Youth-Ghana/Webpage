import type {
  HighlightStat,
  PartnershipOverviewContent,
  PartnershipTrackPage,
} from "@/types/content";

const partnershipStats: HighlightStat[] = [
  {
    value: "5",
    label: "Partner tracks",
    description: "Clear routes for schools, public institutions, funders, development actors, and technology firms.",
    icon: "🧭",
  },
  {
    value: "Local",
    label: "Delivery grounding",
    description: "Partnerships are shaped around real Ghanaian youth contexts, not abstract programme language.",
    icon: "📍",
  },
  {
    value: "Cross-sector",
    label: "Collaboration model",
    description: "The work can connect civil society, education, employers, communities, and public institutions.",
    icon: "🤝",
  },
  {
    value: "Growth-ready",
    label: "Why it matters",
    description: "The strongest partnerships help move from isolated activity into more durable systems of opportunity.",
    icon: "🌱",
  },
];

function buildPartnershipTrackPage(
  page: PartnershipTrackPage,
): PartnershipTrackPage {
  return page;
}

export const partnershipOverviewContent: PartnershipOverviewContent = {
  eyebrow: "Partner with us",
  title: "Build partnerships that widen youth digital opportunity in ways that are practical, credible, and locally grounded",
  description:
    "Not every partner needs the same route. Some want to work through schools, some through policy or public systems, some through funding, and some through talent or technology. This section helps each institution see where it fits without flattening the collaboration into a generic ask.",
  heroImage: "/images/randomPictures/mave_peter.JPG",
  stats: partnershipStats,
  overviewSectionEyebrow: "Overview",
  overviewSectionTitle: "The right partnership starts with the right collaboration logic",
  overviewSectionDescription:
    "Each track below is built around a different type of institution and a different kind of decision. That makes it easier to move from interest into a practical, better-scoped relationship.",
  tracksSectionEyebrow: "Partnership tracks",
  tracksSectionTitle: "Choose the track that best matches your institution",
  tracksSectionDescription:
    "Each route is a clearer front door for a different kind of collaborator, with a dedicated page that explains fit, engagement models, examples, FAQs, and the next move.",
  partnerTypesSectionEyebrow: "Partner types",
  partnerTypesSectionTitle: "Different institutions bring different strengths to the ecosystem",
  partnerTypesSectionDescription:
    "These cards summarise the role each partner type can play before you dive into the dedicated detail page for that track.",
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle:
    "Start with the track that feels closest to your institution’s role",
  nextStepsSectionDescription:
    "If you already know where you fit, open that partner track. If you are still deciding, the contact route is the best shared entry point.",
  valueCards: [
    {
      title: "Partnerships should match the institution’s actual role",
      description:
        "A school, ministry, donor, and technology company each make different decisions. The partnership structure needs to reflect that reality from the start.",
    },
    {
      title: "The most useful collaborations connect mission to execution",
      description:
        "Shared values matter, but so do scope, expectations, timelines, and how the work will actually operate once the partnership begins.",
    },
    {
      title: "One strong entry point can grow into a wider relationship",
      description:
        "A school activation, a challenge partnership, a funding collaboration, or a mentoring route can all become deeper long-term work when the fit is strong.",
    },
  ],
  partnerTypeCards: [
    {
      title: "Educational Institutions",
      description:
        "For schools, universities, and learning communities that want structured collaboration around access, training, or recurring learner support.",
    },
    {
      title: "Government",
      description:
        "For public institutions exploring youth inclusion, local implementation, or more durable digital empowerment pathways.",
    },
    {
      title: "NGOs & Foundations",
      description:
        "For mission-aligned organisations that want credible programme collaboration, community reach, or access-focused support.",
    },
    {
      title: "International Development",
      description:
        "For agencies and development actors seeking locally grounded implementation and stronger alignment with youth opportunity goals.",
    },
    {
      title: "Technology Companies",
      description:
        "For firms that want to mentor, sponsor, hire, volunteer, or shape the wider technology talent ecosystem more intentionally.",
    },
  ],
  nextSteps: [
    {
      href: "/partner-with-us/educational",
      eyebrow: "Schools",
      title: "Educational Institutions",
      description: "Explore school, university, and learning-community collaborations.",
    },
    {
      href: "/partner-with-us/government",
      eyebrow: "Public sector",
      title: "Government",
      description: "See how civic and public partnerships can strengthen inclusive digital access.",
    },
    {
      href: "/partner-with-us/ngo-foundations",
      eyebrow: "Mission-aligned",
      title: "NGOs & Foundations",
      description: "Find collaboration routes for programme delivery, reach, and support.",
    },
    {
      href: "/partner-with-us/international-development",
      eyebrow: "Development",
      title: "International Development",
      description: "Explore donor- and agency-facing pathways for grounded implementation and evidence.",
    },
    {
      href: "/partner-with-us/technology",
      eyebrow: "Ecosystem",
      title: "Technology Companies",
      description: "Support the ecosystem through mentoring, sponsorship, talent, and applied collaboration.",
    },
  ],
};

export const partnershipTracks: PartnershipTrackPage[] = [
  buildPartnershipTrackPage({
    slug: "educational",
    eyebrow: "Partner track",
    title: "Educational Institutions",
    description:
      "Collaborate with IT For Youth Ghana through schools, universities, and learning communities that want stronger digital access and more consistent learner pathways.",
    tagline:
      "Turn education partnerships into recurring opportunities for exposure, learning, and progression.",
    heroImage: "/images/randomPictures/studentsblueclothing.jpg",
    snapshotEyebrow: "Partnership snapshot",
    stats: [
      {
        value: "Schools+",
        label: "Typical fit",
        description: "Works best with schools, universities, training centres, and structured learning communities.",
      },
      {
        value: "Recurring",
        label: "Engagement rhythm",
        description: "The strongest education partnerships usually create continuity rather than one-off exposure alone.",
      },
      {
        value: "Learner-first",
        label: "Why it matters",
        description: "Institutions help create trusted access points where students can keep growing over time.",
      },
      {
        value: "Pathway-ready",
        label: "Long-term value",
        description: "Partnerships can connect outreach, clubs, training, and challenge participation into one clearer system.",
      },
    ],
    overviewSectionEyebrow: "Partnership overview",
    overviewSectionTitle: "Where this track creates the most practical value",
    overviewSectionDescription:
      "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful.",
    overviewCardBadgeLabel: "Focus area",
    focusCards: [
      {
        title: "School-based access and activation",
        description: "Partnerships can create structured entry points for students who might not otherwise encounter digital opportunity early enough.",
        icon: "🏫",
        bullets: [
          "Useful for student exposure, awareness, and recurring engagement.",
          "Helps schools connect learning to practical, future-facing pathways.",
          "Creates more durable access than isolated workshop moments alone.",
        ],
      },
      {
        title: "Clubs, cohorts, and recurring learner spaces",
        description: "Educational partners often need a model that keeps momentum alive after the first activation.",
        icon: "👥",
        bullets: [
          "Supports consistency, repetition, and peer learning.",
          "Can connect directly to Tech Clubs, Youth Academy, or other initiative pathways.",
          "Helps institutions build a stronger internal rhythm around digital engagement.",
        ],
      },
      {
        title: "Institution-facing capacity support",
        description: "Sometimes the institution itself needs stronger capability or facilitation confidence before learner outcomes can deepen.",
        icon: "🎓",
        bullets: [
          "Relevant for staff training, programme design, or facilitation support.",
          "Can pair well with the corporate training route where appropriate.",
          "Strengthens institutional readiness to sustain the work over time.",
        ],
      },
      {
        title: "Progression into deeper pathways",
        description: "The best partnerships do not stop at exposure. They create clearer onward routes into training, challenges, and future opportunity.",
        icon: "🚀",
        bullets: [
          "Useful for schools that want a more complete learner ecosystem.",
          "Supports referrals into training or other structured opportunities.",
          "Helps institutions tell a stronger story about student progression.",
        ],
      },
    ],
    howItWorksSectionEyebrow: "How it works",
    howItWorksSectionTitle:
      "A clearer partnership sequence helps both sides move with more confidence",
    howItWorksSectionDescription:
      "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible.",
    howItWorks: [
      {
        number: "01",
        title: "Understand the institution context",
        description: "We clarify the learners, the environment, and what the school or learning community wants the partnership to make possible.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Choose the right engagement model",
        description: "The route could focus on outreach, recurring clubs, staff support, student progression, or a combination that makes sense.",
        icon: "🧩",
      },
      {
        number: "03",
        title: "Deliver and support",
        description: "The activity is run with the institution, not just inside it, so the partnership has a better chance of sticking.",
        icon: "🤲",
      },
      {
        number: "04",
        title: "Review and grow",
        description: "The collaboration can then evolve into a more durable pathway based on what worked and what the learners need next.",
        icon: "🌱",
      },
    ],
    scenariosSectionEyebrow: "Example scenarios",
    scenariosSectionTitle:
      "Representative patterns of how this track can work in practice",
    scenariosSectionDescription:
      "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS.",
    scenarios: [
      {
        title: "A school wants more than one digital workshop",
        partnerType: "Representative secondary-school partnership",
        summary: "The institution needed a route that could create ongoing engagement instead of a single awareness event.",
        outcome: "The partnership conversation centred on continuity, clubs, learner progression, and realistic school support structures.",
        highlight: "Schools usually get the strongest value when the work creates a rhythm, not only a moment.",
      },
      {
        title: "A training centre wants learner pathways beyond its classroom",
        partnerType: "Representative learning-community collaboration",
        summary: "The institution needed stronger connections between its learners and wider digital opportunity routes.",
        outcome: "The partnership helped frame how outreach, skill-building, and onward progression could work together.",
        highlight: "Institution partnerships are most useful when they link access to credible next steps.",
      },
    ],
    faqsSectionEyebrow: "FAQs",
    faqsSectionTitle:
      "Questions partners often need answered before they commit",
    faqsSectionDescription:
      "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties.",
    faqs: [
      {
        question: "Can this route work for both schools and universities?",
        answer: "Yes. The structure can be adapted for different education levels as long as the learner context and goals are clear.",
      },
      {
        question: "Do partnerships have to begin with a large programme?",
        answer: "No. A focused pilot or recurring smaller-format engagement can often be the strongest starting point.",
      },
      {
        question: "Can educational partners connect students into training later?",
        answer: "Yes. That progression potential is one of the main reasons this route exists.",
      },
    ],
    contactSectionEyebrow: "Contact CTA",
    contactCta: {
      heading: "Build an education partnership that creates real continuity for learners",
      description:
        "If your institution wants to move from occasional exposure into stronger recurring pathways, we can shape the right starting model together.",
      email: "info@itforyouthghana.org",
      primary: { label: "Talk about a school partnership", href: "/contact" },
      secondary: { label: "Explore What We Do", href: "/what-we-do" },
    },
    relatedSectionEyebrow: "Related routes",
    relatedSectionTitle: "Keep the partnership conversation moving",
    relatedSectionDescription:
      "These adjacent routes often become the next useful step once the first partnership shape is clearer.",
    related: [
      {
        href: "/what-we-do/tech-clubs",
        eyebrow: "Initiative",
        title: "Tech Clubs",
        description: "See how school-based recurring engagement can take shape in practice.",
      },
      {
        href: "/what-we-do/community-outreach",
        eyebrow: "Initiative",
        title: "Community Outreach",
        description: "Explore how first-contact activation work supports the wider learner pipeline.",
      },
      {
        href: "/apply-for-training",
        eyebrow: "Learner route",
        title: "Apply for Training",
        description: "See the next-step route students can grow into after deeper readiness develops.",
      },
    ],
  }),
  buildPartnershipTrackPage({
    slug: "government",
    eyebrow: "Partner track",
    title: "Government",
    description:
      "Work with IT For Youth Ghana on public-interest collaborations that connect youth digital inclusion goals to locally grounded implementation.",
    tagline:
      "Translate civic priorities into delivery models that reach young people more consistently and credibly.",
    heroImage: "/images/randomPictures/children_holding_sign_in_streets.jpg",
    snapshotEyebrow: "Partnership snapshot",
    stats: [
      {
        value: "Public-interest",
        label: "Core lens",
        description: "The route is strongest when the collaboration is tied to inclusion, opportunity, and durable access goals.",
      },
      {
        value: "Locally grounded",
        label: "Delivery strength",
        description: "Programme design benefits from being shaped around community context instead of only policy language.",
      },
      {
        value: "Scalable",
        label: "Why this route matters",
        description: "Public partnerships can help move promising models beyond isolated pilots.",
      },
      {
        value: "Trust-based",
        label: "Best condition",
        description: "The strongest civic work happens when priorities, responsibilities, and expectations are explicit early.",
      },
    ],
    overviewSectionEyebrow: "Partnership overview",
    overviewSectionTitle: "Where this track creates the most practical value",
    overviewSectionDescription:
      "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful.",
    overviewCardBadgeLabel: "Focus area",
    focusCards: [
      {
        title: "Youth digital inclusion priorities",
        description: "The partnership can help translate broad public goals into something more practical for learners and communities.",
        icon: "🏛️",
        bullets: [
          "Useful for programmes aligned with education, youth, or digital inclusion priorities.",
          "Helps connect policy direction with implementation reality.",
          "Strengthens the chance that public commitments feel visible to communities.",
        ],
      },
      {
        title: "Regional or local activation models",
        description: "Public institutions often need collaboration models that can work beyond one school or one neighbourhood.",
        icon: "🗺️",
        bullets: [
          "Supports wider reach when local implementation needs trusted delivery partners.",
          "Can help shape how community and institutional routes interact.",
          "Useful where scale matters but community context still cannot be ignored.",
        ],
      },
      {
        title: "Evidence and programme learning",
        description: "Government partners often need stronger signals about what is working and why before going deeper.",
        icon: "📊",
        bullets: [
          "Supports clearer reflection on delivery, fit, and progression.",
          "Helps frame evidence without pretending the work is context-free.",
          "Useful for conversations about sustainability or wider public backing.",
        ],
      },
      {
        title: "Cross-sector coordination",
        description: "Public partnerships become stronger when they can connect schools, communities, NGOs, and employers more intentionally.",
        icon: "🔗",
        bullets: [
          "Helps reduce siloed effort across the ecosystem.",
          "Can make youth opportunity pathways more coherent.",
          "Creates better conditions for durable collaboration beyond one department or moment.",
        ],
      },
    ],
    howItWorksSectionEyebrow: "How it works",
    howItWorksSectionTitle:
      "A clearer partnership sequence helps both sides move with more confidence",
    howItWorksSectionDescription:
      "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible.",
    howItWorks: [
      {
        number: "01",
        title: "Clarify the civic objective",
        description: "We define the public-interest goal and what kind of implementation support or programme route would make it real.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Shape the collaboration model",
        description: "The route is scoped around institutions, communities, learners, and delivery conditions that actually exist on the ground.",
        icon: "🛠️",
      },
      {
        number: "03",
        title: "Run with local credibility",
        description: "The partnership works best when implementation is trusted, understandable, and responsive to context.",
        icon: "🤝",
      },
      {
        number: "04",
        title: "Assess what can scale",
        description: "The collaboration then creates a clearer basis for learning, adaptation, and possible broader support.",
        icon: "📈",
      },
    ],
    scenariosSectionEyebrow: "Example scenarios",
    scenariosSectionTitle: "Representative patterns of how this track can work in practice",
    scenariosSectionDescription:
      "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS.",
    scenarios: [
      {
        title: "A district-level actor wants stronger youth-tech activation",
        partnerType: "Representative local public collaboration",
        summary: "The institution needed a partner that could help translate inclusion priorities into visible youth-facing activity.",
        outcome: "The conversation focused on realistic scope, trusted delivery, and how young people would actually encounter the work.",
        highlight: "Public collaboration gets stronger when delivery is as carefully considered as the policy goal.",
      },
      {
        title: "A public institution wants clearer evidence before wider support",
        partnerType: "Representative civic programme pathway",
        summary: "The partner needed implementation that could also generate credible learning and reflection.",
        outcome: "The route helped frame collaboration around both delivery and evidence, not one or the other alone.",
        highlight: "Government-facing work often needs both practical implementation and a strong learning story.",
      },
    ],
    faqsSectionEyebrow: "FAQs",
    faqsSectionTitle: "Questions partners often need answered before they commit",
    faqsSectionDescription:
      "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties.",
    faqs: [
      {
        question: "Does this route only fit national-level institutions?",
        answer: "No. Local, district, municipal, and regional public actors can also be strong fits depending on the collaboration goal.",
      },
      {
        question: "Can this work connect with schools and communities together?",
        answer: "Yes. In many cases that cross-connection is part of what makes the public partnership meaningful.",
      },
      {
        question: "Do government collaborations have to start large?",
        answer: "No. A smaller, well-scoped model can often build a better foundation for future scale.",
      },
    ],
    contactSectionEyebrow: "Contact CTA",
    contactCta: {
      heading: "Shape a public-interest partnership that is grounded enough to work",
      description:
        "If your institution wants to widen digital opportunity through a more practical and locally credible route, we can begin by clarifying the right implementation model.",
      email: "info@itforyouthghana.org",
      primary: { label: "Discuss a public collaboration", href: "/contact" },
      secondary: { label: "See Our Impact", href: "/our-impact/reports" },
    },
    relatedSectionEyebrow: "Related routes",
    relatedSectionTitle: "Keep the partnership conversation moving",
    relatedSectionDescription:
      "These adjacent routes often become the next useful step once the first partnership shape is clearer.",
    related: [
      {
        href: "/what-we-do/advocacy",
        eyebrow: "Initiative",
        title: "Advocacy",
        description: "See how ecosystem and policy-facing work connects to the broader mission.",
      },
      {
        href: "/what-we-do/rural-tech-connect",
        eyebrow: "Initiative",
        title: "Rural Tech Connect",
        description: "Explore one route where regional access and inclusion questions become very practical.",
      },
      {
        href: "/our-impact/sdgs",
        eyebrow: "Impact",
        title: "UN SDGs",
        description: "See how the work aligns with wider development and inclusion outcomes.",
      },
    ],
  }),
  buildPartnershipTrackPage({
    slug: "ngo-foundations",
    eyebrow: "Partner track",
    title: "NGOs & Foundations",
    description:
      "Collaborate on mission-aligned programmes, community reach, learner support, and practical implementation through a route designed for values fit and delivery clarity.",
    tagline:
      "Build partnerships that connect funding, trust, and local implementation into something more durable for young people.",
    heroImage: "/images/randomPictures/group_girls.jpg",
    snapshotEyebrow: "Partnership snapshot",
    stats: [
      {
        value: "Mission-aligned",
        label: "Best fit",
        description: "Strong when the partner shares a commitment to access, inclusion, and youth opportunity.",
      },
      {
        value: "Community-aware",
        label: "Delivery strength",
        description: "Local context and trust matter, especially where the work reaches underserved learners.",
      },
      {
        value: "Flexible",
        label: "Collaboration shape",
        description: "Funding, programme support, reach, and implementation pathways can all be part of the route.",
      },
      {
        value: "Relationship-led",
        label: "Why it works",
        description: "The strongest NGO and foundation partnerships deepen because the values and the operating style fit well together.",
      },
    ],
    overviewSectionEyebrow: "Partnership overview",
    overviewSectionTitle: "Where this track creates the most practical value",
    overviewSectionDescription:
      "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful.",
    overviewCardBadgeLabel: "Focus area",
    focusCards: [
      {
        title: "Programme collaboration",
        description: "Mission-aligned institutions often want delivery routes that do more than fund a single visible event.",
        icon: "🧩",
        bullets: [
          "Useful for co-delivery, support, or targeted programme backing.",
          "Works well when responsibilities are clearly shared.",
          "Creates a stronger sense of partnership than a purely transactional relationship.",
        ],
      },
      {
        title: "Community trust and reach",
        description: "NGOs and foundations often bring network strength, legitimacy, or community access that can deepen implementation quality.",
        icon: "🌍",
        bullets: [
          "Can support more inclusive reach and better community fit.",
          "Helps programmes move beyond urban or already-connected audiences.",
          "Strengthens credibility when entering new learner environments.",
        ],
      },
      {
        title: "Access-focused support",
        description: "Partnerships can help remove barriers that prevent high-potential learners from joining or continuing.",
        icon: "🎓",
        bullets: [
          "Useful for scholarship support, devices, wraparound learner care, or campaign alignment.",
          "Connects funding more clearly to participation outcomes.",
          "Supports deeper inclusion rather than access in name only.",
        ],
      },
      {
        title: "Shared learning and reflection",
        description: "Values-led partners usually want to understand not only what happened, but what is being learned through the work.",
        icon: "📘",
        bullets: [
          "Supports more thoughtful programme iteration.",
          "Useful for institutions thinking about longer-term evidence and adaptation.",
          "Helps the partnership stay grounded in learning rather than only reporting.",
        ],
      },
    ],
    howItWorksSectionEyebrow: "How it works",
    howItWorksSectionTitle:
      "A clearer partnership sequence helps both sides move with more confidence",
    howItWorksSectionDescription:
      "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible.",
    howItWorks: [
      {
        number: "01",
        title: "Surface the shared mission fit",
        description: "We identify the overlap between partner priorities and the specific youth opportunity challenges the collaboration should address.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Define the programme role",
        description: "The route is then scoped around support type, implementation responsibility, and what outcomes matter most.",
        icon: "📋",
      },
      {
        number: "03",
        title: "Deliver in context",
        description: "The work is shaped around communities, learners, and operational realities rather than only the abstract partnership idea.",
        icon: "🤲",
      },
      {
        number: "04",
        title: "Learn and deepen",
        description: "The collaboration creates a basis for stronger reflection, improvement, and possibly broader long-term support.",
        icon: "🌱",
      },
    ],
    scenariosSectionEyebrow: "Example scenarios",
    scenariosSectionTitle: "Representative patterns of how this track can work in practice",
    scenariosSectionDescription:
      "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS.",
    scenarios: [
      {
        title: "A foundation wants scholarship support tied to real learner pathways",
        partnerType: "Representative foundation collaboration",
        summary: "The funder wanted access support that connected to actual participation and not only a high-level mission statement.",
        outcome: "The route centred on practical learner barriers and how support could be tied to visible programme movement.",
        highlight: "Values-aligned funding gets stronger when it is tied to a clear learner journey.",
      },
      {
        title: "An NGO wants implementation that can reach beyond its usual audience",
        partnerType: "Representative NGO partnership",
        summary: "The organisation needed a delivery partner that could work with local realities while supporting broader inclusion goals.",
        outcome: "The collaboration was framed around trust, fit, shared responsibility, and realistic programme scope.",
        highlight: "The best NGO collaborations treat implementation context as a core design input, not an afterthought.",
      },
    ],
    faqsSectionEyebrow: "FAQs",
    faqsSectionTitle: "Questions partners often need answered before they commit",
    faqsSectionDescription:
      "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties.",
    faqs: [
      {
        question: "Can this route include both funding and programme collaboration?",
        answer: "Yes. Many NGO and foundation partnerships are strongest when support and implementation are designed together.",
      },
      {
        question: "Is this only for large foundations?",
        answer: "No. The route can fit different sizes of mission-aligned institution as long as the collaboration model is realistic.",
      },
      {
        question: "Can community-based organisations also fit here?",
        answer: "Yes. Community-rooted organisations can be especially valuable where trust and local access are central to delivery.",
      },
    ],
    contactSectionEyebrow: "Contact CTA",
    contactCta: {
      heading: "Create a mission-aligned partnership that can actually operate well on the ground",
      description:
        "If your organisation wants to collaborate around access, implementation, funding, or community reach, we can shape the right programme route together.",
      email: "info@itforyouthghana.org",
      primary: { label: "Start a mission-aligned conversation", href: "/contact" },
      secondary: { label: "Explore impact reports", href: "/our-impact/reports" },
    },
    relatedSectionEyebrow: "Related routes",
    relatedSectionTitle: "Keep the partnership conversation moving",
    relatedSectionDescription:
      "These adjacent routes often become the next useful step once the first partnership shape is clearer.",
    related: [
      {
        href: "/for-organisations/sponsorships",
        eyebrow: "Support",
        title: "Sponsorships",
        description: "See the organisation-facing route for focused funding and access support pathways.",
      },
      {
        href: "/what-we-do/community-outreach",
        eyebrow: "Initiative",
        title: "Community Outreach",
        description: "Explore a route where local reach and community trust are especially important.",
      },
      {
        href: "/our-impact/reports",
        eyebrow: "Impact",
        title: "Impact Reports",
        description: "See how the wider mission and outcomes story supports partnership trust.",
      },
    ],
  }),
  buildPartnershipTrackPage({
    slug: "international-development",
    eyebrow: "Partner track",
    title: "International Development",
    description:
      "Work with IT For Youth Ghana as a locally grounded implementation and collaboration partner for youth, inclusion, skills, and opportunity-focused initiatives.",
    tagline:
      "Connect development priorities to credible local delivery that understands the communities and learners the work is meant to serve.",
    heroImage: "/images/randomPictures/frontalgraduation.jpg",
    snapshotEyebrow: "Partnership snapshot",
    stats: [
      {
        value: "Local credibility",
        label: "Core strength",
        description: "This route is designed for agencies and funders that need partners who understand local context deeply.",
      },
      {
        value: "Implementation-ready",
        label: "Operational fit",
        description: "The work can support practical programme delivery, evidence gathering, and ecosystem coordination.",
      },
      {
        value: "Youth-centred",
        label: "Why it matters",
        description: "The collaboration stays anchored in what the work changes for young people, not only in strategic language.",
      },
      {
        value: "SDG-aligned",
        label: "Wider relevance",
        description: "The route connects naturally to education, decent work, gender, and innovation goals.",
      },
    ],
    overviewSectionEyebrow: "Partnership overview",
    overviewSectionTitle: "Where this track creates the most practical value",
    overviewSectionDescription:
      "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful.",
    overviewCardBadgeLabel: "Focus area",
    focusCards: [
      {
        title: "Locally grounded delivery partnership",
        description: "International actors often need a collaborator who can bridge strategy and field reality with credibility.",
        icon: "🌍",
        bullets: [
          "Useful where programme quality depends on local understanding.",
          "Helps avoid imported solutions that do not fit learner context well.",
          "Supports more grounded implementation decisions from the start.",
        ],
      },
      {
        title: "Evidence and learning support",
        description: "Development actors usually need a stronger story about what is being learned through delivery, not only activity counts.",
        icon: "📊",
        bullets: [
          "Supports reflection, adaptation, and clearer programme reasoning.",
          "Helps connect field insight to reporting and strategic thinking.",
          "Useful when funders care about both outcomes and implementation quality.",
        ],
      },
      {
        title: "Inclusive opportunity pathways",
        description: "The route is strongest when digital access, gender inclusion, or employability pathways need more practical local depth.",
        icon: "🚪",
        bullets: [
          "Can connect outreach, training, clubs, entrepreneurship, and transition routes.",
          "Useful for interventions that want more than one isolated output.",
          "Supports stronger pathway logic for youth opportunity work.",
        ],
      },
      {
        title: "Cross-partner coordination",
        description: "Development collaborations often need to make sense across local institutions, communities, and ecosystem actors.",
        icon: "🔗",
        bullets: [
          "Helps align multiple collaborators around a clearer field reality.",
          "Can reduce fragmentation between local delivery actors.",
          "Creates more durable conditions for the work to matter beyond one cycle.",
        ],
      },
    ],
    howItWorksSectionEyebrow: "How it works",
    howItWorksSectionTitle:
      "A clearer partnership sequence helps both sides move with more confidence",
    howItWorksSectionDescription:
      "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible.",
    howItWorks: [
      {
        number: "01",
        title: "Clarify the development objective",
        description: "We define the youth, access, inclusion, or skills challenge the collaboration is actually trying to address.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Shape the implementation role",
        description: "The route is scoped around practical delivery responsibilities, evidence expectations, and local context constraints.",
        icon: "🛠️",
      },
      {
        number: "03",
        title: "Deliver with contextual insight",
        description: "The work is carried out in a way that stays responsive to learners, institutions, and operational realities on the ground.",
        icon: "🤝",
      },
      {
        number: "04",
        title: "Reflect, report, and adapt",
        description: "The collaboration creates a clearer basis for learning, credibility, and future programme refinement.",
        icon: "📘",
      },
    ],
    scenariosSectionEyebrow: "Example scenarios",
    scenariosSectionTitle: "Representative patterns of how this track can work in practice",
    scenariosSectionDescription:
      "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS.",
    scenarios: [
      {
        title: "An agency needs a local partner for a youth inclusion programme",
        partnerType: "Representative development implementation route",
        summary: "The actor needed a collaborator who could align with development goals without losing touch with community and learner realities.",
        outcome: "The partnership structure centred on local credibility, implementation clarity, and evidence that could support future adaptation.",
        highlight: "Development partnerships become stronger when field reality is treated as a strategic asset, not just an operational detail.",
      },
      {
        title: "A donor wants clearer insight into what is actually changing",
        partnerType: "Representative donor learning pathway",
        summary: "The collaboration needed both programme activity and a more grounded understanding of what outcomes were becoming possible.",
        outcome: "The route helped frame how delivery and learning could support each other instead of competing for attention.",
        highlight: "Good development work often depends on making learning visible while delivery is still happening.",
      },
    ],
    faqsSectionEyebrow: "FAQs",
    faqsSectionTitle: "Questions partners often need answered before they commit",
    faqsSectionDescription:
      "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties.",
    faqs: [
      {
        question: "Is this route only for large international agencies?",
        answer: "No. It can also fit development actors, consortia, and funders who need grounded local collaboration at different scales.",
      },
      {
        question: "Can this connect to SDG framing?",
        answer: "Yes. The work naturally intersects with education, decent work, gender inclusion, and innovation-focused goals.",
      },
      {
        question: "Can local implementation and evidence be designed together?",
        answer: "Yes. That combination is often one of the strongest reasons to use this route.",
      },
    ],
    contactSectionEyebrow: "Contact CTA",
    contactCta: {
      heading: "Partner on development work that stays credible at community level",
      description:
        "If you need a locally grounded partner for youth, inclusion, skills, or opportunity-focused work, we can begin by clarifying the delivery role and evidence needs together.",
      email: "info@itforyouthghana.org",
      primary: { label: "Discuss a development partnership", href: "/contact" },
      secondary: { label: "Explore SDG alignment", href: "/our-impact/sdgs" },
    },
    relatedSectionEyebrow: "Related routes",
    relatedSectionTitle: "Keep the partnership conversation moving",
    relatedSectionDescription:
      "These adjacent routes often become the next useful step once the first partnership shape is clearer.",
    related: [
      {
        href: "/our-impact/sdgs",
        eyebrow: "Impact",
        title: "UN SDGs",
        description: "See how the mission connects to broader global development goals.",
      },
      {
        href: "/what-we-do/rural-tech-connect",
        eyebrow: "Initiative",
        title: "Rural Tech Connect",
        description: "Explore a route where locally grounded access and implementation matter deeply.",
      },
      {
        href: "/partner-with-us/government",
        eyebrow: "Partner track",
        title: "Government",
        description: "See the adjacent civic route for public-interest and systems-facing collaboration.",
      },
    ],
  }),
  buildPartnershipTrackPage({
    slug: "technology",
    eyebrow: "Partner track",
    title: "Technology Companies",
    description:
      "Partner with IT For Youth Ghana through mentoring, sponsorship, volunteering, talent pathways, and ecosystem support that reaches beyond branding alone.",
    tagline:
      "Help shape a stronger, more inclusive technology ecosystem by backing the people and pathways that feed it.",
    heroImage: "/images/randomPictures/studentsBackcoding.jpg",
    snapshotEyebrow: "Partnership snapshot",
    stats: [
      {
        value: "Ecosystem",
        label: "Best lens",
        description: "Technology companies are strongest here when they think beyond visibility and toward long-term talent and access.",
      },
      {
        value: "Multi-route",
        label: "Ways to engage",
        description: "Mentoring, volunteering, sponsorship, talent, and challenge support can all work together.",
      },
      {
        value: "Practical",
        label: "Contribution style",
        description: "The strongest partners bring real knowledge, opportunities, resources, or role models into the ecosystem.",
      },
      {
        value: "Future-building",
        label: "Why it matters",
        description: "This route helps widen participation while strengthening the future pipeline of talent and innovation.",
      },
    ],
    overviewSectionEyebrow: "Partnership overview",
    overviewSectionTitle: "Where this track creates the most practical value",
    overviewSectionDescription:
      "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful.",
    overviewCardBadgeLabel: "Focus area",
    focusCards: [
      {
        title: "Mentorship and industry exposure",
        description: "Technology firms can give learners a clearer sense of what real-world digital work looks and feels like.",
        icon: "💬",
        bullets: [
          "Useful for aspiration, confidence, and industry visibility.",
          "Can support workshops, talks, review sessions, or sustained mentoring.",
          "Helps learners connect classroom work to real technology environments.",
        ],
      },
      {
        title: "Talent and transition pathways",
        description: "Firms can also support the wider ecosystem by making more intentional early-career entry routes possible.",
        icon: "🧑‍💻",
        bullets: [
          "Can connect to internships, exposure, projects, or hiring conversations.",
          "Strengthens the relationship between learning and opportunity.",
          "Pairs naturally with the hire-our-graduates route.",
        ],
      },
      {
        title: "Sponsorship and resource support",
        description: "Technology companies can help remove learner barriers or strengthen high-impact programme moments.",
        icon: "💛",
        bullets: [
          "Useful for scholarships, devices, events, or challenge-based support.",
          "Works best when the contribution is tied to a clear outcomes story.",
          "Supports inclusion in ways that are visible and practical.",
        ],
      },
      {
        title: "Challenge and ecosystem participation",
        description: "Firms can help shape the wider culture of possibility by showing up where learners build, present, and grow.",
        icon: "⚡",
        bullets: [
          "Useful for judging, challenge support, public showcases, and applied learning moments.",
          "Creates stronger two-way visibility between learners and industry.",
          "Helps the ecosystem feel more open and reachable to participants.",
        ],
      },
    ],
    howItWorksSectionEyebrow: "How it works",
    howItWorksSectionTitle:
      "A clearer partnership sequence helps both sides move with more confidence",
    howItWorksSectionDescription:
      "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible.",
    howItWorks: [
      {
        number: "01",
        title: "Choose the strongest engagement route",
        description: "We clarify whether the company is best suited for mentoring, sponsorship, volunteering, talent support, or a blended route.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Match to the right programme context",
        description: "The engagement is framed around learners, initiatives, and collaboration moments where the company can be genuinely useful.",
        icon: "🧩",
      },
      {
        number: "03",
        title: "Activate with purpose",
        description: "The collaboration is delivered in a way that helps learners, reflects the company’s strengths, and avoids empty visibility gestures.",
        icon: "🚀",
      },
      {
        number: "04",
        title: "Build a deeper relationship",
        description: "A strong first engagement can grow into talent, sponsorship, volunteering, or broader ecosystem collaboration over time.",
        icon: "🌱",
      },
    ],
    scenariosSectionEyebrow: "Example scenarios",
    scenariosSectionTitle: "Representative patterns of how this track can work in practice",
    scenariosSectionDescription:
      "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS.",
    scenarios: [
      {
        title: "A tech company wants to mentor without creating a vague programme",
        partnerType: "Representative industry partnership",
        summary: "The team wanted to support young people meaningfully but needed a clearer structure than a general offer to help.",
        outcome: "The route focused on matching staff strengths to specific learner moments and initiative needs.",
        highlight: "Industry support becomes more valuable when it is designed around actual learner needs and team capacity.",
      },
      {
        title: "A firm wants to support both talent and visibility",
        partnerType: "Representative ecosystem pathway",
        summary: "The company wanted a relationship that could include mentoring, sponsorship, and a clearer connection to future emerging talent.",
        outcome: "The partnership was framed as a multi-route ecosystem contribution rather than a single isolated gesture.",
        highlight: "Technology companies often create the most value when they engage across more than one layer of the ecosystem.",
      },
    ],
    faqsSectionEyebrow: "FAQs",
    faqsSectionTitle: "Questions partners often need answered before they commit",
    faqsSectionDescription:
      "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties.",
    faqs: [
      {
        question: "Does this route only fit large technology companies?",
        answer: "No. Smaller firms, startups, studios, and growing teams can all be strong partners if the engagement model is realistic.",
      },
      {
        question: "Can this include hiring as well as mentoring or sponsorship?",
        answer: "Yes. Many technology companies will find that those routes reinforce each other well over time.",
      },
      {
        question: "What makes a tech partnership meaningful rather than performative?",
        answer: "Clear learner value, realistic staff involvement, and an engagement route tied to actual programme needs are the strongest starting points.",
      },
    ],
    contactSectionEyebrow: "Contact CTA",
    contactCta: {
      heading: "Support the ecosystem in a way that is useful, visible, and future-building",
      description:
        "If your company wants to mentor, fund, volunteer, hire, or support applied learning moments, we can help shape the route that fits best.",
      email: "info@itforyouthghana.org",
      primary: { label: "Explore a technology partnership", href: "/contact" },
      secondary: { label: "Hire our graduates", href: "/for-organisations/hire-graduates" },
    },
    relatedSectionEyebrow: "Related routes",
    relatedSectionTitle: "Keep the partnership conversation moving",
    relatedSectionDescription:
      "These adjacent routes often become the next useful step once the first partnership shape is clearer.",
    related: [
      {
        href: "/for-organisations/staff-volunteering",
        eyebrow: "Organisation route",
        title: "Staff Volunteering",
        description: "See the structured route for team-based mentoring, judging, and facilitation support.",
      },
      {
        href: "/for-organisations/hire-graduates",
        eyebrow: "Organisation route",
        title: "Hire Our Graduates",
        description: "Explore the adjacent route for talent and early-career opportunity conversations.",
      },
      {
        href: "/what-we-do/code-impact-challenge",
        eyebrow: "Initiative",
        title: "Code Impact Challenge",
        description: "See a natural entry point for industry judging, mentoring, and applied learner visibility.",
      },
    ],
  }),
];
