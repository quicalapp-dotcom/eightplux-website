'use client';

import { useState } from 'react';
import { UserPlus, Shield, X, Mail } from 'lucide-react';

// Mock data for now, will connect to Firestore 'users' collection with role filter
const MOCK_ADMINS = [
    { id: '1', email: 'super@eightplux.com', role: 'super_admin', name: 'System Admin', lastLogin: new Date() },
    { id: '2', email: 'orders@eightplux.com', role: 'order_manager', name: 'Order Staff', lastLogin: new Date(Date.now() - 86400000) },
    { id: '3', email: 'editor@eightplux.com', role: 'content_manager', name: 'Lead Editor', lastLogin: new Date(Date.now() - 172800000) },
];

export default function AdminUsersPage() {
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Users</h1>
                    <p className="text-sm text-gray-500">Manage access and roles for your team.</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Admin
                </button>
            </div>

            {/* Invite Modal (Simplified inline for now) */}
            {isInviteOpen && (
                <div className="bg-white dark:bg-[#111] p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg mb-6 relative animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => setIsInviteOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-[#222] rounded-full">
                        <X className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-lg mb-4">Invite New Admin</h3>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Email Address</label>
                            <input type="email" placeholder="colleague@eightplux.com" className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500">Role</label>
                            <select className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md">
                                <option value="order_manager">Order Manager (Orders Only)</option>
                                <option value="content_manager">Content Manager (Products/CMS)</option>
                                <option value="super_admin">Super Admin (Full Access)</option>
                            </select>
                        </div>
                        <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 h-10">
                            Send Invite
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#161616] text-gray-500 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Last Login</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                            <span className="font-bold text-xs">{admin.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{admin.name}</p>
                                            <p className="text-xs text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${admin.role === 'super_admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                        }`}>
                                        {admin.role === 'super_admin' && <Shield className="w-3 h-3" />}
                                        {admin.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {admin.lastLogin.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wide">
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
