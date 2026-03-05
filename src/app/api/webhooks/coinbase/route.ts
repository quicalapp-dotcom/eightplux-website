import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-cc-webhook-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        const hash = crypto
            .createHmac('sha256', COINBASE_WEBHOOK_SECRET || '')
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            console.error('Invalid Coinbase signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);

        // Coinbase Commerce event types: charge:created, charge:confirmed, charge:failed
        if (event.event.type === 'charge:confirmed') {
            const email = event.event.data.metadata.customer_email;
            const chargeId = event.event.data.id;

            // In order to find the exact order, we might need to store the chargeId in the order document initially
            // or find the most recent pending order for this email.
            // For now, let's find pending orders with this email.
            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef, 
                where('email', '==', email),
                where('paymentStatus', '==', 'pending')
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Find the one that doesn't have a transaction hash yet if possible, 
                // or just the most recent one.
                const orderDoc = querySnapshot.docs[0]; // Simple approach: take the first one
                await updateDoc(doc(db, 'orders', orderDoc.id), {
                    paymentStatus: 'paid',
                    orderStatus: 'confirmed',
                    cryptoTransactionHash: chargeId, // Using chargeId as a placeholder or reference
                    updatedAt: serverTimestamp()
                });
                console.log(`Order ${orderDoc.id} updated to paid via Coinbase webhook`);
            } else {
                console.warn(`No pending order found for email ${email} via Coinbase webhook`);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Coinbase webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
