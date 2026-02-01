'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User as AppUser } from '@/types';

interface AuthContextType {
    user: User | null;
    appUser: AppUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch app user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setAppUser(userDoc.data() as AppUser);
                }
            } else {
                setAppUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore
        const userData: AppUser = {
            id: credential.user.uid,
            email,
            displayName,
            role: 'customer',
            addresses: [],
            wishlist: [],
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', credential.user.uid), userData);
        setAppUser(userData);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);

        // Check if user exists, if not create
        const userDoc = await getDoc(doc(db, 'users', credential.user.uid));

        if (!userDoc.exists()) {
            const userData: AppUser = {
                id: credential.user.uid,
                email: credential.user.email || '',
                displayName: credential.user.displayName || '',
                photoURL: credential.user.photoURL || undefined,
                role: 'customer',
                addresses: [],
                wishlist: [],
                createdAt: new Date(),
            };

            await setDoc(doc(db, 'users', credential.user.uid), userData);
            setAppUser(userData);
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setAppUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, appUser, loading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
