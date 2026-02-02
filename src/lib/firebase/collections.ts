import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product, Collection } from '@/types';

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
