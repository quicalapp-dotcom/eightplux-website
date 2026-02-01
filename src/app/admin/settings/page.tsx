'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, DollarSign, Bell, Shield, Info } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        storeName: 'Eightplux',
        contactEmail: 'support@eightplux.com',
        currency: 'NGN',
        taxRate: '7.5',
        shippingFee: '5000',
        maintenanceMode: false,
        newsletterEnabled: true,
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
            if (snap.exists()) {
                setSettings(snap.data() as any);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'global'), {
                ...settings,
                updatedAt: serverTimestamp()
            }, { merge: true });
            alert('Settings saved successfully');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 bg-white text-black">
            <div>
                <h1 className="text-2xl font-bold text-black">Store Settings</h1>
                <p className="text-sm text-gray-600">Manage global application configuration and business rules.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 text-black">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                        <Info className="w-4 h-4" /> General Info
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Store Name</label>
                            <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none text-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Support Email</label>
                            <input value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black" />
                        </div>
                    </div>
                </div>

                {/* Financials */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6 text-black">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500">
                        <DollarSign className="w-4 h-4" /> Financials
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Currency Code</label>
                            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black">
                                <option value="NGN">NGN (₦)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Tax Rate (%)</label>
                            <input type="number" step="0.1" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Flat Shipping Fee</label>
                            <input type="number" value={settings.shippingFee} onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-black" />
                        </div>
                    </div>
                </div>

                {/* Safety & Status */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 text-black">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-red-500" />
                            <div>
                                <p className="text-sm font-bold text-black">Maintenance Mode</p>
                                <p className="text-xs text-gray-600">Take the entire storefront offline for updates.</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-bold text-black">Newsletter Signup</p>
                                <p className="text-xs text-gray-600">Enable or disable the popup newsletter form.</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setSettings({ ...settings, newsletterEnabled: !settings.newsletterEnabled })} className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${settings.newsletterEnabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.newsletterEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={saving} className="px-10 py-4 bg-black text-white rounded-md text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-opacity">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
