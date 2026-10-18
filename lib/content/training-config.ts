import type { Course } from "@/types/course";
import type {
  TrainingCatalogContent,
  TrainingEligibilityContent,
  TrainingHowItWorksContent,
  TrainingLandingContent,
} from "@/types/content";

const trainingStats = [
  {
    value: "6+",
    label: "Live pathways",
    description: "Structured learning options spanning coding, design, data, and career readiness.",
    icon: "🧭",
  },
  {
    value: "3",
    label: "Cohorts ahead",
    description: "Upcoming intakes already mapped so learners can plan around school, work, or travel.",
    icon: "📅",
  },
  {
    value: "Hybrid",
    label: "Flexible delivery",
    description: "In-person energy with formats that can still support broader access.",
    icon: "💡",
  },
  {
    value: "Supportive",
    label: "Learner journey",
    description: "Practical teaching, guidance, and clear next steps from application to onboarding.",
    icon: "🤝",
  },
] as const;

export const trainingCohorts = [
  {
    id: "cohort-8-foundations",
    name: "Cohort 8 Foundations",
    startDate: "2026-07-01",
    applicationDeadline: "2026-06-20",
    summary:
      "A flagship intake for learners starting with core software, design, and digital work skills.",
    format: "Hybrid",
    duration: "12 weeks",
    location: "Accra and online support",
    status: "open",
  },
  {
    id: "creative-tech-sprint",
    name: "Creative Tech Sprint",
    startDate: "2026-07-20",
    applicationDeadline: "2026-06-26",
    summary:
      "A shorter skills sprint for learners testing UX, digital storytelling, and product thinking.",
    format: "In-person",
    duration: "6 weeks",
    location: "Accra",
    status: "upcoming",
  },
  {
    id: "career-launch-lab",
    name: "Career Launch Lab",
    startDate: "2026-08-17",
    applicationDeadline: "2026-07-24",
    summary:
      "Portfolio, communication, and employability support for learners close to transition points.",
    format: "Hybrid",
    duration: "4 weeks",
    location: "Accra and remote coaching",
    status: "upcoming",
  },
] satisfies TrainingCatalogContent["cohorts"];

export const trainingProcessSteps = [
  {
    number: "01",
    title: "Choose your route",
    description:
      "Start by finding the course or cohort that matches your stage, interests, schedule, and confidence level.",
    icon: "🧭",
  },
  {
    number: "02",
    title: "Apply with context",
    description:
      "Share basic background, motivation, and availability so the team can understand your fit and support needs.",
    icon: "📝",
  },
  {
    number: "03",
    title: "Review and confirm",
    description:
      "Applications are reviewed, shortlisted learners are contacted, and final places are confirmed before onboarding.",
    icon: "✅",
  },
  {
    number: "04",
    title: "Join the cohort",
    description:
      "Accepted learners receive orientation details, start dates, and expectations for the next learning cycle.",
    icon: "🚀",
  },
] satisfies TrainingCatalogContent["process"];

