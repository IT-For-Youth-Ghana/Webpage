import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type AdminSdkStatus = {
  configured: boolean;
  projectId?: string;
  clientEmail?: string;
  hasPrivateKey: boolean;
  warnings: string[];
};

let adminAppPromise: Promise<App | null> | null = null;
let cachedServiceAccount: ServiceAccount | null | undefined;

function loadServiceAccount(): ServiceAccount | null {
  if (cachedServiceAccount !== undefined) {
    return cachedServiceAccount;
  }

  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!encoded) {
    cachedServiceAccount = null;
    return cachedServiceAccount;
  }

  try {
    const json = Buffer.from(encoded, "base64").toString("utf8");
    const parsed = JSON.parse(json) as Partial<ServiceAccount>;

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      cachedServiceAccount = null;
      return cachedServiceAccount;
    }

    // JSON.parse already turns the "\n" escapes in the downloaded key file
    // into real newlines, so no manual replace() is needed here.
    cachedServiceAccount = {
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  } catch {
    cachedServiceAccount = null;
  }

  return cachedServiceAccount;
}

function getStorageBucket() {
  return process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
}

function getAdminWarnings(serviceAccount: ServiceAccount | null) {
  const warnings: string[] = [];

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    warnings.push("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set.");
  } else if (!serviceAccount) {
    warnings.push(
      "FIREBASE_SERVICE_ACCOUNT_BASE64 is set but could not be decoded as valid service account JSON (check it's base64 of the full key file, with no surrounding quotes).",
    );
  }

  if (process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY) {
    warnings.push(
      "Remove NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL / NEXT_PUBLIC_FIREBASE_PRIVATE_KEY — service account fields should never be exposed to the client bundle.",
    );
  }

  return warnings;
}

export function getAdminSdkStatus(): AdminSdkStatus {
  const serviceAccount = loadServiceAccount();

  return {
    configured: Boolean(serviceAccount),
    projectId: serviceAccount?.project_id,
    clientEmail: serviceAccount?.client_email,
    hasPrivateKey: Boolean(serviceAccount?.private_key),
    warnings: getAdminWarnings(serviceAccount),
  };
}

export async function getFirebaseAdminApp(): Promise<App | null> {
  const serviceAccount = loadServiceAccount();

  if (!serviceAccount) {
    return null;
  }

  if (adminAppPromise) {
    return adminAppPromise;
  }

  adminAppPromise = (async () => {
    const { cert, getApps, initializeApp } = await import("firebase-admin/app");

    const existingApp = getApps()[0];
    if (existingApp) {
      return existingApp;
    }

    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      storageBucket: getStorageBucket(),
    });
  })();

  return adminAppPromise;
}

export async function getAdminAuth(): Promise<Auth | null> {
  const app = await getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  const { getAuth } = await import("firebase-admin/auth");

  return getAuth(app);
}

export async function getAdminFirestore(): Promise<Firestore | null> {
  const app = await getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  const { getFirestore } = await import("firebase-admin/firestore");

  return getFirestore(app);
}
