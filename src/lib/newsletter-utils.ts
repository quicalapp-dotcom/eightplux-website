// This file is server-side only and should not be imported from client components
import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
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

/**
 * Handles welcome email and discount code generation for new users/registrants
 * @param email - User's email address
 * @param source - Source of the sign-up (e.g., 'newsletter_section', 'signup_page')
 * @returns Promise with discount code and discount ID if created
 */
export async function handleNewUserWelcome(email: string, source: string = 'signup_page'): Promise<{ discountCode?: string; discountId?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email is already in subscribers collection
  const subscribersRef = admin.firestore().collection("subscribers");
  const q = subscribersRef.where("email", "==", normalizedEmail);
  const existingSubscriber = await q.get();

  // If already a subscriber, don't send another discount code
  if (!existingSubscriber.empty) {
    console.log(`Email ${normalizedEmail} is already a subscriber, skipping welcome email and discount code generation`);
    return {};
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
    description: "Welcome discount for new users",
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
    source: source,
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
    // Don't fail the process if email fails
  }

  return {
    discountCode,
    discountId,
  };
}
