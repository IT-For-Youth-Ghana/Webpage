"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

type FirebaseClientConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
};

function getFirebaseClientConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}

export function getFirebaseClientStatus() {
  const config = getFirebaseClientConfig();

  return {
    configured: Boolean(
      config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId,
    ),
    projectId: config.projectId,
    authDomain: config.authDomain,
  };
}

export function getFirebaseClientApp(): FirebaseApp {
  const status = getFirebaseClientStatus();

  if (!status.configured) {
    throw new Error("Firebase client config is missing required NEXT_PUBLIC_FIREBASE_* values.");
  }

  return getApps()[0] ?? initializeApp(getFirebaseClientConfig());
}

export function getFirebaseClientAuth(): Auth {
  return getAuth(getFirebaseClientApp());
}
