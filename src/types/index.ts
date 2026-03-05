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
    category: 'men' | 'women';
    subcategory?: string;
    gender: 'men' | 'women' | 'unisex';
    sizes: string[];
    colors: ProductColor[];
    tags: string[];
    collectionId: string;
    isExclusive?: boolean;
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
    category: 'men' | 'women';
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
    createdAt: Date | import('firebase/firestore').Timestamp;
    updatedAt: Date | import('firebase/firestore').Timestamp;
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

// Hardcoded categories - not created by admin
export type Category = 'men' | 'women';

export interface CategoryDisplay {
    id: string;
    name: string;
    slug: string;
    description: string;
    isActive: true;
}

// Predefined category constants
export const CATEGORIES: CategoryDisplay[] = [
    {
        id: 'men',
        name: 'Men',
        slug: 'men',
        description: 'Men\'s collection',
        isActive: true
    },
    {
        id: 'women',
        name: 'Women',
        slug: 'women',
        description: 'Women\'s collection',
        isActive: true
    }
];

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

export interface WhatsNewItem {
    id: string;
    name: string;
    imageUrl: string;
    linkUrl?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaletteItem {
    id: string;
    name: string;
    color: string;
    imageUrl: string;
    linkUrl?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface HeroSlide {
    id: string;
    src: string;
    mediaType: 'image' | 'video';
    title?: string;
    subtitle?: string;
    collectionId?: string;
    buttonText?: string;
    buttonLink?: string;
    isActive: boolean;
    sortOrder: number;
}

export interface HeroSectionData {
    id: string;
    title: string;
    subtitle: string;
    primaryButtonText?: string;
    primaryButtonCollectionId?: string;
    secondaryButtonText?: string;
    secondaryButtonCollectionId?: string;
    decorativeImage?: string;
    slides: HeroSlide[];
    isActive: boolean;
    updatedAt: Date;
}

export interface SportSectionData {
    id: string;
    title: string;
    subtitle: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    primaryButtonText?: string;
    primaryButtonCollectionId?: string;
    secondaryButtonText?: string;
    secondaryButtonCollectionId?: string;
    badgeText: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface CasualSectionData {
    id: string;
    title: string;
    subtitle: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    primaryButtonText?: string;
    primaryButtonCollectionId?: string;
    secondaryButtonText?: string;
    secondaryButtonCollectionId?: string;
    badgeText: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface StyleCard {
    id: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    label: string;
    collectionId?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface StyleSectionData {
    id: string;
    badgeText: string;
    title: string;
    cards: StyleCard[];
    isActive: boolean;
    updatedAt: Date;
}

export interface WorldSectionData {
    id: string;
    title: string;
    subtitle: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    buttonText?: string;
    buttonCollectionId?: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface StageSectionData {
    id: string;
    title: string;
    subtitle: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    buttonText?: string;
    buttonCollectionId?: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface NewsletterSectionData {
    id: string;
    title: string;
    subtitle: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface HomePageData {
    hero: HeroSectionData;
    sport: SportSectionData;
    casual: CasualSectionData;
    style: StyleSectionData;
    world: WorldSectionData;
    stage: StageSectionData;
    newsletter: NewsletterSectionData;
}

export interface HighlightItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl?: string;
    linkText?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Campaign Page Section Types
export interface CampaignHeroData {
    id: string;
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    decorativeImage?: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface CampaignFeatureRowData {
    id: string;
    items: CampaignFeatureItem[];
    isActive: boolean;
    updatedAt: Date;
}

export interface CampaignFeatureItem {
    id: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    collectionId?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface CampaignInteractiveHeroData {
    id: string;
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    primaryButtonText?: string;
    primaryButtonCollectionId?: string;
    secondaryButtonText?: string;
    secondaryButtonCollectionId?: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface CampaignBannerData {
    id: string;
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    showButtons: boolean;
    primaryButtonText?: string;
    primaryButtonCollectionId?: string;
    secondaryButtonText?: string;
    secondaryButtonCollectionId?: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface CampaignPageData {
    hero: CampaignHeroData;
    featureRow1: CampaignFeatureRowData;
    interactiveHero: CampaignInteractiveHeroData;
    featureRow2: CampaignFeatureRowData;
    banner: CampaignBannerData;
    featureRow3: CampaignFeatureRowData;
}