export const seedTrainingCourses: Course[] = [
  {
    id: "frontend-web-development",
    slug: "frontend-web-development",
    title: "Front-End Web Development Foundations",
    description:
      "Build confidence with HTML, CSS, JavaScript, and modern interface thinking through practical, project-based sessions.",
    shortDescription:
      "A practical entry route into building responsive web experiences and understanding front-end fundamentals.",
    category: "Software Development",
    level: "Beginner",
    duration: "12 weeks",
    deliveryMode: "Hybrid",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    pricing: { amount: 0, currency: "GHS", isFree: true },
    tags: ["HTML", "CSS", "JavaScript", "Responsive design"],
    applyUrl: "https://portal.itforyouthghana.org?course=frontend-web-development",
    startDate: "2026-06-15",
  },
  {
    id: "ux-design-essentials",
    slug: "ux-design-essentials",
    title: "UX Design Essentials",
    description:
      "Learn research, wireframing, user journeys, and design critique through accessible product design exercises.",
    shortDescription:
      "An introduction to UX research, prototyping, and thoughtful digital product design.",
    category: "Design",
    level: "Beginner",
    duration: "10 weeks",
    deliveryMode: "In-person",
    image: "/images/randomPictures/UXcours.jpg",
    pricing: { amount: 350, currency: "GHS", isFree: false },
    tags: ["User research", "Wireframing", "Figma", "Product thinking"],
    applyUrl: "https://portal.itforyouthghana.org?course=ux-design-essentials",
    startDate: "2026-07-20",
  },
  {
    id: "data-analytics-essentials",
    slug: "data-analytics-essentials",
    title: "Data Analytics Essentials",
    description:
      "Move from raw information to insight using spreadsheets, dashboards, and core analysis habits that employers value.",
    shortDescription:
      "A skills path for learners who want to interpret data, spot patterns, and communicate insights clearly.",
    category: "Data",
    level: "Intermediate",
    duration: "8 weeks",
    deliveryMode: "Hybrid",
    image: "/images/randomPictures/studentpresenting.jpg",
    pricing: { amount: 450, currency: "GHS", isFree: false },
    tags: ["Excel", "Dashboards", "Data storytelling"],
    applyUrl: "https://portal.itforyouthghana.org?course=data-analytics-essentials",
    startDate: "2026-08-17",
  },
  {
    id: "digital-marketing-content",
    slug: "digital-marketing-content",
    title: "Digital Marketing and Content Strategy",
    description:
      "Explore online audience growth, campaign planning, and storytelling formats for mission-driven and commercial work.",
    shortDescription:
      "A route into digital visibility, messaging, and content systems for growing brands and ideas.",
    category: "Marketing",
    level: "Beginner",
    duration: "6 weeks",
    deliveryMode: "Online",
    image: "/images/randomPictures/petertalkingtostudentscoloful.jpg",
    pricing: { amount: 0, currency: "GHS", isFree: true },
    tags: ["Content", "Social media", "Campaign planning"],
    applyUrl: "https://portal.itforyouthghana.org?course=digital-marketing-content",
    startDate: "2026-06-29",
  },
  {
    id: "python-problem-solving",
    slug: "python-problem-solving",
    title: "Python for Problem Solving",
    description:
      "Use Python to strengthen logic, automation, and analytical thinking through guided coding practice.",
    shortDescription:
      "A next-step coding track for learners ready to move beyond basic digital fluency into programming.",
    category: "Software Development",
    level: "Intermediate",
    duration: "10 weeks",
    deliveryMode: "Hybrid",
    image: "/images/randomPictures/groupworkstudents.jpg",
    pricing: { amount: 500, currency: "GHS", isFree: false },
    tags: ["Python", "Automation", "Logic"],
    applyUrl: "https://portal.itforyouthghana.org?course=python-problem-solving",
    startDate: "2026-09-07",
  },
  {
    id: "entrepreneurship-lab",
    slug: "entrepreneurship-lab",
    title: "Entrepreneurship Lab for Digital Creators",
    description:
      "Turn skills into practical ventures through customer discovery, lean planning, and confidence-building pitch work.",
    shortDescription:
      "For learners who want to connect digital skills to business ideas, freelancing, or venture experimentation.",
    category: "Entrepreneurship",
    level: "All levels",
    duration: "6 weeks",
    deliveryMode: "In-person",
    image: "/images/randomPictures/mireiotalking.jpg",
    pricing: { amount: 0, currency: "GHS", isFree: true },
    tags: ["Pitching", "Business model", "Customer discovery"],
    applyUrl: "https://portal.itforyouthghana.org?course=entrepreneurship-lab",
    startDate: "2026-08-03",
  },
  {
    id: "career-launch-lab",
    slug: "career-launch-lab",
    title: "Career Launch Lab",
    description:
      "Shape your portfolio, communication, and job-readiness habits with coaching tied to real transition goals.",
    shortDescription:
      "A short intensive focused on employability, confidence, and presenting your work well.",
    category: "Employability",
    level: "All levels",
    duration: "4 weeks",
    deliveryMode: "Hybrid",
    image: "/images/randomPictures/graduations.jpg",
    pricing: { amount: 0, currency: "GHS", isFree: true },
    tags: ["Portfolio", "CV", "Interview skills"],
    applyUrl: "https://portal.itforyouthghana.org?course=career-launch-lab",
    startDate: "2026-08-17",
  },
  {
    id: "creative-coding-teens",
    slug: "creative-coding-teens",
    title: "Creative Coding for Teens",
    description:
      "A youth-friendly route into problem solving, design confidence, and digital expression through guided projects.",
    shortDescription:
      "An accessible first step for younger learners exploring technology through creativity and teamwork.",
    category: "Emerging Tech",
    level: "Beginner",
    duration: "8 weeks",
    deliveryMode: "In-person",
    image: "/images/randomPictures/groupofgirlsentrance.jpg",
    pricing: { amount: 300, currency: "GHS", isFree: false },
    tags: ["Creative coding", "Teamwork", "Problem solving"],
    applyUrl: "https://portal.itforyouthghana.org?course=creative-coding-teens",
    startDate: "2026-07-06",
  },
];

