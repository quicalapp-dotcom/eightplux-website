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

    // Get user email (from user document or order document if guest)
    let email = '';
    
    console.log('Order details:', order);
    
    if (order.userId && order.userId !== 'guest') {
      console.log('Fetching user with ID:', order.userId);
      const user = await getUserById(order.userId);
      console.log('User details:', user);
      if (user?.email) {
        email = user.email;
      }
    } else if (order.email) {
      // For guest orders, use email from order
      email = order.email;
    }
    
    console.log('Final email:', email);
    
    if (email) {
      console.log('Sending order status email to:', email);
      await sendOrderStatusEmail({
        to: email,
        orderId: order.id,
        status,
        trackingNumber
      });
    } else {
      console.error('No email found for order:', orderId);
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
