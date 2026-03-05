'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES, CategoryDisplay } from '@/types';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 bg-white text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Categories</h1>
          <p className="text-sm text-gray-600">Categories are predefined (Men/Women). Collections are linked to categories.</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 text-black">
        <h2 className="text-lg font-medium mb-2 text-black">Predefined Categories</h2>
        <p className="text-sm text-gray-600 mb-4">
          Categories (Men and Women) are hardcoded and cannot be modified. 
          To organize products, create <strong className="text-black">Collections</strong> and assign them to either Men or Women category.
          When creating a product, select a collection and the category is automatically assigned.
        </p>
        <a href="/admin/collections/new" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600">
          Create a Collection →
        </a>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Slug</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Description</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="font-bold text-black">{category.name}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="text-gray-600 font-mono text-xs">{category.slug}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="text-gray-600">{category.description}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                      Active
                    </span>
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