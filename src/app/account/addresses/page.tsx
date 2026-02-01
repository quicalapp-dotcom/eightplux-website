'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { MapPin, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchAddresses();
    }
  }, [user, loading, router]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userAddresses = userData.addresses || [];
        setAddresses(userAddresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    
    try {
      const newAddr = {
        ...newAddress,
        id: Date.now().toString() // Temporary ID, in real app you'd use Firestore's auto-generated ID
      };
      
      const updatedAddresses = [...addresses, newAddr as Address];
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      setAddresses(updatedAddresses);
      setNewAddress({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: '',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleUpdateAddress = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedAddresses = addresses.map(addr => 
        addr.id === id ? { ...addr, ...newAddress } : addr
      );
      
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      setAddresses(updatedAddresses);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const updatedAddresses = addresses.filter(addr => addr.id !== id);
        await updateDoc(doc(db, 'users', user.uid), {
          addresses: updatedAddresses
        });
        
        setAddresses(updatedAddresses);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (loading || loadingAddresses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
            <h1 className="font-display text-4xl md:text-5xl">Addresses</h1>
          </div>
          <Link href="/account" className="mt-6 md:mt-0 text-sm font-bold text-red-600 hover:text-red-500 transition-colors">
            ← Back to Account
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <nav className="flex flex-col gap-1">
              <Link href="/account/orders" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Orders</span>
                </div>
              </Link>
              <Link href="/account/addresses" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#141414] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span>Addresses</span>
                </div>
              </Link>
              <Link href="/account/payment-methods" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Payment Methods</span>
                </div>
              </Link>
              <Link href="/account/profile" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile Details</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Add New Address Form */}
            <section>
              <h2 className="font-display text-2xl mb-6">Add New Address</h2>
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">First Name</label>
                    <input
                      type="text"
                      value={newAddress.firstName}
                      onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Last Name</label>
                    <input
                      type="text"
                      value={newAddress.lastName}
                      onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Address Line 1</label>
                    <input
                      type="text"
                      value={newAddress.address1}
                      onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.address2}
                      onChange={(e) => setNewAddress({...newAddress, address2: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Country</label>
                    <select
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Postal Code</label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={handleAddAddress}
                    className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>
              </div>
            </section>

            {/* Saved Addresses */}
            <section>
              <h2 className="font-display text-2xl mb-6">Saved Addresses</h2>
              
              {addresses.length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                  <p className="text-sm text-gray-500 mb-6">Add an address to speed up checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg relative">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-sm uppercase tracking-widest">{address.firstName} {address.lastName}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(address.id);
                              setNewAddress({
                                firstName: address.firstName,
                                lastName: address.lastName,
                                address1: address.address1,
                                address2: address.address2 || '',
                                city: address.city,
                                state: address.state,
                                country: address.country,
                                postalCode: address.postalCode,
                                phone: address.phone,
                                isDefault: address.isDefault
                              });
                            }}
                            className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-[10px] text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {address.address1}<br />
                        {address.address2 && `${address.address2}<br />`}
                        {address.city}, {address.state}, {address.postalCode}<br />
                        {address.country}<br />
                        {address.phone}
                      </p>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="mt-4 text-xs font-bold text-red-600 hover:text-red-500"
                        >
                          Set as Default
                        </button>
                      )}
                      
                      {editingId === address.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-500">Address Line 1</label>
                              <input
                                type="text"
                                value={newAddress.address1}
                                onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                                className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateAddress(address.id)}
                                className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-500"
                              >
                                <Save className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black"
                              >
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}