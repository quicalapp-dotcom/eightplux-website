import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Paystack initialization request body:', body);
    const { email, orderId, amount } = body;

    // Fetch order from database to get the actual amount
    // Get user from Firebase Auth (you need to implement your own authentication logic here)
    // For now, let's assume we have the user's ID from the request
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch order from database to get the actual amount
    const ordersRef = admin.firestore().collection('orders');
    const orderQuery = ordersRef.where('orderId', '==', orderId).limit(1);
    const orderSnapshot = await orderQuery.get();
    
    let orderData;
    let orderAmount;
    let orderRef;
    if (orderSnapshot.empty) {
      // If order doesn't exist and user is guest, create a temporary order
      if (userId === 'guest') {
        orderRef = admin.firestore().collection('orders').doc();
        orderData = {
          id: orderRef.id,
          orderId,
          userId: 'guest',
          total: amount, // Use amount from frontend for guests
          totalNGN: 0,
          email,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await orderRef.set(orderData);
        orderAmount = amount;
      } else {
        return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
      }
    } else {
      const orderDoc = orderSnapshot.docs[0];
      orderRef = orderDoc.ref;
      orderData = orderDoc.data();
      if (!orderData) {
        return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
      }

      // Check if user is the owner of the order
      if (orderData.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orderAmount = orderData.total;
    }

    // Amount is always in USD, convert to NGN for Paystack
    const paystackCurrency = 'NGN';

    // Use cached exchange rate or fetch new one
    let exchangeRate;
    const cacheKey = 'exchange_rate_usd_ngn';
    const cacheRef = admin.firestore().collection('system').doc(cacheKey);
    const cacheDoc = await cacheRef.get();
    
    if (cacheDoc.exists) {
      const cacheData = cacheDoc.data();
      if (cacheData) {
        const cacheTime = cacheData.timestamp.toDate().getTime();
        const currentTime = Date.now();
        
        // Refresh cache every hour
        if (currentTime - cacheTime < 3600000) {
          exchangeRate = cacheData.rate;
          console.log('Using cached exchange rate:', exchangeRate);
        }
      }
    }

    if (!exchangeRate) {
      try {
        const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeRateData = await exchangeRateResponse.json();
        exchangeRate = exchangeRateData.rates.NGN;
        console.log('Fetched new exchange rate:', exchangeRate);
        
        // Cache the rate
        await cacheRef.set({
          rate: exchangeRate,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (exchangeError) {
        console.error('Failed to fetch exchange rate:', exchangeError);
        // Fallback to reasonable rate if API fails
        exchangeRate = 1550;
      }
    }

    const amountToCharge = orderAmount * exchangeRate;
    console.log('Amount in NGN:', amountToCharge);

    // Update order with exchange rate and total in NGN
    await orderRef.update({
      exchangeRate: exchangeRate,
      totalNGN: amountToCharge,
    });

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amountToCharge * 100), // Paystack uses kobo (convert to integer)
          reference: orderId,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/paystack-success`,
          currency: paystackCurrency,
          metadata: {
            orderId: orderId,
            userId: orderData.userId,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });

  } catch (error) {
    console.error("Paystack initialize error:", error);

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}

