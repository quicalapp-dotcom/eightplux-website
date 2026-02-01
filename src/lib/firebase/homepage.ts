import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
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