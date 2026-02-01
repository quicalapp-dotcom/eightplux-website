import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Homepage Content - Eightplux Admin',
    description: 'Manage homepage content sections',
};

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}