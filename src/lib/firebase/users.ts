import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import { Unsubscribe } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  totalOrders?: number;
  totalSpent?: number;
}

// Subscribe to all customers (real-time)
export const subscribeToCustomers = (
  callback: (customers: UserProfile[]) => void
): Unsubscribe => {
  // Note: This assumes you have a 'users' collection with user profiles
  // You may need to adjust the collection name based on your setup
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email || '',
      displayName: doc.data().displayName || '',
      photoURL: doc.data().photoURL || '',
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      lastLoginAt: doc.data().lastLoginAt?.toDate ? doc.data().lastLoginAt.toDate() : undefined,
      totalOrders: doc.data().totalOrders || 0,
      totalSpent: doc.data().totalSpent || 0,
    }));
    callback(customers);
  }, (error) => {
    console.error('Error subscribing to customers:', error);
    callback([]);
  });
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserProfile | null> => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(doc(db, 'users', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : undefined,
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};
