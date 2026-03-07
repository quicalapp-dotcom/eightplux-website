
import { db } from './config';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot, orderBy, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '@/types';
import { Unsubscribe } from 'firebase/firestore';

/**
 * Subscribe to all products (real-time)
 */
export const subscribeToProducts = (
  callback: (products: Product[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as Product);
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
