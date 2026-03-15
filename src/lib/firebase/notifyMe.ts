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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestData: any = {
    ...data,
    notified: false,
    createdAt: serverTimestamp(),
  };
  
  // Remove undefined fields to avoid Firestore errors
  if (requestData.userId === undefined || requestData.userId === null) {
    delete requestData.userId;
  }
  
  const docRef = await addDoc(collection(db, 'notifyMeRequests'), requestData);
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
