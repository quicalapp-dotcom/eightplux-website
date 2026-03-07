import { NextResponse } from "next/server";
import crypto from "crypto";
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
  const body = await request.text();

  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    console.log("Payment confirmed:", reference);

    try {
      // Update Firestore order
      const orderId = event.data.reference;
      const ordersRef = admin.firestore().collection("orders");
      
      // Find order by orderId or reference
      const q = ordersRef.where("orderId", "==", orderId).limit(1);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();

        // Prevent duplicate updates
        if (orderData.paymentStatus === "paid") {
          return NextResponse.json({ received: true });
        }

        // Validate amount using stored totalNGN
        const expectedAmount = orderData.totalNGN * 100; // Convert to kobo
        const actualAmount = event.data.amount;
        
        // Allow 1% tolerance for exchange rate fluctuations
        const tolerance = expectedAmount * 0.01;
        if (Math.abs(expectedAmount - actualAmount) > tolerance) { 
          console.error('Amount mismatch:', {
            expected: expectedAmount / 100, // Convert back to NGN
            actual: actualAmount / 100, // Convert back to NGN
            tolerance: tolerance / 100, // Convert back to NGN
          });
          return NextResponse.json({ received: true });
        }

        // Update order status
        await orderDoc.ref.update({
          paymentStatus: "paid",
          orderStatus: "confirmed",
          paymentProvider: "paystack",
          paystackReference: reference,
          paymentConfirmedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Order ${orderDoc.id} updated to paid via Paystack webhook`);
      }
    } catch (error) {
      console.error("Error updating order via webhook:", error);
    }
  }

  return NextResponse.json({ received: true });
}
