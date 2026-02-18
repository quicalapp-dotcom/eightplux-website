'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Edit, Trash2, Calendar, Eye, Megaphone } from 'lucide-react';
import { subscribeToCampaigns, deleteCampaign } from '@/lib/firebase/admin';
import { Campaign } from '@/types';
import { format } from 'date-fns';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToCampaigns((data) => {
            setCampaigns(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            try {
                await deleteCampaign(id);
            } catch (error) {
                alert('Error deleting campaign');
            }
        }
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 sm:space-y-6 bg-white text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black">Campaigns</h1>
                    <p className="text-sm text-gray-600">Manage marketing campaigns and drops.</p>
                </div>
                <Link
                    href="/admin/campaigns/new"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs sm:text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Total Campaigns</p>
                    <p className="text-2xl sm:text-3xl font-bold text-black">{campaigns.length}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs sm:text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Active Now</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500">
                        {campaigns.filter(c => c.isActive).length}
                    </p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 text-black">
                    <p className="text-xs sm:text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Past Collections</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-500">
                        {campaigns.filter(c => !c.isActive).length}
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 text-black">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none text-black"
                    />
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-black">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Campaigns Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            ) : filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group text-black">
                            <div className="aspect-[16/9] relative">
                                {campaign.heroMedia.type === 'image' ? (
                                    <Image
                                        src={campaign.heroMedia.url}
                                        alt={campaign.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        <Megaphone className="w-12 h-12 text-white/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest ${campaign.isActive
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-500 text-white'
                                        }`}>
                                        {campaign.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="font-bold text-base sm:text-lg mb-2 text-black">{campaign.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {format(campaign.startDate instanceof Date ? campaign.startDate : new Date(campaign.startDate), 'MMM dd, yyyy')}
                                        {campaign.endDate && ` - ${format(campaign.endDate instanceof Date ? campaign.endDate : new Date(campaign.endDate), 'MMM dd, yyyy')}`}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 gap-2 sm:gap-0">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/campaigns/edit/${campaign.id}`}
                                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4 text-blue-500" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(campaign.id)}
                                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                    <Link
                                        href={`/campaigns/${campaign.slug}`}
                                        target="_blank"
                                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Live
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 sm:py-24 bg-white rounded-lg border border-gray-200">
                    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black">No campaigns found</h3>
                    <p className="text-gray-600 mb-6">Create your first campaign to get started.</p>
                    <Link
                        href="/admin/campaigns/new"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        New Campaign
                    </Link>
                </div>
            )}
        </div>
    );
}
