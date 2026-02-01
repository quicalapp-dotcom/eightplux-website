import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Banners - Eightplux Admin',
    description: 'Manage homepage banners',
};

export default function BannersLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}