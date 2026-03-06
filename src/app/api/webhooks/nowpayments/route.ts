import { NextResponse } from "next/server";
import crypto from "crypto";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

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
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("orderId", "==", orderId));
    const querySnapshot = await getDocs(q);

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
        await updateDoc(doc(db, "orders", orderDoc.id), {
          paymentStatus: "review",
          orderStatus: "on_hold",
          paymentAmountReceived: receivedAmount,
          paymentAmountExpected: expectedAmount,
          amountMismatch: true,
          updatedAt: serverTimestamp(),
        });
        return NextResponse.json({ received: true });
      }
    }

    // Process based on payment status
    if (paymentStatus === "finished") {
      await updateDoc(doc(db, "orders", orderDoc.id), {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        cryptoTransactionHash: payinHash || paymentId, // Use actual blockchain hash
        cryptoCoin: receivedCurrency?.toUpperCase() || "UNKNOWN",
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        paymentConfirmedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} updated to paid via NOWPayments webhook`);
    } else if (paymentStatus === "failed" || paymentStatus === "refunded") {
      await updateDoc(doc(db, "orders", orderDoc.id), {
        paymentStatus: "failed",
        orderStatus: "cancelled",
        cryptoTransactionHash: payinHash,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        updatedAt: serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} marked as failed via NOWPayments webhook`);
    } else if (paymentStatus === "confirming" || paymentStatus === "confirmed") {
      // Payment detected but not yet finished - update to processing
      await updateDoc(doc(db, "orders", orderDoc.id), {
        paymentStatus: "processing",
        cryptoTransactionHash: payinHash,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        updatedAt: serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} is processing via NOWPayments webhook`);
    } else if (paymentStatus === "partially_paid") {
      await updateDoc(doc(db, "orders", orderDoc.id), {
        paymentStatus: "partial",
        orderStatus: "on_hold",
        cryptoTransactionHash: payinHash,
        paymentAmountReceived: receivedAmount,
        paymentProvider: "nowpayments",
        nowPaymentsId: paymentId,
        partiallyPaid: true,
        updatedAt: serverTimestamp(),
      });
      console.log(`Order ${orderDoc.id} partially paid via NOWPayments webhook`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("NOWPayments webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
