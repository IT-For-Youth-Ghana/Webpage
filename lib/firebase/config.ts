import type { FirebaseScaffoldSettings } from "@/types/firebase";

export const firebaseScaffoldConfig: FirebaseScaffoldSettings = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};
