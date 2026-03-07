import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get currency parameters from query string
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") || "USD";
    const to = searchParams.get("to") || "NGN";

    // Fetch exchange rate from a free API
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    
    if (!data.rates[to]) {
      throw new Error(`Exchange rate for ${to} not available`);
    }

    return NextResponse.json({
      from,
      to,
      rate: data.rates[to],
      lastUpdated: data.date,
    });
  } catch (error) {
    console.error("Exchange rate API error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch exchange rate",
        fallbackRate: 1550, // Fallback rate (1 USD = 1550 NGN)
      },
      { status: 500 }
    );
  }
}
