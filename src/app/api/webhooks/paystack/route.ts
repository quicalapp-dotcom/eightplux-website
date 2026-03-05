import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY || '').update(body).digest('hex');
        
        const signature = request.headers.get('x-paystack-signature');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);

        if (event.event === 'charge.success') {
            const { reference } = event.data;
            
            // Find order by reference
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where('paymentReference', '==', reference));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const orderDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'orders', orderDoc.id), {
                    paymentStatus: 'paid',
                    orderStatus: 'confirmed',
                    updatedAt: serverTimestamp()
                });
                console.log(`Order ${orderDoc.id} updated to paid via Paystack webhook`);
            } else {
                console.warn(`Order with reference ${reference} not found in Firestore`);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
