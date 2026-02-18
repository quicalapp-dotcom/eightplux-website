import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export interface HomepageContent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryHighlight {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsNewItem {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string;
  price?: string;
  isSale?: boolean;
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

// Get all homepage content
export const getHomepageContent = async (): Promise<HomepageContent[]> => {
  try {
    const q = query(
      collection(db, 'homepage_content'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      subtitle: doc.data().subtitle || '',
      description: doc.data().description || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      linkText: doc.data().linkText || '',
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return [];
  }
};

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const q = query(
      collection(db, 'banners'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      subtitle: doc.data().subtitle || '',
      description: doc.data().description || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      linkText: doc.data().linkText || '',
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

// Get category highlights
export const getCategoryHighlights = async (): Promise<CategoryHighlight[]> => {
  try {
    const q = query(
      collection(db, 'category_highlights'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      description: doc.data().description || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching category highlights:', error);
    return [];
  }
};

// Get specific homepage content by ID
export const getHomepageContentById = async (id: string): Promise<HomepageContent | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'homepage_content', id));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        title: docSnap.data().title || '',
        subtitle: docSnap.data().subtitle || '',
        description: docSnap.data().description || '',
        imageUrl: docSnap.data().imageUrl || '',
        linkUrl: docSnap.data().linkUrl || '',
        linkText: docSnap.data().linkText || '',
        sortOrder: docSnap.data().sortOrder || 0,
        isActive: docSnap.data().isActive || false,
        createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate() : new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate ? docSnap.data().updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching homepage content by ID:', error);
    return null;
  }
};

// Add new homepage content
export const addHomepageContent = async (data: Omit<HomepageContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'homepage_content'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding homepage content:', error);
    throw error;
  }
};

// Update homepage content
export const updateHomepageContent = async (id: string, data: Partial<HomepageContent>) => {
  try {
    const docRef = doc(db, 'homepage_content', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    throw error;
  }
};

// Delete homepage content
export const deleteHomepageContent = async (id: string) => {
  try {
    const docRef = doc(db, 'homepage_content', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting homepage content:', error);
    throw error;
  }
};

// Add new banner
export const addBanner = async (data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'banners'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding banner:', error);
    throw error;
  }
};

// Update banner
export const updateBanner = async (id: string, data: Partial<Banner>) => {
  try {
    const docRef = doc(db, 'banners', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// Delete banner
export const deleteBanner = async (id: string) => {
  try {
    const docRef = doc(db, 'banners', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Add new category highlight
export const addCategoryHighlight = async (data: Omit<CategoryHighlight, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'category_highlights'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category highlight:', error);
    throw error;
  }
};

// Update category highlight
export const updateCategoryHighlight = async (id: string, data: Partial<CategoryHighlight>) => {
  try {
    const docRef = doc(db, 'category_highlights', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category highlight:', error);
    throw error;
  }
};

// Get all "What's New" items
export const getWhatsNewItems = async (): Promise<WhatsNewItem[]> => {
  try {
    const q = query(
      collection(db, 'whats_new'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      price: doc.data().price || '$129',
      isSale: doc.data().isSale || false,
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching what\'s new items:', error);
    return [];
  }
};

// Add new "What's New" item
export const addWhatsNewItem = async (data: Omit<WhatsNewItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'whats_new'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding what\'s new item:', error);
    throw error;
  }
};

// Update "What's New" item
export const updateWhatsNewItem = async (id: string, data: Partial<WhatsNewItem>) => {
  try {
    const docRef = doc(db, 'whats_new', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating what\'s new item:', error);
    throw error;
  }
};

// Delete "What's New" item
export const deleteWhatsNewItem = async (id: string) => {
  try {
    const docRef = doc(db, 'whats_new', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting what\'s new item:', error);
    throw error;
  }
};

// Get all palette items
export const getPaletteItems = async (): Promise<PaletteItem[]> => {
  try {
    const q = query(
      collection(db, 'palettes'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      color: doc.data().color || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching palette items:', error);
    return [];
  }
};

// Add new palette item
export const addPaletteItem = async (data: Omit<PaletteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'palettes'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding palette item:', error);
    throw error;
  }
};

// Update palette item
export const updatePaletteItem = async (id: string, data: Partial<PaletteItem>) => {
  try {
    const docRef = doc(db, 'palettes', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating palette item:', error);
    throw error;
  }
};

// Delete palette item
export const deletePaletteItem = async (id: string) => {
  try {
    const docRef = doc(db, 'palettes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting palette item:', error);
    throw error;
  }
};

// Get all highlight items
export const getHighlightItems = async (): Promise<HighlightItem[]> => {
  try {
    const q = query(
      collection(db, 'highlights'),
      where('isActive', '==', true),
      orderBy('sortOrder')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      description: doc.data().description || '',
      imageUrl: doc.data().imageUrl || '',
      linkUrl: doc.data().linkUrl || '',
      linkText: doc.data().linkText || '',
      sortOrder: doc.data().sortOrder || 0,
      isActive: doc.data().isActive || false,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
  } catch (error) {
    console.error('Error fetching highlight items:', error);
    return [];
  }
};

// Add new highlight item
export const addHighlightItem = async (data: Omit<HighlightItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'highlights'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding highlight item:', error);
    throw error;
  }
};

// Update highlight item
export const updateHighlightItem = async (id: string, data: Partial<HighlightItem>) => {
  try {
    const docRef = doc(db, 'highlights', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating highlight item:', error);
    throw error;
  }
};

// Delete highlight item
export const deleteHighlightItem = async (id: string) => {
  try {
    const docRef = doc(db, 'highlights', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting highlight item:', error);
    throw error;
  }
};