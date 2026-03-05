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
    X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // We'll need to extend this or create a separate AdminAuthContext later if permissions get complex

// In a real app, we'd check the user's role here to filter these links
const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Package },
    { name: 'Collections', href: '/admin/collections', icon: Layers },
    { name: 'World Content', href: '/admin/world', icon: Globe },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldAlert },
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
            router.push('/login'); // Or /admin/login if we separate them
        } catch (error) {
            console.error('Sign out error', error);
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`w-64 bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-100 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all ${isActive
                                    ? 'bg-black text-white shadow-sm'
                                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                                    }`}
                                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} // Close sidebar on mobile after clicking a link
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
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
