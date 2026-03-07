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
    const { code, email, total } = await request.json();

    if (!code || !email) {
      return NextResponse.json(
        { error: "Discount code and email are required" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const normalizedEmail = email.toLowerCase().trim();

    // Find discount code
    const discountsRef = admin.firestore().collection("discounts");
    const q = discountsRef.where("code", "==", normalizedCode);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 404 }
      );
    }

    const discountDoc = snapshot.docs[0];
    const discount = discountDoc.data();
    const discountId = discountDoc.id;

    // Validate discount
    const now = admin.firestore.Timestamp.now();

    if (!discount.isActive) {
      return NextResponse.json(
        { error: "This discount code is no longer active" },
        { status: 400 }
      );
    }

    if (discount.validUntil && discount.validUntil < now) {
      return NextResponse.json(
        { error: "This discount code has expired" },
        { status: 400 }
      );
    }

    if (discount.validFrom && discount.validFrom > now) {
      return NextResponse.json(
        { error: "This discount code is not yet valid" },
        { status: 400 }
      );
    }

    if (discount.usageCount >= discount.usageLimit) {
      return NextResponse.json(
        { error: "This discount code has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check if user already used this discount
    if (discount.applicableTo === "first_order") {
      const subscribersRef = admin.firestore().collection("subscribers");
      const subscriberQ = subscribersRef
        .where("email", "==", normalizedEmail)
        .where("discountCode", "==", normalizedCode)
        .where("discountUsed", "==", true);
      const usedDiscount = await subscriberQ.get();

      if (!usedDiscount.empty) {
        return NextResponse.json(
          { error: "You have already used this discount code" },
          { status: 400 }
        );
      }
    }

    // Check minimum purchase
    if (discount.minPurchase && total < discount.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of $${discount.minPurchase} required` },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = (total * discount.value) / 100;
      if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
        discountAmount = discount.maxDiscount;
      }
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }

    // Ensure discount doesn't exceed total
    if (discountAmount > total) {
      discountAmount = total;
    }

    const finalTotal = total - discountAmount;

    return NextResponse.json({
      success: true,
      discountId,
      code: normalizedCode,
      type: discount.type,
      value: discount.value,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      originalTotal: total,
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      description: discount.description,
    });
  } catch (error: any) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
}

/**
 * Apply discount to order (called after successful payment)
 */
export async function PATCH(request: Request) {
  try {
    const { discountId, email } = await request.json();

    if (!discountId || !email) {
      return NextResponse.json(
        { error: "Discount ID and email are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Update discount usage count
    const discountRef = admin.firestore().doc(`discounts/${discountId}`);
    await discountRef.update({
      usageCount: admin.firestore.FieldValue.increment(1),
    });

    // Mark discount as used for this subscriber
    const subscribersRef = admin.firestore().collection("subscribers");
    const q = subscribersRef
      .where("email", "==", normalizedEmail)
      .where("discountCode", "!=", null);
    const snapshot = await q.get();

    if (!snapshot.empty) {
      const subscriberDoc = snapshot.docs.find(
        (doc) => doc.data().discountId === discountId
      );
      if (subscriberDoc) {
        await subscriberDoc.ref.update({
          discountUsed: true,
          usedAt: admin.firestore.Timestamp.now(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Discount apply error:", error);
    return NextResponse.json(
      { error: "Failed to apply discount" },
      { status: 500 }
    );
  }
}
