// Wishlist State Management with Zustand
import { create } from 'zustand';
import { addToWishlist, removeFromWishlist } from '@/lib/firebase/wishlist';

interface WishlistItem {
    productId: string;
    addedAt: Date;
}

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;

    // Actions
    addItem: (productId: string, userId: string) => void;
    removeItem: (productId: string, userId: string) => void;
    setWishlist: (wishlistItems: string[]) => void;

    // Computed
    isInWishlist: (productId: string) => boolean;
    getWishlistIds: () => string[];
}

export const useWishlistStore = create<WishlistState>()(
    (set, get) => ({
        items: [],
        isLoading: false,

        addItem: async (productId, userId) => {
            if (!userId) return;

            // Optimistically update UI
            set((state) => {
                const exists = state.items.some(item => item.productId === productId);
                if (exists) return state;
                return {
                    items: [...state.items, { productId, addedAt: new Date() }]
                };
            });

            // Update Firestore
            await addToWishlist(userId, productId);
        },

        removeItem: async (productId, userId) => {
            if (!userId) return;

            // Optimistically update UI
            set((state) => ({
                items: state.items.filter(item => item.productId !== productId)
            }));

            // Update Firestore
            await removeFromWishlist(userId, productId);
        },

        setWishlist: (wishlistItems) => {
            set({
                items: wishlistItems.map(id => ({
                    productId: id,
                    addedAt: new Date() // Using current date as approximation
                }))
            });
        },

        isInWishlist: (productId) => {
            return get().items.some(item => item.productId === productId);
        },

        getWishlistIds: () => {
            return get().items.map(item => item.productId);
        }
    })
);