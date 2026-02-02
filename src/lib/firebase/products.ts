
import { db } from './config';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Product } from '@/types';

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
