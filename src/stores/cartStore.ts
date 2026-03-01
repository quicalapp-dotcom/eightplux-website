// Cart State Management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    
    // Notification Actions
    showNotification: (item: CartItem) => void;
    hideNotification: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;

    // State
    lastAddedItem: CartItem | null;
    isNotificationOpen: boolean;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            lastAddedItem: null,
            isNotificationOpen: false,

            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.productId === item.productId && i.size === item.size && i.color === item.color
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }

                    return { items: [...state.items, item] };
                });
            },

            removeItem: (productId, size, color) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.productId === productId && i.size === size && i.color === color)
                    ),
                }));
            },

            updateQuantity: (productId, size, color, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId, size, color);
                    return;
                }

                set((state) => ({
                    items: state.items.map((i) =>
                        i.productId === productId && i.size === size && i.color === color
                            ? { ...i, quantity }
                            : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            showNotification: (item) => set({ lastAddedItem: item, isNotificationOpen: true }),
            hideNotification: () => set({ isNotificationOpen: false }),

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'eightplux-cart',
        }
    )
);
