import { getApps, initializeApp, cert, App, deleteApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

export function getFirebaseAdmin(): App {
  // If already initialized and healthy, return it
  if (adminApp) return adminApp;

  // Clear ALL existing apps to avoid stale credential issues
  const existingApps = getApps();
  for (const app of existingApps) {
    try { deleteApp(app); } catch {}
  }
  adminApp = undefined;
  adminDb = undefined;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Hard fail early if any env var is missing
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `[Firebase Admin] Missing credentials — projectId: ${!!projectId}, clientEmail: ${!!clientEmail}, privateKey: ${!!privateKey}`
    );
  }

  console.log('[Firebase Admin] Initializing with project:', projectId);

  adminApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getFirebaseAdmin());
  }
  return adminDb;
}