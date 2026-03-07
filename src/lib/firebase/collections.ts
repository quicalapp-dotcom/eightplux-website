import { collection, doc, getDoc, getDocs, query, where, onSnapshot, orderBy, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product, Collection } from '@/types';
import { Unsubscribe } from 'firebase/firestore';

// Subscribe to all collections (real-time)
export const subscribeToCollections = (
  callback: (collections: Collection[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'collections'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const collections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as Collection);
    callback(collections);
  }, (error) => {
    console.error('Error subscribing to collections:', error);
    callback([]);
  });
};

// Get collection by ID
export const getCollectionById = async (id: string): Promise<Collection | null> => {
  try {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Collection;
    }
    return null;
  } catch (error) {
    console.error('Error getting collection by ID:', error);
    return null;
  }
};

// Update collection
export const updateCollection = async (id: string, data: Partial<Collection>): Promise<void> => {
  const docRef = doc(db, 'collections', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// Delete collection
export const deleteCollection = async (id: string): Promise<void> => {
  const docRef = doc(db, 'collections', id);
  await deleteDoc(docRef);
};

// Create collection
export const createCollection = async (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'collections'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get collection by slug
export const getCollectionBySlug = async (slug: string): Promise<Collection | null> => {
    try {
        const q = query(collection(db, 'collections'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
            } as Collection;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting collection by slug:', error);
        return null;
    }
};

// Get products by collection ID
export const getProductsByCollection = async (collectionId: string): Promise<Product[]> => {
    try {
        const q = query(collection(db, 'products'), where('collectionId', '==', collectionId));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error('Error getting products by collection:', error);
        return [];
    }
};

// Get all active collections with products count
export const getActiveCollections = async (): Promise<(Collection & { productCount: number })[]> => {
    try {
        const q = query(collection(db, 'collections'), where('isActive', '==', true));
        const snapshot = await getDocs(q);
        
        const collectionsWithCount = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const collectionData = doc.data() as Omit<Collection, 'id'>;
                const productsQ = query(collection(db, 'products'), where('collectionId', '==', doc.id));
                const productsSnapshot = await getDocs(productsQ);
                
                return {
                    id: doc.id,
                    ...collectionData,
                    productCount: productsSnapshot.size,
                };
            })
        );
        
        return collectionsWithCount;
    } catch (error) {
        console.error('Error getting active collections:', error);
        return [];
    }
};

// Get products for the new releases collection
export const getNewReleasesProducts = async (): Promise<Product[]> => {
    try {
        const q = query(collection(db, 'products'), where('isNew', '==', true));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error('Error getting new releases products:', error);
        return [];
    }
};
