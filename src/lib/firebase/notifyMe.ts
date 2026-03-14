import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export interface NotifyMeRequest {
  id?: string;
  productId: string;
  productName: string;
  email: string;
  userId?: string;
  createdAt: Date;
  notified: boolean;
}

/**
 * Add a notify me request
 */
export const addNotifyMeRequest = async (data: Omit<NotifyMeRequest, 'id' | 'createdAt' | 'notified'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifyMeRequests'), {
    ...data,
    notified: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get all notify me requests for a product
 */
export const getNotifyMeRequestsByProduct = async (productId: string): Promise<NotifyMeRequest[]> => {
  const q = query(
    collection(db, 'notifyMeRequests'),
    where('productId', '==', productId),
    where('notified', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as NotifyMeRequest));
};

/**
 * Mark notify me requests as notified
 */
export const markNotifyMeRequestsAsNotified = async (requestIds: string[]): Promise<void> => {
  for (const requestId of requestIds) {
    const docRef = doc(db, 'notifyMeRequests', requestId);
    await updateDoc(docRef, { notified: true });
  }
};
