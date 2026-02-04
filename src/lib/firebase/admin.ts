import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
    getDoc
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from './config';
import { Product, Order, Collection, Campaign, UserProfile, WorldContent, Category } from '@/types';

// --- Products ---

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        callback(products);
    });
};

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
    const ref = doc(db, 'products', id);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const deleteProduct = async (id: string) => {
    const productRef = doc(db, 'products', id);
    return deleteDoc(productRef);
};

export const getProductById = async (id: string) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
};

// --- Orders ---

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
};

export const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    const ref = doc(db, 'orders', orderId);
    return updateDoc(ref, {
        orderStatus: status,
        updatedAt: serverTimestamp()
    });
};

// --- Storage (Images) ---

export const uploadAdminImage = async (file: File, path: string) => {
    // Convert File to base64
    const reader = new FileReader();
    const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // Upload to Cloudinary
    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            file: base64File,
            folder: `eightplux/${path}`,
            resource_type: 'image',
        }),
    });

    const result = await response.json();

    if (result.success) {
        return result.data.secure_url;
    } else {
        throw new Error(result.error || 'Upload failed');
    }
};

export const deleteAdminImage = async (url: string) => {
    try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};

// --- Collections ---

export const subscribeToCollections = (callback: (collections: Collection[]) => void) => {
    const q = query(collection(db, 'collections'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const collections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collection));
        callback(collections);
    }, (error) => {
        console.error('Error fetching collections:', error);
        callback([]); // Return empty array on error
    });
};

export const createCollection = async (data: any) => {
    return addDoc(collection(db, 'collections'), {
        ...data,
        isActive: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const updateCollection = async (id: string, data: Partial<Collection>) => {
    const ref = doc(db, 'collections', id);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const deleteCollection = async (id: string) => {
    const ref = doc(db, 'collections', id);
    return deleteDoc(ref);
};

export const getCollectionById = async (id: string) => {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Collection;
    }
    return null;
};

// --- Campaigns ---

export const subscribeToCampaigns = (callback: (campaigns: Campaign[]) => void) => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const campaigns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
        callback(campaigns);
    });
};

export const addCampaign = async (data: any) => {
    return addDoc(collection(db, 'campaigns'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const updateCampaign = async (id: string, data: Partial<Campaign>) => {
    const ref = doc(db, 'campaigns', id);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const deleteCampaign = async (id: string) => {
    const ref = doc(db, 'campaigns', id);
    return deleteDoc(ref);
};

// --- Customers (Users with role 'customer') ---

export const subscribeToCustomers = (callback: (customers: UserProfile[]) => void) => {
    const q = query(collection(db, 'users'), where('role', '==', 'customer'));
    return onSnapshot(q, (snapshot) => {
        const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
        callback(customers);
    });
};

// --- Analytics / Dashboard Stats ---

export const subscribeToDashboardStats = (callback: (stats: any) => void) => {
    // This is a simplified real-time aggregation listener
    const ordersRef = collection(db, 'orders');
    const productsRef = collection(db, 'products');
    const usersRef = collection(db, 'users');

    // For real production use, we'd use a cloud function summary doc
    // But for this project, we'll listen to snapshots to compute live
    const unsub = onSnapshot(ordersRef, (ordersSnap) => {
        const orders = ordersSnap.docs.map(d => d.data());
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalOrders = orders.length;

        onSnapshot(usersRef, (usersSnap) => {
            const customersCount = usersSnap.docs.filter(d => d.data().role === 'customer').length;

            onSnapshot(productsRef, (productsSnap) => {
                const productsCount = productsSnap.docs.length;

                callback({
                    totalRevenue,
                    totalOrders,
                    customersCount,
                    productsCount,
                    recentOrders: ordersSnap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() }))
                });
            });
        });
    });

    return unsub;
};

// --- World Content (CMS) ---

export const subscribeToWorldContent = (callback: (content: WorldContent[]) => void) => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorldContent));
        callback(content);
    });
};

export const addWorldContent = async (data: any) => {
    return addDoc(collection(db, 'content'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const updateWorldContent = async (id: string, data: Partial<WorldContent>) => {
    const ref = doc(db, 'content', id);
    return updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        callback(categories);
    });
};

export const deleteWorldContent = async (id: string) => {
    const ref = doc(db, 'content', id);
    return deleteDoc(ref);
};

export const getWorldContentById = async (id: string) => {
    const docRef = doc(db, 'content', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as WorldContent;
    }
    return null;
};
