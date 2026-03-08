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

    // Handle welcome email and discount code generation
    const result = await handleNewUserWelcome(normalizedEmail, "signup_page");

    return NextResponse.json({
      success: true,
      message: "Welcome email process completed",
      discountCode: result.discountCode,
      discountId: result.discountId,
    });
  } catch (error) {
    console.error("Error handling welcome email:", error);
    return NextResponse.json(
      { error: "Failed to process welcome email" },
      { status: 500 }
    );
  }
}
