import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { sendProductAvailableEmail } from '@/lib/email';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params;
    
    // Get product details
    const productDoc = await admin.firestore().doc(`products/${productId}`).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = productDoc.data() as any;

    // Get all notify me requests for this product
    const notifyMeQuery = admin.firestore().collection('notifyMeRequests')
      .where('productId', '==', productId)
      .where('notified', '==', false);
    const notifyMeSnapshot = await notifyMeQuery.get();
    const notifyMeRequests = notifyMeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Send emails to all notified users
    for (const request of notifyMeRequests) {
      await sendProductAvailableEmail({
        to: request.email,
        productName: product.name,
        productSlug: product.slug
      });
    }

    // Mark all requests as notified
    const updatePromises = notifyMeRequests.map(request => 
      admin.firestore().doc(`notifyMeRequests/${request.id}`).update({ notified: true })
    );
    await Promise.all(updatePromises);

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
