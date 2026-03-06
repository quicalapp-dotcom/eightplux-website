import { NextResponse } from "next/server";

// NOWPayments uses the same endpoint for both sandbox and production
// The API key type determines the mode
const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, email, orderId } = body;

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    
    console.log("NOWPayments request:", {
      amount,
      currency: currency || "usd",
      orderId: orderId || `ORDER_${Date.now()}`,
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
        price_currency: currency || "usd",
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
  } catch (error: any) {
    console.error("Crypto payment creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
