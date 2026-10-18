export const FIREBASE_COLLECTIONS = {
  homepage: "homepage",
  initiatives: "initiatives",
  forOrganisations: "forOrganisations",
  partnerships: "partnerships",
  articles: "articles",
  newsPages: "newsPages",
  departments: "departments",
  team: "team",
  partners: "partners",
  testimonials: "testimonials",
  jobListings: "jobListings",
  impactStats: "impactStats",
  impactPages: "impactPages",
  siteContent: "siteContent",
  applications: "applications",
  contactMessages: "contactMessages",
  newsletterSubs: "newsletterSubs",
  users: "users",
  auditLog: "auditLog",
  settings: "settings",
  trainingCohorts: "trainingCohorts",
} as const;

export type FirebaseCollection = keyof typeof FIREBASE_COLLECTIONS;

export interface FirebaseScaffoldSettings {
  projectId?: string;
  storageBucket?: string;
  authDomain?: string;
}

export interface RevalidationPayload {
  paths: string[];
  secret?: string;
}
