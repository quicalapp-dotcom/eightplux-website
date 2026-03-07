import { collection, doc, getDoc, getDocs, query, where, orderBy, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Unsubscribe } from 'firebase/firestore';
import { Order } from '@/types';

// Subscribe to all orders (real-time)
export const subscribeToOrders = (
  callback: (orders: Order[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().userId || '',
      items: doc.data().items || [],
      subtotal: doc.data().subtotal || 0,
      shipping: doc.data().shipping || 0,
      tax: doc.data().tax || 0,
      total: doc.data().total || 0,
      currency: doc.data().currency || 'USD',
      paymentMethod: doc.data().paymentMethod || '',
      paymentStatus: doc.data().paymentStatus || 'pending',
      orderStatus: doc.data().orderStatus || 'pending',
      shippingAddress: doc.data().shippingAddress || {},
      trackingNumber: doc.data().trackingNumber || '',
      paymentReference: doc.data().paymentReference || '',
      cryptoTransactionHash: doc.data().cryptoTransactionHash || '',
      notes: doc.data().notes || '',
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
    callback(orders);
  }, (error) => {
    console.error('Error subscribing to orders:', error);
    callback([]);
  });
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'orders', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId || '',
        items: data.items || [],
        subtotal: data.subtotal || 0,
        shipping: data.shipping || 0,
        tax: data.tax || 0,
        total: data.total || 0,
        currency: data.currency || 'USD',
        paymentMethod: data.paymentMethod || '',
        paymentStatus: data.paymentStatus || 'pending',
        orderStatus: data.orderStatus || 'pending',
        shippingAddress: data.shippingAddress || {},
        trackingNumber: data.trackingNumber || '',
        paymentReference: data.paymentReference || '',
        cryptoTransactionHash: data.cryptoTransactionHash || '',
        notes: data.notes || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: Order['orderStatus']): Promise<void> => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { orderStatus: status, updatedAt: serverTimestamp() });
};

// Update order
export const updateOrder = async (id: string, data: Partial<Order>): Promise<void> => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};
