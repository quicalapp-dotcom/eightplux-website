import { collection, doc, getDoc, getDocs, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Unsubscribe } from 'firebase/firestore';

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  story: string;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  heroMedia: {
    type: 'image' | 'video';
    url: string;
  };
  products: string[];
  images: string[];
  behindTheScenes: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Subscribe to all campaigns (real-time)
export const subscribeToCampaigns = (
  callback: (campaigns: Campaign[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const campaigns = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        story: data.story || '',
        isActive: data.isActive ?? true,
        startDate: data.startDate?.toDate ? data.startDate.toDate() : null,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : null,
        heroMedia: data.heroMedia || { type: 'image', url: '' },
        products: data.products || [],
        images: data.images || [],
        behindTheScenes: data.behindTheScenes || [],
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      } as Campaign;
    });
    callback(campaigns);
  }, (error) => {
    console.error('Error subscribing to campaigns:', error);
    callback([]);
  });
};

// Get campaign by ID
export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'campaigns', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || '',
        story: data.story || '',
        isActive: data.isActive ?? true,
        startDate: data.startDate?.toDate ? data.startDate.toDate() : null,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : null,
        heroMedia: data.heroMedia || { type: 'image', url: '' },
        products: data.products || [],
        images: data.images || [],
        behindTheScenes: data.behindTheScenes || [],
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching campaign by ID:', error);
    return null;
  }
};

// Get campaign by slug
export const getCampaignBySlug = async (slug: string): Promise<Campaign | null> => {
  try {
    const q = query(collection(db, 'campaigns'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        story: data.story || '',
        isActive: data.isActive ?? true,
        startDate: data.startDate?.toDate ? data.startDate.toDate() : null,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : null,
        heroMedia: data.heroMedia || { type: 'image', url: '' },
        products: data.products || [],
        images: data.images || [],
        behindTheScenes: data.behindTheScenes || [],
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching campaign by slug:', error);
    return null;
  }
};

// Add campaign
export const addCampaign = async (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'campaigns'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update campaign
export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<void> => {
  const docRef = doc(db, 'campaigns', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// Delete campaign
export const deleteCampaign = async (id: string): Promise<void> => {
  const docRef = doc(db, 'campaigns', id);
  await deleteDoc(docRef);
};
