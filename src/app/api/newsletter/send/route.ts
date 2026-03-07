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

export async function POST(request: Request) {
  try {
    const { subject, htmlContent, textContent } = await request.json();

    if (!subject || !htmlContent || !textContent) {
      return NextResponse.json(
        { error: "Subject, HTML content, and text content are required" },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribersRef = admin.firestore().collection("subscribers");
    const subscribersSnapshot = await subscribersRef.where("isActive", "==", true).get();
    
    const subscribers: string[] = [];
    subscribersSnapshot.forEach(doc => {
      subscribers.push(doc.data().email);
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active subscribers to send emails to",
        sentCount: 0,
        failedCount: 0,
      });
    }

    // Send emails
    const { sendNewsletterEmail } = await import("@/lib/email");
    const results = [];

    for (const email of subscribers) {
      try {
        await sendNewsletterEmail({
          to: email,
          subject,
          htmlContent,
          textContent,
        });
        results.push({
          email,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const sentCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sentCount} of ${subscribers.length} subscribers`,
      sentCount,
      failedCount,
      totalCount: subscribers.length,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter. Please try again later." },
      { status: 500 }
    );
  }
}
