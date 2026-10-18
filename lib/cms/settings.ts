import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";
import { contactPageContent } from "@/lib/content/contact-config";

export type CmsSocialLink = {
  label: string;
  href: string;
  network?: "facebook" | "twitter" | "linkedin" | "instagram" | "youtube" | string;
};

export type CmsPublicSettings = {
  siteTitle?: string;
  siteDescription?: string;
  defaultOgImage?: string;
  logoUrl?: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
  };
  socials: CmsSocialLink[];
};

const FALLBACK_SETTINGS: CmsPublicSettings = {
  siteTitle: "IT For Youth Ghana",
  siteDescription:
    "Empowering Ghanaian youth with digital skills and the confidence to shape tomorrow's economy.",
  logoUrl: "/Asset-1.png",
  contact: {
    email: contactPageContent.channels.find((c) => c.label === "Email")?.value || "info@itforyouthghana.org",
    phone: contactPageContent.channels.find((c) => c.label === "Phone")?.value || "+233 596 244 834",
    location: contactPageContent.channels.find((c) => c.label === "Location")?.value || "Accra, Ghana",
  },
  socials: [
    { label: "Facebook", href: "https://facebook.com", network: "facebook" },
    { label: "Twitter / X", href: "https://twitter.com", network: "twitter" },
    { label: "LinkedIn", href: "https://linkedin.com", network: "linkedin" },
    { label: "Instagram", href: "https://instagram.com", network: "instagram" },
    { label: "YouTube", href: "https://youtube.com", network: "youtube" },
  ],
};

export async function getCmsSettings(): Promise<CmsPublicSettings> {
  const db = await getAdminFirestore();
  if (!db) return FALLBACK_SETTINGS;

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.settings).doc("main").get();
    if (!doc.exists) return FALLBACK_SETTINGS;

    const data = (doc.data() ?? {}) as Record<string, unknown>;
    const contact = (data.contact as Record<string, unknown>) || {};
    const socials = Array.isArray(data.socials) ? (data.socials as CmsSocialLink[]) : FALLBACK_SETTINGS.socials;

    return {
      siteTitle: (data.siteTitle as string) || FALLBACK_SETTINGS.siteTitle,
      siteDescription: (data.siteDescription as string) || FALLBACK_SETTINGS.siteDescription,
      defaultOgImage: (data.defaultOgImage as string) || FALLBACK_SETTINGS.defaultOgImage,
      logoUrl: (data.logoUrl as string) || FALLBACK_SETTINGS.logoUrl,
      contact: {
        email: (contact.email as string) || FALLBACK_SETTINGS.contact.email,
        phone: (contact.phone as string) || FALLBACK_SETTINGS.contact.phone,
        location: (contact.location as string) || FALLBACK_SETTINGS.contact.location,
      },
      socials: socials && socials.length ? socials : FALLBACK_SETTINGS.socials,
    };
  } catch (e) {
    console.error("Settings read failed.", e);
    return FALLBACK_SETTINGS;
  }
}
