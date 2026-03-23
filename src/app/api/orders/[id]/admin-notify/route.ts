import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/firebase/orders';
import { sendAdminNewOrderEmail } from '@/lib/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;

    // Get order details
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Sending admin notification for order:', orderId);

    // Send admin notification email
    await sendAdminNewOrderEmail({
      orderId: order.id,
      orderData: order
    });

    return NextResponse.json({
      success: true,
      message: 'Admin notification sent'
    });
  } catch (error) {
    console.error('Error sending admin order notification:', error);
    return NextResponse.json({
      error: 'Failed to send admin notification'
    }, { status: 500 });
  }
}
