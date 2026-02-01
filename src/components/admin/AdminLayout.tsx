'use client';

import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-white text-black">
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="ml-64 min-h-screen bg-white text-black">
                {/* Top Header Placeholder */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 text-black">
                    <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Eightplux Control Panel</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
                    </div>
                </header>

                <div className="p-8 bg-white text-black">
                    {children}
                </div>
            </main>
        </div>
    );
}
