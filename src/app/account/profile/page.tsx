'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Package, User, LogOut, MapPin, CreditCard, ChevronRight, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
  newsletter: boolean;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileData: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: userData.displayName || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          newsletter: userData.newsletter ?? true
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateProfile = async (field: keyof UserProfile, value: string | boolean) => {
    if (!user) return;

    try {
      const updateData: any = { [field]: value };
      await updateDoc(doc(db, 'users', user.uid), updateData);

      if (profile) {
        setProfile({
          ...profile,
          [field]: value
        });
      }

      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditField = (field: keyof UserProfile, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleSaveField = (field: keyof UserProfile) => {
    if (!user || !profile) return;

    handleUpdateProfile(field, editValue);
  };

  const handleUpdateNewsletter = (checked: boolean) => {
    handleUpdateProfile('newsletter', checked);
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-200">
        <div className="text-center">
          <p className="text-gray-500">Profile not found</p>
          <Link href="/account" className="text-red-600 hover:text-red-500">← Back to Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-200 text-black dark:text-gray-100 min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">My Account</p>
            <h1 className="font-display text-red-600 md:text-5xl">Profile Details</h1>
          </div>
          <Link href="/account" className="mt-6 md:mt-0 text-sm font-bold text-red-600 hover:text-red-500 transition-colors">
            ← Back to Account
          </Link>
        </div>

       <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-1">
            <nav className="flex flex-col gap-1">
              <Link href="/account/orders" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-red-600">Orders</span>
                </div>
              </Link>
              <Link href="/account/addresses" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="text-red-600">Addresses</span>
                </div>
              </Link>
              <Link href="/account/payment-methods" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-red-600">Payment Methods</span>
                </div>
              </Link>
              <Link href="/account/profile" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-white dark:hover:bg-white rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-red-600">Profile Details</span>
                </div>
              </Link>
            </nav>
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="font-display text-2xl text-red-600 mb-6">Personal Information</h2>
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">First Name</h3>
                        {editingField === 'firstName' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-200 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none mt-2 text-black"
                          />
                        ) : (
                          <p className="text-lg font-medium text-black">{profile.firstName || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingField === 'firstName' ? (
                          <>
                            <button
                              onClick={() => handleSaveField('firstName')}
                              className="text-[10px] text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="text-[10px] text-gray-500 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditField('firstName', profile.firstName)}
                            className="text-[10px] text-gray-500 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Last Name</h3>
                        {editingField === 'lastName' ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none mt-2 text-black"
                          />
                        ) : (
                          <p className="text-lg font-medium text-white">{profile.lastName || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingField === 'lastName' ? (
                          <>
                            <button
                              onClick={() => handleSaveField('lastName')}
                              className="text-[10px] text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="text-[10px] text-gray-500 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditField('lastName', profile.lastName)}
                            className="text-[10px] text-gray-500 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Email Address</h3>
                        <p className="text-lg font-medium text-white">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Phone Number</h3>
                        {editingField === 'phone' ? (
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none mt-2 text-black"
                          />
                        ) : (
                          <p className="text-lg font-medium text-white">{profile.phone || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingField === 'phone' ? (
                          <>
                            <button
                              onClick={() => handleSaveField('phone')}
                              className="text-[10px] text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="text-[10px] text-gray-500 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditField('phone', profile.phone)}
                            className="text-[10px] text-gray-500 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Date of Birth</h3>
                        {editingField === 'dateOfBirth' ? (
                          <input
                            type="date"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none mt-2 text-black"
                          />
                        ) : (
                          <p className="text-lg font-medium text-white">{profile.dateOfBirth || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingField === 'dateOfBirth' ? (
                          <>
                            <button
                              onClick={() => handleSaveField('dateOfBirth')}
                              className="text-[10px] text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="text-[10px] text-gray-500 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditField('dateOfBirth', profile.dateOfBirth)}
                            className="text-[10px] text-gray-500 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Gender</h3>
                        {editingField === 'gender' ? (
                          <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none mt-2 text-black"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="text-lg font-medium text-white">{profile.gender || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingField === 'gender' ? (
                          <>
                            <button
                              onClick={() => handleSaveField('gender')}
                              className="text-[10px] text-green-600 hover:text-green-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="text-[10px] text-gray-500 hover:text-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditField('gender', profile.gender)}
                            className="text-[10px] text-gray-500 hover:text-black"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Subscription */}
            <section>
              <h2 className="font-display text-2xl mb-6">Newsletter Subscription</h2>
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-black">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Email Marketing</h3>
                    <p className="text-sm text-gray-500 mt-1">Receive updates, promotions, and news via email.</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.newsletter}
                        onChange={(e) => handleUpdateNewsletter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Actions */}
            <section>
              <h2 className="font-display text-2xl mb-6">Account Actions</h2>
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Change Password</h3>
                    <p className="text-sm text-gray-500 mt-1">Update your password for security.</p>
                  </button>
                  <button className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Delete Account</h3>
                    <p className="text-sm text-gray-500 mt-1">Permanently remove your account.</p>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}