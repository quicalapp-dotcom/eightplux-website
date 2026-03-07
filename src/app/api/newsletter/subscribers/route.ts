import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET() {
  try {
    const subscribersRef = admin.firestore().collection("subscribers");
    const subscribersSnapshot = await subscribersRef.where("isActive", "==", true).get();
    
    const subscribers: Array<{
        id: string;
        email: string;
        subscribedAt: string;
        source: string;
        discountCode: string;
        discountId: string;
        discountUsed: boolean;
    }> = [];
    subscribersSnapshot.forEach(doc => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,
        email: data.email,
        subscribedAt: data.subscribedAt?.toDate().toISOString(),
        source: data.source,
        discountCode: data.discountCode,
        discountId: data.discountId,
        discountUsed: data.discountUsed,
      });
    });

    return NextResponse.json({
      success: true,
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error("Error getting subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
