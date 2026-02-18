'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { subscribeToProducts, deleteProduct } from '@/lib/firebase/admin';
import { Product } from '@/types';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setProducts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteProduct(id);
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">Products</h1>
                    <p className="text-sm text-gray-600">Manage your store's inventory and catalog.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm text-black">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-black"
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-black">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Product</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Category</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Price</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Status</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold">Inventory</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-12 sm:w-12 sm:h-14 bg-gray-50 rounded-lg overflow-hidden relative border border-gray-200">
                                                {product.images?.[0] && (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black text-sm">{product.name}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-tighter">ID: {product.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{product.category}</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-black">
                                        ₦{product.price.toLocaleString()}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${product.inventory > 0
                                            ? 'bg-green-50 text-green-600 border border-green-100'
                                            : 'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 font-medium text-xs">
                                        {product.inventory} units remaining
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/edit/${product.id}`}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <Edit className="w-4 h-4 text-gray-400" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
