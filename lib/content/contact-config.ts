import type { ContactPageContent } from "@/types/content";

export const contactPageContent: ContactPageContent = {
  eyebrow: "Contact",
  title: "Start the right conversation with the ITFY team",
  description:
    "Reach IT For Youth Ghana for training enquiries, organisation services, partnerships, media requests, volunteering, donor conversations, and general support.",
  heroImage: "/images/randomPictures/groupworkstudents.jpg",
  channelsEyebrow: "Direct channels",
  channelsTitle: "Use the fastest route when you already know what you need",
  channelsDescription: "The form below is best for routing context. These direct channels remain visible for people who need a simpler first step.",
  formEyebrow: "Enquiry form",
  formTitle: "Give the team enough context to route your message well",
  formDescription: "Share the details that will help the team understand what you need and who should respond.",
  messageEyebrow: "Message",
  messageTitle: "Send an enquiry",
  messageDescription: "Choose the closest route, add context, and the team will use it to follow up clearly.",
  privacyTitle: "Privacy and routing",
  routesEyebrow: "Before you write",
  routesTitle: "Some questions already have a better front door",
  routesDescription: "These routes help learners, organisations, partners, and donors self-serve before sending a message.",
  emailCtaLabel: "Email the team",
  formCtaLabel: "Use the form",
  stats: [
    {
      value: "7",
      label: "Enquiry routes",
      description: "The form sorts requests by intent so the right team can respond.",
      icon: "01",
    },
    {
      value: "48h",
      label: "Response goal",
      description: "Seed copy sets a clear expectation for non-urgent enquiries.",
      icon: "02",
    },
    {
      value: "Accra",
      label: "Ghana base",
      description: "The public route keeps local contact context visible.",
      icon: "03",
    },
  ],
  channels: [
    {
      label: "Email",
      value: "info@itforyouthghana.org",
      description: "Best for programme, partnership, donor, and media enquiries.",
      href: "mailto:info@itforyouthghana.org",
    },
    {
      label: "Phone",
      value: "+233 596 244 834",
      description: "Useful when a conversation needs faster clarification.",
      href: "tel:+233596244834",
    },
    {
      label: "Location",
      value: "Accra, Ghana",
      description: "ITFY works with learners, schools, partners, and communities from Ghana outward.",
      href: "https://maps.google.com/?q=Accra%2C%20Ghana",
    },
  ],
  enquiryOptions: [
    {
      value: "training",
      label: "Training or courses",
      description: "Applications, course fit, cohorts, eligibility, and learner support.",
    },
    {
      value: "organisation",
      label: "For organisations",
      description: "Corporate training, sponsorships, hiring graduates, or staff volunteering.",
    },
    {
      value: "partnership",
      label: "Partnership",
      description: "Schools, government, NGOs, foundations, development partners, or technology partners.",
    },
    {
      value: "donation",
      label: "Donation or sponsorship",
      description: "Giving, campaign support, devices, scholarships, or recurring contribution routes.",
    },
    {
      value: "media",
      label: "Media request",
      description: "Press, speaking, interviews, public updates, or story requests.",
    },
    {
      value: "volunteering",
      label: "Volunteering",
      description: "Mentorship, event support, facilitation, and community activation.",
    },
    {
      value: "general",
      label: "General enquiry",
      description: "Anything else the team should route after reading your message.",
    },
  ],
  responseSteps: [
    {
      number: "01",
      title: "Route",
      description:
        "Your enquiry type helps the team understand whether the message belongs with programmes, partnerships, operations, or leadership.",
    },
    {
      number: "02",
      title: "Review",
      description:
        "The team reviews the message, checks the context, and routes it to the person best placed to respond.",
    },
    {
      number: "03",
      title: "Respond",
      description:
        "The public expectation is a thoughtful reply within two working days for non-urgent messages.",
    },
  ],
  routeCards: [
    {
      href: "/apply-for-training",
      eyebrow: "Learners",
      title: "Apply for training",
      description: "Explore training routes before sending a course-specific question.",
    },
    {
      href: "/for-organisations",
      eyebrow: "Services",
      title: "For organisations",
      description: "Corporate teams can review service routes before opening a conversation.",
    },
    {
      href: "/partner-with-us",
      eyebrow: "Partners",
      title: "Partner With Us",
      description: "Schools, NGOs, foundations, and technology partners can choose a clearer track.",
    },
    {
      href: "/donate",
      eyebrow: "Support",
      title: "Donate",
      description: "See giving options and campaign context before asking a donor question.",
    },
  ],
  privacyNote:
    "Your message is used to respond to your enquiry and route it internally. We only keep the details needed to follow up responsibly.",
};
