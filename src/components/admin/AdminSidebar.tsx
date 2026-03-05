'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Layers,
    Megaphone,
    Globe,
    Users,
    BarChart3,
    Settings,
    ShieldAlert,
    LogOut,
    Star,
    Palette,
    Zap,
    X,
    Home,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Admin navigation links organized by category
const adminLinks = [
    // Core Commerce
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, category: 'core' },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag, category: 'core' },
    { name: 'Products', href: '/admin/products', icon: Package, category: 'core' },
    { name: 'Categories', href: '/admin/categories', icon: Package, category: 'core' },
    { name: 'Collections', href: '/admin/collections', icon: Layers, category: 'core' },
    { name: 'Customers', href: '/admin/customers', icon: Users, category: 'core' },

    // Homepage & Content Management
    { name: 'Homepage Sections', href: '/admin/homepage-sections', icon: Home, category: 'content' },
    { name: 'Campaigns', href: '/admin/campaigns', icon: Home, category: 'content' },
    { name: 'World Content', href: '/admin/world', icon: Globe, category: 'content' },

    // Analytics & Settings
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, category: 'settings' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, category: 'settings' },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldAlert, category: 'settings' },
];

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Sign out error', error);
        }
    };

    const renderLinkSection = (category: string, title: string) => {
        const categoryLinks = adminLinks.filter(link => link.category === category);
        if (categoryLinks.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className="px-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                    {title}
                </h3>
                <div className="space-y-1">
                    {categoryLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                                    isActive
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                                }`}
                                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`w-64 bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-100 z-50 transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="font-display font-bold text-xl tracking-widest">
                        EightPlu<span className="text-red-600">+</span> ADMIN
                    </span>
                </div>

                {/* Close button for mobile */}
                <div className="md:hidden p-4 flex justify-end">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    {renderLinkSection('core', 'Core Commerce')}
                    {renderLinkSection('content', 'Homepage & Content')}
                    {renderLinkSection('settings', 'Analytics & Settings')}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay handled in AdminLayout */}
        </>
    );
}
