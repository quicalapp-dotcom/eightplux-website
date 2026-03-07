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

/**
 * Generate a unique discount code
 */
function generateDiscountCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'WELCOME';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const subscribersRef = admin.firestore().collection("subscribers");
    const q = subscribersRef.where("email", "==", normalizedEmail);
    const existingSubscriber = await q.get();

    if (!existingSubscriber.empty) {
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 }
      );
    }

    // Generate unique discount code
    const discountCode = generateDiscountCode();
    const discountId = `DISCOUNT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create discount document
    const discountRef = admin.firestore().doc(`discounts/${discountId}`);
    await discountRef.set({
      id: discountId,
      code: discountCode,
      type: "percentage",
      value: 10, // 10% off
      description: "Welcome discount for new subscribers",
      minPurchase: 0,
      maxDiscount: null,
      usageLimit: 1,
      usageCount: 0,
      validFrom: admin.firestore.FieldValue.serverTimestamp(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      applicableTo: "first_order",
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Store subscriber
    const subscriberRef = admin.firestore().doc(`subscribers/${normalizedEmail}`);
    await subscriberRef.set({
      email: normalizedEmail,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "newsletter_section",
      discountCode: discountCode,
      discountId: discountId,
      discountUsed: false,
      isActive: true,
    });

    // Send welcome email (async - don't wait for it)
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      await sendWelcomeEmail({
        to: normalizedEmail,
        discountCode,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for your 10% discount code.",
      discountCode,
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
