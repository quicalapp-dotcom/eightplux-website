import { collection, doc, getDoc, getDocs, query, where, onSnapshot, orderBy, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { SubCollection, Product } from '@/types';
import { Unsubscribe } from 'firebase/firestore';

// Subscribe to all sub-collections (real-time)
export const subscribeToSubCollections = (
  callback: (subCollections: SubCollection[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'subCollections'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const subCollections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as SubCollection);
    callback(subCollections);
  }, (error) => {
    console.error('Error subscribing to sub-collections:', error);
    callback([]);
  });
};

// Subscribe to sub-collections by parent collection ID
export const subscribeToSubCollectionsByCollection = (
  collectionId: string,
  callback: (subCollections: SubCollection[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, 'subCollections'),
    where('collectionId', '==', collectionId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const subCollections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as SubCollection);
    callback(subCollections);
  }, (error) => {
    console.error('Error subscribing to sub-collections by collection:', error);
    callback([]);
  });
};

// Get sub-collection by ID
export const getSubCollectionById = async (id: string): Promise<SubCollection | null> => {
  try {
    const docRef = doc(db, 'subCollections', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SubCollection;
    }
    return null;
  } catch (error) {
    console.error('Error getting sub-collection by ID:', error);
    return null;
  }
};

// Update sub-collection
export const updateSubCollection = async (id: string, data: Partial<SubCollection>): Promise<void> => {
  const docRef = doc(db, 'subCollections', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// Delete sub-collection
export const deleteSubCollection = async (id: string): Promise<void> => {
  const docRef = doc(db, 'subCollections', id);
  await deleteDoc(docRef);
};

// Create sub-collection
export const createSubCollection = async (data: Omit<SubCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'subCollections'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get sub-collection by slug
export const getSubCollectionBySlug = async (slug: string): Promise<SubCollection | null> => {
  try {
    const q = query(collection(db, 'subCollections'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as SubCollection;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting sub-collection by slug:', error);
    return null;
  }
};

// Get all active sub-collections
export const getActiveSubCollections = async (): Promise<SubCollection[]> => {
  try {
    const q = query(collection(db, 'subCollections'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SubCollection[];
  } catch (error) {
    console.error('Error getting active sub-collections:', error);
    return [];
  }
};

// Get products by sub-collection ID
export const getProductsBySubCollection = async (subCollectionId: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), where('subCollectionId', '==', subCollectionId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products by sub-collection:', error);
    return [];
  }
};