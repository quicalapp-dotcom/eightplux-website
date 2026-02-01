import { NextRequest } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export async function GET(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  try {
    const { uid } = await params;
    
    // Extract limit from query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const orderLimit = limitParam ? parseInt(limitParam) : 5;
    
    // Query for orders belonging to the user
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(orderLimit)
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
    }));
    
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}