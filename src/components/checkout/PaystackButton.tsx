"use client";

import { useState } from "react";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useCartStore } from "@/stores/cartStore";
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface PaystackButtonProps {
  email: string;
  amount: number;
  orderId: string;
  userId: string;
  formData: any;
  shippingCostUSD: number;
  discountData: any;
}

export default function PaystackButton({ email, amount, orderId, userId, formData, shippingCostUSD, discountData }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrencyStore();
  const { items, getSubtotal, clearCart } = useCartStore();

  console.log('PaystackButton props:', {
    email,
    amount,
    orderId,
    currency,
    userId,
  });

  const finalizeOrder = async (reference: string, paymentStatus: 'paid' | 'pending') => {
    const orderRef = doc(collection(db, 'orders'));
    const subtotal = getSubtotal();
    const orderData = {
      id: orderRef.id,
      orderId: `ORDER_${Date.now()}`,
      userId: userId || 'guest',
      items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
      })),
      subtotal,
      shipping: shippingCostUSD,
      discount: discountData?.discountAmount || 0,
      discountCode: discountData?.code || null,
      discountId: discountData?.discountId || null,
      total: amount,
      orderStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      paymentMethod: 'paystack',
      paymentStatus,
      currency: 'USD',
      shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone || '',
      },
      email: formData.email,
      paymentReference: reference,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('Creating order with data:', orderData);

    try {
      // Update product inventory
      for (const item of items) {
        const productRef = doc(db, 'products', item.productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();
          const newInventory = (productData.inventory || 0) - item.quantity;
          await updateDoc(productRef, {
            inventory: newInventory,
            updatedAt: serverTimestamp()
          });
          console.log(`Updated inventory for product ${item.productId}: ${newInventory}`);
        } else {
          console.warn(`Product ${item.productId} not found`);
        }
      }

      await setDoc(orderRef, orderData);
      console.log('Order successfully saved to Firestore with ID:', orderRef.id);
      return { firestoreOrderId: orderRef.id, orderData };
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const handlePay = async () => {
    setLoading(true);

    try {
      // First, create the order in Firestore
      const ref = 'PAYSTACK-' + Date.now();
      const { firestoreOrderId, orderData } = await finalizeOrder(ref, 'pending');

      console.log('Order created with firestoreOrderId:', firestoreOrderId, 'and orderId:', orderData.orderId);

      // Send admin notification email for new order (even before payment is confirmed)
      // Don't wait for this to complete - fire and forget
      fetch(`/api/orders/${firestoreOrderId}/admin-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => console.log('Admin notify response:', res.status))
        .catch(err => console.error('Failed to send admin notification:', err));

      // Wait a moment to ensure Firestore has committed the write
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then, call the Paystack API to initialize payment
      console.log('Calling Paystack initialize with orderId:', orderData.orderId);
      const res = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          email,
          orderId: orderData.orderId,
          amount,
        }),
      });

      const data = await res.json();
      console.log('Paystack initialization response:', data);

      if (data.authorization_url) {
        console.log('Redirecting to:', data.authorization_url);
        window.location.href = data.authorization_url;
      } else {
        console.error('No authorization URL in response:', data);
        alert('Payment initialization failed. Please try again. Error: ' + (data.error || 'Unknown error'));
      }

    } catch (error) {
      console.error("Paystack error:", error);
      alert('Payment initialization failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-green-600 text-white px-6 py-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Pay with Paystack"}
    </button>
  );
}
