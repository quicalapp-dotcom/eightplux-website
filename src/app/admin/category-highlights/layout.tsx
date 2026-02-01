import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Category Highlights - Eightplux Admin',
    description: 'Manage category highlights',
};

export default function CategoryHighlightsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminGuard>
    );
}