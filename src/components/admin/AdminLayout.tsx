'use client';

import { ReactNode, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Mobile menu button */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Main Content Area */}
            <main className={`${sidebarOpen ? 'md:ml-64' : 'md:ml-0'} min-h-screen bg-white text-black transition-all duration-300`}>
                {/* Top Header Placeholder */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 text-black">
                    <h1 className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 font-display">Eightplux Control Panel</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
                    </div>
                </header>

                <div className="p-4 sm:p-8 bg-white text-black font-body">
                    {children}
                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
