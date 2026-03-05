import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from './config';
import {
    HeroSectionData,
    SportSectionData,
    CasualSectionData,
    StyleSectionData,
    WorldSectionData,
    StageSectionData,
    NewsletterSectionData,
    HeroSlide,
    StyleCard
} from '@/types';

// Section IDs are fixed for the homepage
const SECTION_IDS = {
    hero: 'hero_section',
    sport: 'sport_section',
    casual: 'casual_section',
    style: 'style_section',
    world: 'world_section',
    stage: 'stage_section',
    newsletter: 'newsletter_section',
};

// --- Hero Section ---

export const subscribeToHeroSection = (callback: (data: HeroSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.hero);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as HeroSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateHeroSection = async (data: Partial<HeroSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.hero);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeHeroSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.hero);
    const defaultData: HeroSectionData = {
        id: SECTION_IDS.hero,
        title: 'yOu\'ve been grounded long enough',
        subtitle: 'Let\'s Fly',
        primaryButtonText: 'Shop XX',
        secondaryButtonText: 'Shop XY',
        primaryButtonCollectionId: '',
        secondaryButtonCollectionId: '',
        decorativeImage: '/letsfly.png',
        slides: [
            { id: '1', src: '/Model1.jpg', mediaType: 'image', isActive: true, sortOrder: 0 },
            { id: '2', src: '/define.jpg', mediaType: 'image', isActive: true, sortOrder: 1 },
            { id: '3', src: '/Model3.jpg', mediaType: 'image', isActive: true, sortOrder: 2 },
        ],
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

export const updateHeroSlides = async (slides: HeroSlide[]) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.hero);
    return updateDoc(ref, { slides, updatedAt: serverTimestamp() });
};

// --- Sport Section ---

export const subscribeToSportSection = (callback: (data: SportSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.sport);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as SportSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateSportSection = async (data: Partial<SportSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.sport);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeSportSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.sport);
    const defaultData: SportSectionData = {
        id: SECTION_IDS.sport,
        title: 'play beyond limit',
        subtitle: 'Eightplux Sport',
        badgeText: 'Eightplux Sport',
        mediaUrl: '/sporttt.gif',
        mediaType: 'image',
        primaryButtonText: 'explore',
        secondaryButtonText: 'watch',
        primaryButtonCollectionId: '',
        secondaryButtonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Casual Section ---

export const subscribeToCasualSection = (callback: (data: CasualSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.casual);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as CasualSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateCasualSection = async (data: Partial<CasualSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.casual);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeCasualSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.casual);
    const defaultData: CasualSectionData = {
        id: SECTION_IDS.casual,
        title: 'dress easy, live bold',
        subtitle: 'Eightplux Casual',
        badgeText: 'Eightplux Casual',
        mediaUrl: '/casualbg.gif',
        mediaType: 'image',
        primaryButtonText: 'explore',
        secondaryButtonText: 'watch',
        primaryButtonCollectionId: '',
        secondaryButtonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Style Section ---

export const subscribeToStyleSection = (callback: (data: StyleSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.style);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as StyleSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateStyleSection = async (data: Partial<StyleSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.style);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeStyleSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.style);
    const defaultData: StyleSectionData = {
        id: SECTION_IDS.style,
        badgeText: 'Eightplux Style',
        title: 'every look is a statement',
        cards: [
            { id: '1', mediaUrl: '/tops.jpg', mediaType: 'image', label: 'Jesus top', sortOrder: 0, isActive: true },
            { id: '2', mediaUrl: '/tg.jpg', mediaType: 'image', label: 'Jesus top', sortOrder: 1, isActive: true },
            { id: '3', mediaUrl: '/tp.jpg', mediaType: 'image', label: 'Crop top', sortOrder: 2, isActive: true },
            { id: '4', mediaUrl: '/wb.jpg', mediaType: 'image', label: 'Tank top', sortOrder: 3, isActive: true },
        ],
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

export const updateStyleCards = async (cards: StyleCard[]) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.style);
    return updateDoc(ref, { cards, updatedAt: serverTimestamp() });
};

// --- World Section ---

export const subscribeToWorldSection = (callback: (data: WorldSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.world);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as WorldSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateWorldSection = async (data: Partial<WorldSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.world);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeWorldSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.world);
    const defaultData: WorldSectionData = {
        id: SECTION_IDS.world,
        title: 'the Stage is yours',
        subtitle: 'tag us to be featured in the collective',
        mediaUrl: '/community.gif',
        mediaType: 'image',
        buttonText: 'explore',
        buttonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Stage Section ---

export const subscribeToStageSection = (callback: (data: StageSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.stage);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as StageSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateStageSection = async (data: Partial<StageSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.stage);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeStageSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.stage);
    const defaultData: StageSectionData = {
        id: SECTION_IDS.stage,
        title: 'Define your statement',
        subtitle: '',
        mediaUrl: '/definend.jpg',
        mediaType: 'image',
        buttonText: 'explore',
        buttonCollectionId: '',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Newsletter Section ---

export const subscribeToNewsletterSection = (callback: (data: NewsletterSectionData | null) => void) => {
    const docRef = doc(db, 'homepage_sections', SECTION_IDS.newsletter);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as NewsletterSectionData);
        } else {
            callback(null);
        }
    });
};

export const updateNewsletterSection = async (data: Partial<NewsletterSectionData>) => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.newsletter);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const initializeNewsletterSection = async () => {
    const ref = doc(db, 'homepage_sections', SECTION_IDS.newsletter);
    const defaultData: NewsletterSectionData = {
        id: SECTION_IDS.newsletter,
        title: 'Join the Movement',
        subtitle: 'Subscribe for exclusive drops and updates',
        isActive: true,
        updatedAt: new Date()
    };
    return setDoc(ref, defaultData);
};

// --- Initialize All Sections ---

export const initializeAllHomepageSections = async () => {
    await initializeHeroSection();
    await initializeSportSection();
    await initializeCasualSection();
    await initializeStyleSection();
    await initializeWorldSection();
    await initializeStageSection();
    await initializeNewsletterSection();
};

// --- Get All Sections ---

export const getAllHomepageSections = async () => {
    const sections: Record<string, any> = {};
    
    for (const [key, id] of Object.entries(SECTION_IDS)) {
        const docRef = doc(db, 'homepage_sections', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            sections[key] = { id: docSnap.id, ...docSnap.data() };
        }
    }
    
    return sections;
};
