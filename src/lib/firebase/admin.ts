// Firebase Admin Configuration for Server-side APIs ONLY
// This module should ONLY be used in Server Components and API Routes
// DO NOT import this file in Client Components ('use client')

import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

export function getFirebaseAdmin() {
  if (!adminApp) {
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    getFirebaseAdmin();
    adminDb = getFirestore(adminApp);
  }
  return adminDb;
}

// Export db for server-side only usage
export const db = getAdminDb();