export const trainingLandingContent: TrainingLandingContent = {
  eyebrow: "Apply for training",
  title: "Practical tech learning paths built for where you are now",
  description:
    "Whether you are curious, restarting, or ready to specialise, IT For Youth Ghana uses cohort-based learning to help you move from interest into capability with more clarity and support.",
  heroImage: "/images/randomPictures/peterblackboard.jpg",
  stats: [...trainingStats],
  routeCards: [
    {
      href: "/apply-for-training/who-can-apply",
      eyebrow: "Eligibility",
      title: "Who Can Apply",
      description: "See the learners, age ranges, backgrounds, and motivation profiles that fit best.",
    },
    {
      href: "/apply-for-training/courses",
      eyebrow: "Catalog",
      title: "Browse Courses",
      description: "Filter live and seeded course options by category, level, and cost.",
    },
    {
      href: "/apply-for-training/how-it-works",
      eyebrow: "Process",
      title: "How It Works",
      description: "Understand the journey from application window to onboarding and cohort start.",
    },
  ],
  focusAreas: [
    {
      title: "Learning is practical, not abstract",
      description:
        "Courses are designed around projects, applied exercises, and the confidence that comes from doing real work rather than only hearing theory.",
    },
    {
      title: "Routes are built for different starting points",
      description:
        "Some learners are discovering technology for the first time, while others are sharpening direction. The catalog is meant to support both.",
    },
    {
      title: "Support matters as much as content",
      description:
        "The strongest learner journeys include guidance, orientation, clearer expectations, and pathways beyond the first course.",
    },
  ],
  supportPoints: [
    "You do not need to already feel like a tech expert to begin.",
    "Some courses are fully free, while others use modest fees or scholarship support.",
    "Cohort schedules are shared early so learners can plan around school, work, and family obligations.",
    "The broader ITFY ecosystem can connect training into clubs, challenges, entrepreneurship, and impact stories.",
  ],
  cohorts: trainingCohorts,
  process: trainingProcessSteps,
};

export const trainingCatalogContent: TrainingCatalogContent = {
  eyebrow: "Course catalog",
  title: "Find the right training pathway",
  description:
    "Compare current programmes by level, format, and focus. Cohort 8 Foundations is now open, with additional short sprints and career labs starting soon. All pathways are project-driven and designed for real progression.",
  heroImage: "/images/randomPictures/studentslistening.jpg",
  cohortsSectionEyebrow: "Upcoming cohorts",
  cohortsSectionTitle: "Cohort 8 Foundations is open. More programmes start in July and August.",
  cohortsSectionDescription:
    "Review exact dates, formats, and deadlines so you can plan your application and participation with confidence.",
  processSectionEyebrow: "How to apply",
  processSectionTitle: "Four clear steps from interest to your first class",
  processSectionDescription:
    "We keep the process transparent. Know what to prepare, when decisions happen, and what support is available before you apply.",
  highlights: [
    "Compare 6+ pathways across software development, design, data, marketing, entrepreneurship, and employability.",
    "See free options, scholarship-supported routes, and modest-fee programmes side by side.",
    "Check start dates and deadlines for Cohort 8 Foundations and upcoming short programmes.",
  ],
  cohorts: trainingCohorts,
  process: trainingProcessSteps,
};

export const trainingEligibilityContent: TrainingEligibilityContent = {
  eyebrow: "Who can apply",
  title: "This learning journey is designed for motivated learners, not only polished applicants",
  description:
    "ITFY training is strongest when the learner is ready to show up, stay engaged, and keep growing. Prior experience can help in some pathways, but commitment and fit matter more than already having everything figured out.",
  heroImage: "/images/randomPictures/studentsblueclothing.jpg",
  practiceEyebrow: "In practice",
  practiceNotes: [
    "Beginner pathways are designed to welcome serious first-time learners.",
    "Intermediate routes work best when learners can commit to practice outside class.",
    "The strongest fit is motivation plus reliability, not perfection before day one.",
  ],
  profilesSectionEyebrow: "Learner profiles",
  profilesSectionTitle: "Different routes suit different starting points",
  profilesSectionDescription:
    "Eligibility is not only about what a learner already knows. It is also about timing, commitment, and whether the course level matches what they need right now.",
  readinessSectionEyebrow: "What helps",
  readinessSectionTitle: "Readiness matters more than polish",
  readinessSectionDescription:
    "Learners do not need to arrive with a perfect story. What matters more is whether they can engage honestly with the process and commit to showing up for the cohort.",
  audienceCards: [
    {
      title: "Beginners looking for a real entry point",
      description:
        "Learners who need a first serious path into technology, especially when they have interest but not yet structure.",
      bullets: [
        "No professional tech background required for beginner routes.",
        "Curiosity, consistency, and willingness to learn are stronger signals than polish.",
        "A basic comfort using a phone or computer helps, but it does not need to be advanced.",
      ],
    },
    {
      title: "Learners ready to deepen a direction",
      description:
        "People who have touched digital skills before and now want more focus, more discipline, or a clearer pathway.",
      bullets: [
        "Intermediate tracks work best when the learner can commit time outside class.",
        "A portfolio is useful for some routes but not always required to begin.",
        "The goal is not perfection before entry, but readiness to build on a foundation.",
      ],
    },
    {
      title: "Young people navigating transition moments",
      description:
        "School leavers, graduates, and early-career youth who need stronger digital confidence, a clearer portfolio, or a practical step toward work.",
      bullets: [
        "Transition periods are often the right time for structured cohort learning.",
        "Some pathways are especially useful when you are between school and work decisions.",
        "Attendance reliability matters because cohort momentum affects everyone.",
      ],
    },
  ],
  readinessPoints: [
    "You do not need to know everything before you apply, but you should be honest about your availability and goals.",
    "Some courses may prioritise applicants who can attend consistently and complete project work.",
    "Where fees exist, scholarship pathways and support campaigns may sometimes reduce barriers for the right learners.",
    "If one course is not the right fit yet, another route in the ecosystem may still be the right entry point.",
  ],
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle: "Once the fit feels clearer, keep moving",
  nextStepsSectionDescription:
    "The next best step is usually to browse the course catalog or understand the application sequence for Cohort 8.",
  nextSteps: [
    {
      href: "/apply-for-training/courses",
      eyebrow: "Next step",
      title: "Browse Courses",
      description: "See which live and seeded pathways fit your current stage and schedule.",
    },
    {
      href: "/apply-for-training/how-it-works",
      eyebrow: "Process",
      title: "How It Works",
      description: "Understand what happens after you submit an application.",
    },
    {
      href: "/contact",
      eyebrow: "Support",
      title: "Ask a Question",
      description: "Reach the team if you are unsure which route is right for you.",
    },
  ],
};

