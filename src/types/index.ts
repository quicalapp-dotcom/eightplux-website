// TypeScript type definitions for Eightplux

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    currency: 'NGN' | 'USD';
    images: string[];
    category: string;
    subcategory?: string;
    gender: 'men' | 'women' | 'unisex';
    sizes: string[];
    colors: ProductColor[];
    tags: string[];
    collectionId?: string;
    campaignId?: string;
    fabric?: string;
    care?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    isSale?: boolean;
    inventory: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductColor {
    name: string;
    hex: string;
    image?: string;
}

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    heroImage?: string;
    tagline?: string;
    products: string[]; // Product IDs
    isActive: boolean;
    publishedAt?: Date;
    createdAt: Date;
}

export interface Campaign {
    id: string;
    name: string;
    slug: string;
    story: string;
    heroMedia: {
        type: 'image' | 'video';
        url: string;
    };
    images: string[];
    products: string[]; // Product IDs
    behindTheScenes?: string[];
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
}

export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'customer' | 'admin' | 'content_manager' | 'order_manager';
    addresses: Address[];
    wishlist: string[]; // Product IDs
    createdAt: Date;
}

export interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    isDefault: boolean;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: 'NGN' | 'USD';
    paymentMethod: 'paystack_card' | 'paystack_transfer' | 'crypto_usdt' | 'crypto_btc' | 'crypto_eth';
    paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    trackingNumber?: string;
    paymentReference?: string;
    cryptoTransactionHash?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Payment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: 'NGN' | 'USD';
    method: string;
    status: 'pending' | 'success' | 'failed';
    reference: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

export interface WorldContent {
    id: string;
    type: 'story' | 'event' | 'press' | 'popup';
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    images?: string[];
    publishedAt: Date;
    isPublished: boolean;
    createdAt: Date;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
}
