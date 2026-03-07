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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (data.data.status === "success") {
    try {
      // Update Firestore order
      const orderId = data.data.reference;
      const ordersRef = admin.firestore().collection("orders");
      
      // Find order by orderId or reference
      const q = ordersRef.where("orderId", "==", orderId).limit(1);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();

        // Prevent duplicate updates
        if (orderData.paymentStatus === "paid") {
          return NextResponse.json({
            success: true,
            data: data.data,
          });
        }

        // Validate amount using stored totalNGN
        const expectedAmount = orderData.totalNGN * 100; // Convert to kobo
        const actualAmount = data.data.amount;
        
        // Allow 1% tolerance for exchange rate fluctuations
        const tolerance = expectedAmount * 0.01;
        if (Math.abs(expectedAmount - actualAmount) > tolerance) { 
          console.error('Amount mismatch:', {
            expected: expectedAmount / 100, // Convert back to NGN
            actual: actualAmount / 100, // Convert back to NGN
            tolerance: tolerance / 100, // Convert back to NGN
          });
          return NextResponse.json({
            success: false,
            error: "Amount mismatch",
          });
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

        console.log(`Order ${orderDoc.id} updated to paid via Paystack`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  }

  return NextResponse.json({ success: false });
}
