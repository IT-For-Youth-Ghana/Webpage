import { getAdminFirestore } from "@/lib/firebase/admin";
import { contactPageContent as seedContact } from "@/lib/content/contact-config";
import type { ContactPageContent } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Reads the contact page content from siteContent collection (slug: "contact").
 * Falls back to static seed content on empty/missing/error.
 */
export async function getCmsContactPage(): Promise<ContactPageContent> {
  const db = await getAdminFirestore();
  if (!db) return seedContact;

  try {
    const collection = db.collection(FIREBASE_COLLECTIONS.siteContent);

    // Try direct doc id
    const direct = await collection.doc("contact").get();
    if (direct.exists) {
      return { ...seedContact, ...(direct.data() as Partial<ContactPageContent>) };
    }

    // Try slug query
    const bySlug = await collection.where("slug", "==", "contact").limit(1).get();
    if (!bySlug.empty) {
      return { ...seedContact, ...(bySlug.docs[0].data() as Partial<ContactPageContent>) };
    }

    return seedContact;
  } catch (e) {
    console.error("Contact page read failed. Falling back to seed content.", e);
    return seedContact;
  }
}
