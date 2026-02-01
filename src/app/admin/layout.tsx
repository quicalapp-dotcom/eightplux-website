import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Eightplux Admin',
    description: 'Internal Management Dashboard',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}
