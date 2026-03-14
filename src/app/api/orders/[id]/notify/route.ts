import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/firebase/users';
import { sendOrderStatusEmail } from '@/lib/email';
import { getOrderById } from '@/lib/firebase/orders';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    // Get order details
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get user email
    if (order.userId) {
      const user = await getUserById(order.userId);
      if (user?.email) {
        await sendOrderStatusEmail({
          to: user.email,
          orderId: order.id,
          status,
          trackingNumber
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order status notification sent'
    });
  } catch (error) {
    console.error('Error sending order status notification:', error);
    return NextResponse.json({
      error: 'Failed to send order status notification'
    }, { status: 500 });
  }
}
