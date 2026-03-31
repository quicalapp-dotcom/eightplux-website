import { db } from './config';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot, updateDoc, deleteDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Product } from '@/types';
import { Unsubscribe } from 'firebase/firestore';
import { getNotifyMeRequestsByProduct, markNotifyMeRequestsAsNotified } from './notifyMe';

/**
 * Get timestamp in milliseconds from a Date or Firestore Timestamp
 */
const getTimeMs = (date: Date | Timestamp | undefined | null): number => {
  if (!date) return 0;
  if (date instanceof Timestamp) {
    return date.seconds * 1000 + date.nanoseconds / 1e6;
  }
  if (date instanceof Date) {
    return date.getTime();
  }
  return 0;
};

/**
 * Subscribe to all products (real-time)
 * Note: Uses unordered query to avoid Firestore index requirements
 */
export const subscribeToProducts = (
  callback: (products: Product[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'products'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as Product);
    // Sort client-side by createdAt if available
    products.sort((a, b) => {
      return getTimeMs(b.createdAt) - getTimeMs(a.createdAt);
    });
    callback(products);
  }, (error) => {
    console.error('Error subscribing to products:', error);
    callback([]);
  });
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  if (!id) return null;
  const productRef = doc(db, 'products', id);
  const docSnap = await getDoc(productRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

/**
 * Update product
 */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

/**
 * Delete product
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

/**
 * Add product
 */
export const addProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Retrieves a single product from Firestore.
 * @param productId - The ID of the product to retrieve.
 * @returns The product data.
 */
export const getProduct = async (productId: string): Promise<Product | null> => {
    if (!productId) return null;

    const productRef = doc(db, 'products', productId);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
        return null;
    }
};

/**
 * Retrieves a product by slug from Firestore.
 * @param slug - The slug of the product to retrieve.
 * @returns The product data.
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    if (!slug) return null;

    const productsCol = collection(db, 'products');
    const q = query(productsCol, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Product;
    } else {
        return null;
    }
};

/**
 * Retrieves all products from Firestore.
 * @returns An array of all products.
 */
export const getProducts = async (): Promise<Product[]> => {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};
