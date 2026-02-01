'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminRole, PERMISSIONS } from '@/types/admin';

// In a real app, this would verify the user's role against Firestore
// For now, we'll verify they are logged in and assume super_admin for dev
// You would fetch the user's role document here

interface AdminGuardProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

export default function AdminGuard({ children, requiredPermission }: AdminGuardProps) {
    const { user, isAdmin, role, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login?redirect=/admin');
                return;
            }

            if (!isAdmin) {
                // If logged in but not an admin, redirect to home or account
                router.push('/account');
                return;
            }

            // At this point, they are an admin
            setIsAuthorized(true);
        }
    }, [user, isAdmin, loading, router, requiredPermission]);

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">Verifying Access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
