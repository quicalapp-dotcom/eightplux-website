import { collection, doc, getDoc, getDocs, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Unsubscribe } from 'firebase/firestore';

export interface WorldContent {
  id: string;
  title: string;
  slug: string;
  type: 'story' | 'event' | 'press' | 'popup';
  excerpt: string;
  content: string;
  image: string;
  isPublished: boolean;
  publishedAt: Date;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Subscribe to all world content (real-time)
export const subscribeToWorldContent = (
  callback: (data: WorldContent[]) => void
): Unsubscribe => {
  const q = query(collection(db, 'world_content'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      slug: doc.data().slug || '',
      type: doc.data().type || 'story',
      excerpt: doc.data().excerpt || '',
      content: doc.data().content || '',
      image: doc.data().image || '',
      isPublished: doc.data().isPublished ?? false,
      publishedAt: doc.data().publishedAt?.toDate ? doc.data().publishedAt.toDate() : new Date(),
      isActive: doc.data().isActive ?? true,
      sortOrder: doc.data().sortOrder || 0,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : new Date(),
    }));
    callback(data);
  }, (error) => {
    console.error('Error subscribing to world content:', error);
    callback([]);
  });
};

// Get world content by ID
export const getWorldContentById = async (id: string): Promise<WorldContent | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'world_content', id));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        title: docSnap.data().title || '',
        slug: docSnap.data().slug || '',
        type: docSnap.data().type || 'story',
        excerpt: docSnap.data().excerpt || '',
        content: docSnap.data().content || '',
        image: docSnap.data().image || '',
        isPublished: docSnap.data().isPublished ?? false,
        publishedAt: docSnap.data().publishedAt?.toDate ? docSnap.data().publishedAt.toDate() : new Date(),
        isActive: docSnap.data().isActive ?? true,
        sortOrder: docSnap.data().sortOrder || 0,
        createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate() : new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate ? docSnap.data().updatedAt.toDate() : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching world content by ID:', error);
    return null;
  }
};

// Add world content
export const addWorldContent = async (data: Omit<WorldContent, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder' | 'isActive'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'world_content'), {
    ...data,
    sortOrder: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update world content
export const updateWorldContent = async (id: string, data: Partial<WorldContent>): Promise<void> => {
  const docRef = doc(db, 'world_content', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// Delete world content
export const deleteWorldContent = async (id: string): Promise<void> => {
  const docRef = doc(db, 'world_content', id);
  await deleteDoc(docRef);
};
