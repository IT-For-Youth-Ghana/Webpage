import type {
  HighlightStat,
  OrganisationOverviewContent,
  OrganisationServicePage,
} from "@/types/content";

const organisationStats: HighlightStat[] = [
  {
    value: "4",
    label: "Service routes",
    description: "Distinct ways organisations can train, sponsor, hire, or volunteer with ITFY Ghana.",
    icon: "🧩",
  },
  {
    value: "Youth-first",
    label: "Delivery lens",
    description: "Every engagement is shaped around stronger outcomes for learners and the wider ecosystem.",
    icon: "🌍",
  },
  {
    value: "Flexible",
    label: "Engagement model",
    description: "Programmes can be tailored around team size, timing, budget, and the type of support needed.",
    icon: "⚙️",
  },
  {
    value: "Accra+",
    label: "Operating base",
    description: "Local delivery with room for hybrid formats, remote coordination, and broader partnerships.",
    icon: "📍",
  },
];

function buildOrganisationServicePage(
  page: OrganisationServicePage,
): OrganisationServicePage {
  return page;
}

export const organisationOverviewContent: OrganisationOverviewContent = {
  eyebrow: "For organisations",
  title: "Work with IT For Youth Ghana in ways that create practical value on both sides",
  description:
    "Some organisations need digital skills training for their teams. Others want to fund access, hire emerging talent, or create meaningful staff-volunteering experiences. This section helps each partner find the right route without forcing every conversation into the same shape.",
  heroImage: "/images/randomPictures/peterTalking.jpg",
  stats: organisationStats,
  valueCards: [
    {
      title: "Mission alignment without losing delivery clarity",
      description:
        "The work is values-led, but it is still structured around practical delivery, expectations, timelines, and outcomes that organisations can understand.",
    },
    {
      title: "Programmes can be tailored to context",
      description:
        "A corporate team, a school, a donor, and an employer do not need the same offer. Each route is framed around the real decision that partner is trying to make.",
    },
    {
      title: "The relationship can grow over time",
      description:
        "One-off training, sponsorship, or volunteering can still evolve into deeper support across talent, programme growth, and ecosystem visibility.",
    },
  ],
  engagementCards: [
    {
      title: "Train",
      description:
        "Support internal team growth or institution-facing learning through custom digital skills delivery.",
    },
    {
      title: "Fund",
      description:
        "Back scholarships, cohorts, campaigns, and community reach through focused sponsorship pathways.",
    },
    {
      title: "Hire",
      description:
        "Meet emerging talent from ITFY pathways and shape more inclusive routes into work experience and employment.",
    },
    {
      title: "Volunteer",
      description:
        "Create practical staff-engagement opportunities through mentoring, workshops, judging, and facilitation support.",
    },
  ],
  nextSteps: [
    {
      href: "/for-organisations/corporate-training",
      eyebrow: "Training",
      title: "Corporate Training",
      description: "Explore tailored digital skills training for teams, institutions, and mission-aligned partners.",
    },
    {
      href: "/for-organisations/sponsorships",
      eyebrow: "Funding",
      title: "Sponsorships",
      description: "See how organisations can support scholarships, cohorts, events, and growth campaigns.",
    },
    {
      href: "/for-organisations/hire-graduates",
      eyebrow: "Talent",
      title: "Hire Our Graduates",
      description: "Connect with learners who are building practical portfolios and transition-ready confidence.",
    },
    {
      href: "/for-organisations/staff-volunteering",
      eyebrow: "Engagement",
      title: "Staff Volunteering",
      description: "Offer mentoring, facilitation, and team-based support in ways that are structured and useful.",
    },
  ],
};

