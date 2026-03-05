import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import {
    CampaignHeroData,
    CampaignFeatureRowData,
    CampaignInteractiveHeroData,
    CampaignBannerData,
    CampaignPageData
} from '@/types';

// Section IDs are fixed for the campaign page
const SECTION_IDS = {
    hero: 'campaign_hero',
    featureRow1: 'campaign_feature_row_1',
    interactiveHero: 'campaign_interactive_hero',
    featureRow2: 'campaign_feature_row_2',
    banner: 'campaign_banner',
    featureRow3: 'campaign_feature_row_3',
};

// --- Campaign Hero Section ---

export const subscribeToCampaignHero = (callback: (data: CampaignHeroData | null) => void) => {
    const docRef = doc(db, 'campaign_sections', SECTION_IDS.hero);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as CampaignHeroData);
        } else {
            callback(null);
        }
    });
};

export const updateCampaignHero = async (data: Partial<CampaignHeroData>) => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.hero);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeCampaignHero = async () => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.hero);
    const defaultData: CampaignHeroData = {
        id: SECTION_IDS.hero,
        title: 'every look is a statement',
        mediaUrl: '/caa.jpg',
        mediaType: 'image',
        decorativeImage: '/letsfly.png',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Campaign Feature Row Section ---

export const subscribeToCampaignFeatureRow = (rowId: string, callback: (data: CampaignFeatureRowData | null) => void) => {
    const docRef = doc(db, 'campaign_sections', rowId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as CampaignFeatureRowData);
        } else {
            callback(null);
        }
    });
};

export const updateCampaignFeatureRow = async (rowId: string, data: Partial<CampaignFeatureRowData>) => {
    const ref = doc(db, 'campaign_sections', rowId);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeCampaignFeatureRow = async (rowId: string, leftImage: string, rightImage: string) => {
    const ref = doc(db, 'campaign_sections', rowId);
    const defaultData: CampaignFeatureRowData = {
        id: rowId,
        leftMediaUrl: leftImage,
        leftMediaType: 'image',
        rightMediaUrl: rightImage,
        rightMediaType: 'image',
        leftCollectionId: '',
        rightCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Campaign Interactive Hero Section ---

export const subscribeToCampaignInteractiveHero = (callback: (data: CampaignInteractiveHeroData | null) => void) => {
    const docRef = doc(db, 'campaign_sections', SECTION_IDS.interactiveHero);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as CampaignInteractiveHeroData);
        } else {
            callback(null);
        }
    });
};

export const updateCampaignInteractiveHero = async (data: Partial<CampaignInteractiveHeroData>) => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.interactiveHero);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeCampaignInteractiveHero = async () => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.interactiveHero);
    const defaultData: CampaignInteractiveHeroData = {
        id: SECTION_IDS.interactiveHero,
        title: 'play beyond limit',
        mediaUrl: '/sportbg.gif',
        mediaType: 'image',
        primaryButtonText: 'shop XX',
        secondaryButtonText: 'shop XY',
        primaryButtonCollectionId: '',
        secondaryButtonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Campaign Banner Section ---

export const subscribeToCampaignBanner = (callback: (data: CampaignBannerData | null) => void) => {
    const docRef = doc(db, 'campaign_sections', SECTION_IDS.banner);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as CampaignBannerData);
        } else {
            callback(null);
        }
    });
};

export const updateCampaignBanner = async (data: Partial<CampaignBannerData>) => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.banner);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeCampaignBanner = async () => {
    const ref = doc(db, 'campaign_sections', SECTION_IDS.banner);
    const defaultData: CampaignBannerData = {
        id: SECTION_IDS.banner,
        title: 'dress easy live bold',
        mediaUrl: '/casualbg.gif',
        mediaType: 'image',
        showButtons: true,
        primaryButtonText: 'Shop XX',
        secondaryButtonText: 'Shop XY',
        primaryButtonCollectionId: '',
        secondaryButtonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Initialize All Campaign Sections ---

export const initializeAllCampaignSections = async () => {
    await initializeCampaignHero();
    await initializeCampaignFeatureRow(SECTION_IDS.featureRow1, '/middle.jpg', '/17.png');
    await initializeCampaignInteractiveHero();
    await initializeCampaignFeatureRow(SECTION_IDS.featureRow2, '/20.png', '/21.png');
    await initializeCampaignBanner();
    await initializeCampaignFeatureRow(SECTION_IDS.featureRow3, '/22.png', '/23.png');
};

// --- Get All Campaign Sections ---

export const getAllCampaignSections = async () => {
    const sections: Record<string, any> = {};
    
    for (const [key, id] of Object.entries(SECTION_IDS)) {
        const docRef = doc(db, 'campaign_sections', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            sections[key] = { id: docSnap.id, ...docSnap.data() };
        }
    }
    
    return sections;
};
