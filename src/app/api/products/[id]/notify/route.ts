import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/firebase/products';
import { getNotifyMeRequestsByProduct, markNotifyMeRequestsAsNotified } from '@/lib/firebase/notifyMe';
import { sendProductAvailableEmail } from '@/lib/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params;
    
    // Get product details
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get all notify me requests for this product
    const notifyMeRequests = await getNotifyMeRequestsByProduct(productId);

    // Send emails to all notified users
    for (const request of notifyMeRequests) {
      await sendProductAvailableEmail({
        to: request.email,
        productName: product.name,
        productSlug: product.slug
      });
    }

    // Mark all requests as notified
    await markNotifyMeRequestsAsNotified(notifyMeRequests.map(request => request.id!));

    return NextResponse.json({
      success: true,
      message: `Notified ${notifyMeRequests.length} users`,
      count: notifyMeRequests.length
    });
  } catch (error) {
    console.error('Error sending product available notifications:', error);
    return NextResponse.json({
      error: 'Failed to send notifications'
    }, { status: 500 });
  }
}