export const trainingHowItWorksContent: TrainingHowItWorksContent = {
  eyebrow: "How it works",
  title: "A clearer learner journey from first application to first class",
  description:
    "The process is designed to reduce confusion. Learners should be able to understand what to prepare, when decisions are made, and how onboarding works before the cohort begins.",
  heroImage: "/images/randomPictures/studentslisteningfrontal.JPG",
  heroAsideEyebrow: "Why this matters",
  heroAsideText:
    "When learners know the sequence ahead of time, they can prepare better, reduce anxiety, and make stronger decisions about whether to apply now or wait for a better-fit cohort.",
  processSectionEyebrow: "Apply process",
  processSectionTitle: "Four steps, one clearer journey",
  processSectionDescription:
    "The process below mirrors the same logic used on the course listing page, but gives learners a fuller explanation of what each stage is meant to do.",
  process: trainingProcessSteps,
  timelineSectionEyebrow: "Timeline",
  timelineSectionTitle: "What the process usually looks like in practice",
  timelineSectionDescription:
    "Exact dates shift by cohort, but the overall sequence stays consistent enough that learners can plan with confidence.",
  timeline: [
    {
      label: "Application window",
      title: "Applications open with a defined deadline",
      description:
        "Learners submit interest during a visible window rather than guessing when places might be available.",
    },
    {
      label: "Review period",
      title: "The team reviews fit, readiness, and availability",
      description:
        "Applications are looked at with the course level, learner goals, and cohort capacity in mind.",
    },
    {
      label: "Confirmation",
      title: "Shortlisted learners receive next-step communication",
      description:
        "This can include confirmation, timing details, payment instructions where relevant, or waitlist updates.",
    },
    {
      label: "Orientation",
      title: "Accepted learners are prepared for a strong start",
      description:
        "Orientation helps learners understand attendance expectations, tools, schedules, and how to get support.",
    },
  ],
  prepareSectionEyebrow: "Prepare well",
  prepareSectionTitle: "Small preparation steps make the process smoother",
  prepareSectionDescription:
    "Most friction in application flows comes from uncertainty. These simple preparation steps help learners submit with more confidence and fewer surprises.",
  checklist: [
    "Know which pathway you are interested in and why it fits your current goals.",
    "Check that the cohort timing works with school, work, and family obligations.",
    "Prepare to share your motivation honestly, even if you are still early in your journey.",
    "Read the course notes carefully so you understand whether it is free, paid, beginner-friendly, or more advanced.",
  ],
  nextStepsSectionEyebrow: "Next steps",
  nextStepsSectionTitle: "Keep moving while the decision is still fresh",
  nextStepsSectionDescription:
    "Once the process makes sense, the next useful move is either choosing a pathway or checking whether the fit is right before you apply.",
  nextSteps: [
    {
      href: "/apply-for-training/courses",
      eyebrow: "Catalog",
      title: "Choose a Course",
      description: "Filter the available pathways and start from the route that feels most realistic now.",
    },
    {
      href: "/apply-for-training/who-can-apply",
      eyebrow: "Eligibility",
      title: "Check Your Fit",
      description: "Read the learner profiles and readiness notes before you apply.",
    },
    {
      href: "/contact",
      eyebrow: "Questions",
      title: "Talk to the Team",
      description: "Ask about timing, fees, or which route makes the most sense for you.",
    },
  ],
};
