import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productName } = body;

    if (!email || !productName) {
      return NextResponse.json({ error: 'Email and product name are required' }, { status: 400 });
    }

    await sendNotificationConfirmationEmail({
      to: email,
      productName
    });

    return NextResponse.json({
      success: true,
      message: 'Notification confirmation email sent'
    });
  } catch (error) {
    console.error('Error sending notification confirmation email:', error);
    return NextResponse.json({
      error: 'Failed to send notification confirmation email'
    }, { status: 500 });
  }
}
