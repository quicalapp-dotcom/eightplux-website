import { NextResponse } from "next/server";
import { handleNewUserWelcome } from "@/lib/newsletter-utils";

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
    const { discountCode, discountId } = await handleNewUserWelcome(normalizedEmail, "newsletter_section");

    // If email is already a subscriber, return error
    if (!discountCode || !discountId) {
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 }
      );
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
