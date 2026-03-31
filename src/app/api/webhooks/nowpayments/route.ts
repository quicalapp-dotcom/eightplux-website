import { NextResponse } from "next/server";
import crypto from "crypto";
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

const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-nowpayments-sign");

    // CRITICAL: Always verify webhook signature - reject if missing
    if (!signature) {
      console.error("Missing NOWPayments signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (!NOWPAYMENTS_IPN_SECRET) {
      console.error("Missing NOWPayments IPN secret key");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const hash = crypto
      .createHmac("sha512", NOWPAYMENTS_IPN_SECRET)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid NOWPayments signature - possible attack");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // NOWPayments payment statuses
    const paymentStatus = event.payment_status;
    const paymentId = event.payment_id?.toString();
    const orderId = event.order_id;
    const payinHash = event.payin_hash; // Blockchain transaction hash
    const receivedAmount = event.payin_amount || event.price_amount;
    const receivedCurrency = event.payin_currency || event.price_currency;

    console.log("NOWPayments webhook received:", {
      payment_id: paymentId,
      order_id: orderId,
      status: paymentStatus,
      amount: receivedAmount,
      currency: receivedCurrency,
      payin_hash: payinHash,
    });

    // Find order by order_id in Firestore
    const ordersRef = admin.firestore().collection("orders");
    const q = ordersRef.where("orderId", "==", orderId);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.warn(`No order found for order_id: ${orderId}`);
      return NextResponse.json({ received: true }); // Return success to stop NOWPayments retries
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();

    // DUPLICATE WEBHOOK PROTECTION: Skip if already paid
    if (orderData.paymentStatus === "paid" && orderData.orderStatus === "confirmed") {
      console.log(`Order ${orderDoc.id} already confirmed - skipping duplicate webhook`);
      return NextResponse.json({ received: true });
    }

    // AMOUNT VERIFICATION: Check payment amount matches order total
    const expectedAmount = orderData.total;
    if (receivedAmount !== undefined && expectedAmount !== undefined) {
      // Allow small tolerance for crypto fluctuations (1%)
      const tolerance = expectedAmount * 0.01;
      if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
        console.warn(`Payment amount mismatch: expected ${expectedAmount}, received ${receivedAmount}`);
        // Don't fail immediately - mark for manual review
        await admin.firestore().doc(`orders/${orderDoc.id}`).update({
          paymentStatus: "review",
          orderStatus: "on_hold",
          paymentAmountReceived: receivedAmount,
          paymentAmountExpected: expectedAmount,
          amountMismatch: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ received: true });
      }
    }

    // Process based on payment status
    if (paymentStatus === "finished") {
      const updateData: any = {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        cryptoTransactionHash: payinHash || paymentId,
        cryptoCoin: receivedCurrency?.toUpperCase() || "UNKNOWN",
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        paymentConfirmedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Mark discount as used if order has one
      if (orderData.discountId && orderData.email) {
        try {
          // Update discount usage count
          const discountRef = admin.firestore().doc(`discounts/${orderData.discountId}`);
          await discountRef.update({
            usageCount: admin.firestore.FieldValue.increment(1),
          });

          // Mark discount as used for this subscriber
          const subscribersRef = admin.firestore().collection("subscribers");
          const subQ = subscribersRef
            .where("email", "==", orderData.email)
            .where("discountCode", "==", orderData.discountCode);
          const subSnapshot = await subQ.get();
          if (!subSnapshot.empty) {
            await subSnapshot.docs[0].ref.update({
              discountUsed: true,
              usedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
          updateData.discountUsed = true;
        } catch (err) {
          console.error("Failed to mark discount as used:", err);
        }
      }

      await admin.firestore().doc(`orders/${orderDoc.id}`).update(updateData);
      console.log(`Order ${orderDoc.id} updated to paid via NOWPayments webhook`);
    } else if (paymentStatus === "failed" || paymentStatus === "refunded") {
      await admin.firestore().doc(`orders/${orderDoc.id}`).update({
        paymentStatus: "failed",
        orderStatus: "cancelled",
        cryptoTransactionHash: payinHash,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} marked as failed via NOWPayments webhook`);
    } else if (paymentStatus === "confirming" || paymentStatus === "confirmed") {
      // Payment detected but not yet finished - update to processing
      await admin.firestore().doc(`orders/${orderDoc.id}`).update({
        paymentStatus: "processing",
        cryptoTransactionHash: payinHash,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} is processing via NOWPayments webhook`);
    } else if (paymentStatus === "partially_paid") {
      await admin.firestore().doc(`orders/${orderDoc.id}`).update({
        paymentStatus: "partial",
        orderStatus: "on_hold",
        cryptoTransactionHash: payinHash,
        paymentAmountReceived: receivedAmount,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        partiallyPaid: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} partially paid via NOWPayments webhook`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("NOWPayments webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

