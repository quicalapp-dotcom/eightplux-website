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

// NOWPayments uses the same endpoint for both sandbox and production
// The API key type determines the mode
const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, orderId } = body;

    // Get user from Firebase Auth (you need to implement your own authentication logic here)
    // For now, let's assume we have the user's ID from the request
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch order from database to get the actual amount
    const ordersRef = admin.firestore().collection('orders');
    const orderQuery = ordersRef.where('orderId', '==', orderId).limit(1);
    const orderSnapshot = await orderQuery.get();
    
    if (orderSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    const orderDoc = orderSnapshot.docs[0];
    const orderData = orderDoc.data();
    if (!orderData) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Check if user is the owner of the order
    if (orderData.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const amount = orderData.total;

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    
    console.log("NOWPayments request:", {
      amount,
      currency: "usd",
      orderId: orderId,
      apiKeySet: !!apiKey,
      apiKeyStart: apiKey ? apiKey.substring(0, 8) : "none",
      baseUrl: NOWPAYMENTS_BASE_URL,
    });

    if (!apiKey) {
      console.error("NOWPayments API key is missing");
      return NextResponse.json(
        { error: "Payment configuration error - API key missing" },
        { status: 500 }
      );
    }

    // Create invoice using NOWPayments API
    // Note: Using /v1/invoice endpoint which supports sandbox mode
    const response = await fetch(`${NOWPAYMENTS_BASE_URL}/v1/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        price_amount: parseFloat(amount.toString()),
        price_currency: "usd",
        order_id: orderId || `ORDER_${Date.now()}`,
        order_description: "Eightplux Payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`,
      }),
    });

    console.log("NOWPayments response status:", response.status);

    const responseText = await response.text();
    console.log("NOWPayments raw response:", responseText.substring(0, 500));

    // Check if response is HTML (error page)
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.error("NOWPayments returned HTML instead of JSON - likely an error page");
      return NextResponse.json(
        { error: "NOWPayments service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse NOWPayments response:", e);
      return NextResponse.json(
        { error: "Invalid response from payment provider" },
        { status: 500 }
      );
    }

    console.log("NOWPayments response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("NOWPayments API error:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      return NextResponse.json(
        { error: data.message || `NOWPayments error: ${response.status}` },
        { status: response.status }
      );
    }

    if (data.invoice_url) {
      return NextResponse.json({
        invoice_url: data.invoice_url,
        payment_id: data.id,
        order_id: data.order_id,
      });
    } else {
      console.error("NOWPayments no invoice URL:", data);
      return NextResponse.json({ error: "Failed to create payment - no invoice URL" }, { status: 500 });
    }
  } catch (error) {
    console.error("Crypto payment creation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
