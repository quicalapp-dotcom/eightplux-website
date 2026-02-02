
import { db } from './config';
import { collection, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useWishlistStore } from '@/stores/wishlistStore';

// Type for a wishlist item
interface WishlistItem {
    productId: string;
    addedAt: Date;
}

// --- Wishlist Syncing Hook ---
// This hook keeps the local wishlist store in sync with Firestore
export const useWishlistSync = () => {
    const { user } = useAuth();
    const { setWishlist, items: localWishlist } = useWishlistStore();

    useEffect(() => {
        // If there's no user, we don't sync
        if (!user) {
            return;
        }

        // Reference to the user's wishlist document in Firestore
        const wishlistRef = doc(db, 'wishlists', user.uid);

        // Listen for real-time changes
        const unsubscribe = onSnapshot(wishlistRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const serverWishlist: string[] = data.items || [];
                setWishlist(serverWishlist);
            } else {
                // If no document exists, the wishlist is empty
                setWishlist([]);
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [user, setWishlist]);
};


// --- Functions to Modify Wishlist ---

/**
 * Adds a product to the user's wishlist in Firestore.
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to add.
 */
export const addToWishlist = async (userId: string, productId: string) => {
    if (!userId || !productId) return;

    const wishlistRef = doc(db, 'wishlists', userId);

    try {
        await updateDoc(wishlistRef, {
            items: arrayUnion(productId)
        });
    } catch (error) {
        // If the document doesn't exist, create it
        if ((error as any).code === 'not-found') {
            await updateDoc(wishlistRef, { items: [productId] });
        } else {
            console.error('Error adding to wishlist:', error);
        }
    }
};

/**
 * Removes a product from the user's wishlist in Firestore.
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to remove.
 */
export const removeFromWishlist = async (userId: string, productId: string) => {
    if (!userId || !productId) return;

    const wishlistRef = doc(db, 'wishlists', userId);

    await updateDoc(wishlistRef, {
        items: arrayRemove(productId)
    });
};

/**
 * Retrieves the user's wishlist from Firestore.
 * @param userId - The ID of the user.
 * @returns An array of product IDs in the wishlist.
 */
export const getWishlist = async (userId: string): Promise<string[]> => {
    if (!userId) return [];

    const wishlistRef = doc(db, 'wishlists', userId);
    const docSnap = await getDoc(wishlistRef);

    if (docSnap.exists()) {
        return docSnap.data().items || [];
    } else {
        return [];
    }
};