export const organisationServices: OrganisationServicePage[] = [
  buildOrganisationServicePage({
    slug: "corporate-training",
    eyebrow: "For organisations",
    title: "Corporate Training",
    description:
      "Custom digital skills training for teams, institutions, and mission-aligned partners that want practical learning, not generic workshops.",
    tagline:
      "Build stronger digital confidence inside your team with training shaped around your real context.",
    heroImage: "/images/randomPictures/redstudentgrouplesson.jpg",
    stats: [
      {
        value: "Custom",
        label: "Learning design",
        description: "Delivery can be adapted around sector needs, team maturity, and time constraints.",
      },
      {
        value: "Hands-on",
        label: "Format",
        description: "Sessions lean toward practical application, guided exercises, and usable follow-through.",
      },
      {
        value: "Hybrid",
        label: "Delivery options",
        description: "Workshops can run in-person, online, or in blended formats where needed.",
      },
      {
        value: "Mission-ready",
        label: "Ideal fit",
        description: "Well suited for institutions that want learning tied to broader social or organisational goals.",
      },
    ],
    overviewCards: [
      {
        title: "Team capability mapping",
        description: "We start by understanding what the team needs to do better, not just which buzzwords sound relevant.",
        icon: "🧭",
        bullets: [
          "Clarify learning goals before training is designed.",
          "Spot the gap between current confidence and expected work output.",
          "Avoid overloading teams with content that does not match their role.",
        ],
      },
      {
        title: "Tailored digital skills delivery",
        description: "Training can focus on foundational digital fluency, product thinking, design, software, data, or applied tool use.",
        icon: "💻",
        bullets: [
          "Content is adapted to audience and time available.",
          "Examples can reflect the organisation’s real workflow or service environment.",
          "Facilitation balances clarity, interaction, and practical exercises.",
        ],
      },
      {
        title: "Applied work sessions",
        description: "Teams learn more when they can connect sessions to the work they actually have to deliver afterwards.",
        icon: "🛠️",
        bullets: [
          "Exercises move beyond passive presentation formats.",
          "Reflection and working sessions help transfer learning into practice.",
          "Useful for both internal teams and institution-facing training cohorts.",
        ],
      },
      {
        title: "Follow-through and reporting",
        description: "Where needed, the engagement can close with recommendations, reflection notes, or next-step suggestions.",
        icon: "📈",
        bullets: [
          "Partners leave with clearer signals about confidence and progress.",
          "The work can point toward future training phases if useful.",
          "Documentation helps decision-makers understand what changed.",
        ],
      },
    ],
    howItWorks: [
      {
        number: "01",
        title: "Discovery conversation",
        description: "We understand the team, the context, the desired outcomes, and the constraints before shaping a delivery approach.",
        icon: "🤝",
      },
      {
        number: "02",
        title: "Training design",
        description: "A tailored scope is built around the audience, skills focus, timeline, and format that make the most sense.",
        icon: "🧩",
      },
      {
        number: "03",
        title: "Facilitation and practice",
        description: "Sessions are delivered with practical activities that help participants use the ideas rather than only hear them.",
        icon: "🎓",
      },
      {
        number: "04",
        title: "Wrap-up and next steps",
        description: "The engagement closes with practical reflections, recommendations, and options for deeper future support.",
        icon: "📬",
      },
    ],
    caseStudies: [
      {
        title: "Digital confidence for a small operations team",
        organisationType: "Representative SME engagement",
        summary: "A team needed stronger shared fluency across digital tools, internal coordination, and everyday online workflows.",
        outcome: "The training created a more confident baseline, clearer shared language, and a practical list of next improvements.",
        highlight: "Focused learning can unlock momentum quickly when it is connected to real daily work.",
      },
      {
        title: "Institution staff upskilling ahead of programme expansion",
        organisationType: "Representative education partner",
        summary: "Staff needed a more structured foundation in digital delivery before supporting learners at larger scale.",
        outcome: "The engagement helped align staff confidence, delivery expectations, and future training priorities.",
        highlight: "Capacity-building inside institutions can strengthen learner-facing outcomes indirectly but powerfully.",
      },
    ],
    pricingHeadline: "Example engagement structures",
    pricingDescription:
      "Exact pricing depends on scope, facilitation needs, duration, and travel requirements. These sample packages help partners understand the shape of a typical engagement.",
    packages: [
      {
        name: "Starter Workshop",
        price: "Custom quote",
        description: "A focused introductory session for a team that needs one clear learning intervention.",
        features: [
          "Single-topic workshop",
          "Audience-fit planning",
          "Practical activities",
          "Post-session recommendations",
        ],
      },
      {
        name: "Learning Sprint",
        price: "Custom quote",
        description: "A multi-session engagement for teams that need more depth, repetition, and follow-through.",
        features: [
          "Multi-session delivery",
          "Custom curriculum shaping",
          "Applied work between sessions",
          "Summary report and next-step guidance",
        ],
      },
    ],
    faqs: [
      {
        question: "Can the training be tailored for non-technical teams?",
        answer: "Yes. The strongest starting point is the team’s actual role, not whether they already identify as technical.",
      },
      {
        question: "Do you only train corporate teams?",
        answer: "No. The route is also relevant for institutions, NGOs, schools, and mission-aligned partners that need practical digital capacity-building.",
      },
      {
        question: "Do engagements have to be in person?",
        answer: "No. In-person, remote, and hybrid formats are all possible depending on the audience and learning goals.",
      },
    ],
    contactCta: {
      heading: "Start a training conversation that is grounded in your real needs",
      description:
        "Share your team context, the skills area you want to strengthen, and the timing you are working toward. We can shape the most realistic next step from there.",
      email: "info@itforyouthghana.org",
      primary: { label: "Contact the team", href: "/contact" },
      secondary: { label: "Partner with us", href: "/partner-with-us" },
    },
    related: [
      {
        href: "/for-organisations/staff-volunteering",
        eyebrow: "Engagement",
        title: "Staff Volunteering",
        description: "Pair training support with staff mentoring, workshops, or challenge participation.",
      },
      {
        href: "/partner-with-us/technology",
        eyebrow: "Partner",
        title: "Technology Companies",
        description: "See broader collaboration routes for firms that want to train, mentor, sponsor, and hire.",
      },
      {
        href: "/contact",
        eyebrow: "Connect",
        title: "Talk to ITFY Ghana",
        description: "Open the conversation about team needs, audience, timing, and format.",
      },
    ],
  }),
  buildOrganisationServicePage({
    slug: "sponsorships",
    eyebrow: "For organisations",
    title: "Sponsorships",
    description:
      "Support scholarships, cohorts, campaigns, and community activation work through sponsorship pathways that connect funding to visible learner outcomes.",
    tagline:
      "Back access, growth, and visibility in ways that feel concrete for both the organisation and the young people served.",
    heroImage: "/images/randomPictures/graduationspeaking.jpg",
    stats: [
      {
        value: "Scholarships",
        label: "Funding focus",
        description: "Support can directly reduce the barriers that stop learners from joining a cohort.",
      },
      {
        value: "Campaigns",
        label: "Visibility routes",
        description: "Funding can align with public campaigns, stories, or themed moments of community activation.",
      },
      {
        value: "Flexible",
        label: "Contribution model",
        description: "Sponsors can support a single campaign, a programme stream, or a broader growth area.",
      },
      {
        value: "Impact-led",
        label: "Why it matters",
        description: "The route helps turn goodwill into practical support with a clearer outcomes story.",
      },
    ],
    overviewCards: [
      {
        title: "Scholarship support",
        description: "Funding can remove tuition or participation barriers for learners who are ready but under-resourced.",
        icon: "🎓",
        bullets: [
          "Supports access where cost is the main blocker.",
          "Connects sponsor support to visible learner opportunity.",
          "Works well for mission-aligned CSR or youth-focused funding priorities.",
        ],
      },
      {
        title: "Programme and cohort backing",
        description: "Sponsors can support a live programme cycle, themed learning stream, or focused public initiative.",
        icon: "📚",
        bullets: [
          "Useful when organisations want more direct alignment with a named programme.",
          "Can support delivery quality, materials, devices, or event moments.",
          "Creates clearer storytelling around what the support made possible.",
        ],
      },
      {
        title: "Campaign visibility and storytelling",
        description: "Public-facing campaigns can help organisations connect support with a wider narrative about youth opportunity.",
        icon: "📣",
        bullets: [
          "Well suited for time-bound appeals or themed fundraising moments.",
          "Supports brand alignment without centring the sponsor over the mission.",
          "Can deepen audience understanding of what the work actually changes.",
        ],
      },
      {
        title: "Longer-term ecosystem support",
        description: "Some partners want to fund not only one moment, but a more durable pathway of learning, access, and transition.",
        icon: "🌱",
        bullets: [
          "Useful for funders thinking beyond one-off visibility.",
          "Can connect to schools, cohorts, stories, or entrepreneurship outcomes.",
          "Builds a stronger platform for sustained impact rather than isolated gestures.",
        ],
      },
    ],
    howItWorks: [
      {
        number: "01",
        title: "Clarify sponsor intent",
        description: "We identify whether the organisation wants to support access, visibility, a live campaign, or a broader programme area.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Shape the sponsorship fit",
        description: "The route is framed around the most relevant programme, campaign, or support mechanism.",
        icon: "🪄",
      },
      {
        number: "03",
        title: "Activate and communicate",
        description: "Support is deployed and paired with a clearer story about what the sponsorship enables.",
        icon: "📢",
      },
      {
        number: "04",
        title: "Reflect on outcomes",
        description: "Partners receive a more grounded sense of what their support helped unlock and where deeper collaboration could go next.",
        icon: "📊",
      },
    ],
    caseStudies: [
      {
        title: "Scholarship-led access for a new intake",
        organisationType: "Representative CSR sponsorship",
        summary: "A funding partner wanted to focus on reducing cost barriers rather than only supporting a public event moment.",
        outcome: "The contribution was framed around learner access and created a more tangible link between sponsorship and participation.",
        highlight: "Sponsors often get the strongest story when support is tied to a real barrier being removed.",
      },
      {
        title: "Campaign support around a high-visibility cohort moment",
        organisationType: "Representative brand partnership",
        summary: "An organisation wanted its support to connect with a public-facing intake and stronger storytelling momentum.",
        outcome: "The sponsorship gained clearer visibility while still reinforcing the learner-centred mission of the campaign.",
        highlight: "The right sponsorship structure balances partner visibility with authentic programme value.",
      },
    ],
    pricingHeadline: "Ways sponsors often engage",
    pricingDescription:
      "Sponsorships are not fixed products, but these support frames help partners understand the types of commitments that are possible.",
    packages: [
      {
        name: "Campaign Supporter",
        price: "Flexible contribution",
        description: "Ideal for organisations that want to support one visible moment, appeal, or event-linked activation.",
        features: [
          "Campaign-aligned sponsorship fit",
          "Visibility conversation",
          "Impact framing",
          "Post-campaign reflection",
        ],
      },
      {
        name: "Programme Sponsor",
        price: "Flexible contribution",
        description: "A stronger fit for partners who want to support a cohort, scholarship pool, or ongoing programme pathway.",
        features: [
          "Named programme alignment",
          "Deeper mission fit",
          "Learner-outcome narrative",
          "Longer-term collaboration potential",
        ],
      },
    ],
    faqs: [
      {
        question: "Can sponsorship be tied to scholarships specifically?",
        answer: "Yes. Scholarship and access-focused support is one of the clearest and most practical sponsorship routes.",
      },
      {
        question: "Do sponsors have to support only one campaign?",
        answer: "No. Some partners prefer a single moment, while others want a wider programme or longer-term relationship.",
      },
      {
        question: "Can smaller organisations still participate?",
        answer: "Yes. The right sponsorship structure depends more on fit and intent than on organisation size alone.",
      },
    ],
    contactCta: {
      heading: "Support the work in a way that connects clearly to outcomes",
      description:
        "If your organisation wants to fund access, cohorts, campaigns, or ecosystem growth, we can help shape the most credible and useful route.",
      email: "info@itforyouthghana.org",
      primary: { label: "Start a sponsorship conversation", href: "/contact" },
      secondary: { label: "Donate now", href: "/donate" },
    },
    related: [
      {
        href: "/donate",
        eyebrow: "Support",
        title: "Donate",
        description: "See the public giving route that complements organisation-led sponsorship conversations.",
      },
      {
        href: "/our-impact/reports",
        eyebrow: "Impact",
        title: "Impact Reports",
        description: "Explore the outcomes language and mission context behind sponsorship decisions.",
      },
      {
        href: "/partner-with-us/ngo-foundations",
        eyebrow: "Partner",
        title: "NGOs & Foundations",
        description: "A related route for institutions thinking about broader strategic collaboration.",
      },
    ],
  }),
  buildOrganisationServicePage({
    slug: "hire-graduates",
    eyebrow: "For organisations",
    title: "Hire Our Graduates",
    description:
      "A route for employers seeking emerging talent from ITFY pathways and wanting a more human, grounded way to connect with early-stage digital professionals.",
    tagline:
      "Meet developing talent with practical exposure, growing portfolios, and the support structures to keep maturing well.",
    heroImage: "/images/randomPictures/maingraduationpic.jpg",
    stats: [
      {
        value: "Emerging",
        label: "Talent stage",
        description: "This route is built for employers who value growth potential, not only polished senior profiles.",
      },
      {
        value: "Portfolio-led",
        label: "Candidate story",
        description: "Learners often show promise through projects, practice, and applied cohort work.",
      },
      {
        value: "Inclusive",
        label: "Hiring opportunity",
        description: "The route can help widen access to talent beyond the most traditional pipelines.",
      },
      {
        value: "Bridge-building",
        label: "Best fit",
        description: "Useful for teams ready to mentor, onboard well, and shape early-career growth intentionally.",
      },
    ],
    overviewCards: [
      {
        title: "Employer need alignment",
        description: "We start by understanding the kinds of roles, support levels, and growth expectations the employer has in mind.",
        icon: "🎯",
        bullets: [
          "Clarifies whether the fit is internship, project-based, or early-career hiring.",
          "Surfaces what the employer values most: technical skills, potential, communication, or portfolio quality.",
          "Helps avoid mismatching role demands and learner stage.",
        ],
      },
      {
        title: "Talent introduction",
        description: "The route is designed to connect employers with promising learners in a more contextual way than a cold pipeline.",
        icon: "🤝",
        bullets: [
          "Introductions can be framed around role fit and learning trajectory.",
          "Useful for teams willing to invest in emerging talent potential.",
          "Supports a more relational approach to hiring conversations.",
        ],
      },
      {
        title: "Portfolio and readiness signals",
        description: "Employers often need help interpreting early-stage work. We help surface the signals that matter most.",
        icon: "🗂️",
        bullets: [
          "Looks at projects, practice, and participation more holistically.",
          "Supports evaluation beyond polished CV language alone.",
          "Helps teams identify where mentorship can unlock faster growth.",
        ],
      },
      {
        title: "Pathway-building",
        description: "The strongest outcomes happen when hiring is treated as part of a broader inclusive talent-development strategy.",
        icon: "🚀",
        bullets: [
          "Can connect to internships, volunteering, mentoring, or staff engagement.",
          "Builds stronger retention potential through better expectation setting.",
          "Turns one hire into a deeper relationship with the wider ecosystem.",
        ],
      },
    ],
    howItWorks: [
      {
        number: "01",
        title: "Define the role context",
        description: "We clarify the type of opportunity, the support environment, and what a strong early-stage fit would look like.",
        icon: "🧾",
      },
      {
        number: "02",
        title: "Review learner fit",
        description: "Candidate alignment is considered with skill level, growth potential, and practical readiness in mind.",
        icon: "🔍",
      },
      {
        number: "03",
        title: "Make introductions",
        description: "The organisation is connected with learners whose pathway and potential match the role context well.",
        icon: "📨",
      },
      {
        number: "04",
        title: "Support the transition",
        description: "The conversation can extend into expectations, onboarding, and broader ecosystem connection where useful.",
        icon: "🌉",
      },
    ],
    caseStudies: [
      {
        title: "Early-career design talent for a growing team",
        organisationType: "Representative product-focused employer",
        summary: "A team wanted junior design support but also needed candidates with the confidence to keep learning quickly on the job.",
        outcome: "The fit conversation centred on portfolio signals, coachability, and role support rather than unrealistic senior expectations.",
        highlight: "Employers often find stronger matches when they hire for trajectory, not just polish.",
      },
      {
        title: "Inclusive hiring through a portfolio-first lens",
        organisationType: "Representative SME hiring pathway",
        summary: "The employer needed a way to spot potential beyond formal credentials alone.",
        outcome: "The pathway helped surface promising candidates through project work and applied learning signals.",
        highlight: "Inclusive hiring gets stronger when portfolios and growth potential are taken seriously.",
      },
    ],
    faqs: [
      {
        question: "Are these graduates job-ready or still learning?",
        answer: "Both can be true. This route is strongest for employers who understand emerging talent and are ready to support early-career growth well.",
      },
      {
        question: "Can this route support internships as well as employment?",
        answer: "Yes. Internship, project-based, and early-career opportunities can all make sense depending on the employer context.",
      },
      {
        question: "Do employers have to already know exactly what role they need?",
        answer: "No. Part of the conversation can help clarify the most realistic entry point for both the employer and the learner.",
      },
    ],
    contactCta: {
      heading: "Build a stronger bridge between talent potential and real opportunity",
      description:
        "If your team is open to early-career talent and can provide thoughtful onboarding, this route can help you hire with more confidence and context.",
      email: "info@itforyouthghana.org",
      primary: { label: "Talk about hiring", href: "/contact" },
      secondary: { label: "See impact stories", href: "/our-impact/testimonials" },
    },
    related: [
      {
        href: "/for-organisations/staff-volunteering",
        eyebrow: "Support",
        title: "Staff Volunteering",
        description: "Mentoring and volunteering can complement talent hiring by strengthening the wider pipeline.",
      },
      {
        href: "/apply-for-training",
        eyebrow: "Pipeline",
        title: "Apply for Training",
        description: "See the learner-facing route that feeds into future employability and transition outcomes.",
      },
      {
        href: "/our-impact/testimonials",
        eyebrow: "Stories",
        title: "Testimonials",
        description: "Explore how learners describe the transition from training into opportunity.",
      },
    ],
  }),
  buildOrganisationServicePage({
    slug: "staff-volunteering",
    eyebrow: "For organisations",
    title: "Staff Volunteering",
    description:
      "Structured ways for teams to mentor, teach, judge, and contribute practical skills through ITFY programmes without turning volunteering into an afterthought.",
    tagline:
      "Create staff-engagement opportunities that are useful to learners, energising for teams, and well-scoped enough to work.",
    heroImage: "/images/randomPictures/groupworkstudents.jpg",
    stats: [
      {
        value: "Structured",
        label: "Volunteer design",
        description: "Good volunteering needs clear roles, context, and expectations rather than vague enthusiasm.",
      },
      {
        value: "Skills-based",
        label: "Best fit",
        description: "Strongest when staff bring lived professional knowledge that can help learners practically.",
      },
      {
        value: "Flexible",
        label: "Formats",
        description: "Support can include workshops, mentoring, judging, coaching, or one-off programme moments.",
      },
      {
        value: "Mutual",
        label: "Value",
        description: "Learners benefit from exposure and guidance, while staff gain meaningful service and reflection opportunities.",
      },
    ],
    overviewCards: [
      {
        title: "Mentoring and coaching",
        description: "Staff can support learners through focused advice, encouragement, and perspective from real work environments.",
        icon: "🫶",
        bullets: [
          "Useful for confidence-building and transition questions.",
          "Works best when mentors have clear time boundaries and role expectations.",
          "Can sit alongside employability or challenge-focused activity.",
        ],
      },
      {
        title: "Workshops and guest sessions",
        description: "Teams can contribute live knowledge in short formats that expand what learners think is possible.",
        icon: "🎤",
        bullets: [
          "Best for practical topics, industry perspective, or applied skill translation.",
          "Strong when sessions are interactive and grounded in real work examples.",
          "Can complement formal training or public programme moments.",
        ],
      },
      {
        title: "Judging and challenge support",
        description: "Staff can help assess ideas, give feedback, or support showcase events and project-based learning moments.",
        icon: "🏁",
        bullets: [
          "Adds credibility and external perspective to learner work.",
          "Works well for hackathons, showcases, and pitch sessions.",
          "Helps learners practice presenting to real-world audiences.",
        ],
      },
      {
        title: "Team engagement pathways",
        description: "Volunteering can be shaped as a meaningful internal culture experience, not just a one-off CSR checkbox.",
        icon: "👥",
        bullets: [
          "Useful for teams that want service to feel purposeful and organised.",
          "Can grow from one event into a recurring engagement rhythm.",
          "Pairs well with sponsorship or hiring conversations over time.",
        ],
      },
    ],
    howItWorks: [
      {
        number: "01",
        title: "Match the volunteering format",
        description: "We clarify whether the team is best suited for mentoring, workshops, judging, or another support role.",
        icon: "🧭",
      },
      {
        number: "02",
        title: "Scope expectations",
        description: "Roles, time commitment, audience, and support boundaries are defined so the volunteering is practical for everyone.",
        icon: "📋",
      },
      {
        number: "03",
        title: "Deliver the engagement",
        description: "The activity is run in a way that keeps learner value central while still making the team feel genuinely useful.",
        icon: "🤲",
      },
      {
        number: "04",
        title: "Reflect and deepen",
        description: "After the engagement, both sides can assess what worked and whether a stronger long-term relationship makes sense.",
        icon: "🌱",
      },
    ],
    caseStudies: [
      {
        title: "Mentor energy channelled into a clearer format",
        organisationType: "Representative staff-engagement team",
        summary: "A company wanted employees to give back, but needed a structure that respected staff time and learner needs.",
        outcome: "A scoped volunteering format made the engagement more useful, more sustainable, and easier to repeat.",
        highlight: "Volunteering works best when the format is designed, not improvised.",
      },
      {
        title: "Challenge-day judging with stronger feedback loops",
        organisationType: "Representative industry partner",
        summary: "Professionals were brought into a showcase moment to assess learner ideas and offer grounded external perspective.",
        outcome: "Learners gained more credible feedback, and the partner team saw a clearer route into deeper engagement.",
        highlight: "Short engagements can still create meaningful value when they are well-framed.",
      },
    ],
    faqs: [
      {
        question: "Does volunteering have to be a large team activity?",
        answer: "No. It can be built around a few committed staff members or a wider team depending on the format and timing.",
      },
      {
        question: "Can volunteering connect to sponsorship or hiring later?",
        answer: "Yes. Staff volunteering often becomes a strong entry point into deeper partnership or talent conversations.",
      },
      {
        question: "What makes a volunteering engagement successful?",
        answer: "Clear scoping, role clarity, realistic time expectations, and a format that genuinely helps learners rather than only looking good externally.",
      },
    ],
    contactCta: {
      heading: "Turn good intentions into a volunteering format that actually works",
      description:
        "If your team wants to mentor, teach, judge, or contribute skills through ITFY Ghana, we can help shape a route that is structured, useful, and realistic.",
      email: "info@itforyouthghana.org",
      primary: { label: "Plan a volunteering route", href: "/contact" },
      secondary: { label: "Explore sponsorships", href: "/for-organisations/sponsorships" },
    },
    related: [
      {
        href: "/for-organisations/corporate-training",
        eyebrow: "Training",
        title: "Corporate Training",
        description: "Some teams pair staff engagement with internal learning or institution-facing training support.",
      },
      {
        href: "/for-organisations/hire-graduates",
        eyebrow: "Talent",
        title: "Hire Our Graduates",
        description: "Volunteering can become a natural bridge into internship or hiring conversations later.",
      },
      {
        href: "/partner-with-us",
        eyebrow: "Partner",
        title: "Partner With Us",
        description: "Explore the broader institutional partnership routes that connect to long-term collaboration.",
      },
    ],
  }),
];
