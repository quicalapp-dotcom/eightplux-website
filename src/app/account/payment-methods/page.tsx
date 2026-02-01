'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { CreditCard, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, 'id'>>({
    type: 'card',
    lastFour: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    isDefault: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchPaymentMethods();
    }
  }, [user, loading, router]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPaymentMethods = userData.paymentMethods || [];
        setPaymentMethods(userPaymentMethods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user) return;
    
    try {
      const newMethod = {
        ...newPaymentMethod,
        id: Date.now().toString() // Temporary ID, in real app you'd use Firestore's auto-generated ID
      };
      
      const updatedMethods = [...paymentMethods, newMethod as PaymentMethod];
      await updateDoc(doc(db, 'users', user.uid), {
        paymentMethods: updatedMethods
      });
      
      setPaymentMethods(updatedMethods);
      setNewPaymentMethod({
        type: 'card',
        lastFour: '',
        expiryMonth: '',
        expiryYear: '',
        cardholderName: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleUpdatePaymentMethod = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedMethods = paymentMethods.map(method => 
        method.id === id ? { ...method, ...newPaymentMethod } : method
      );
      
      await updateDoc(doc(db, 'users', user.uid), {
        paymentMethods: updatedMethods
      });
      
      setPaymentMethods(updatedMethods);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        const updatedMethods = paymentMethods.filter(method => method.id !== id);
        await updateDoc(doc(db, 'users', user.uid), {
          paymentMethods: updatedMethods
        });
        
        setPaymentMethods(updatedMethods);
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      
      await updateDoc(doc(db, 'users', user.uid), {
        paymentMethods: updatedMethods
      });
      
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  if (loading || loadingMethods) {
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
            <h1 className="font-display text-4xl md:text-5xl">Payment Methods</h1>
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
              <Link href="/account/addresses" className="flex items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#141414] rounded-lg transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>Addresses</span>
                </div>
              </Link>
              <Link href="/account/payment-methods" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#141414] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
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
            {/* Add New Payment Method Form */}
            <section>
              <h2 className="font-display text-2xl mb-6">Add New Payment Method</h2>
              <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Cardholder Name</label>
                    <input
                      type="text"
                      value={newPaymentMethod.cardholderName}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Card Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 16) {
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            lastFour: value.slice(-4)
                          });
                        }
                      }}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Expiry Month</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newPaymentMethod.expiryMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) {
                          setNewPaymentMethod({...newPaymentMethod, expiryMonth: value});
                        }
                      }}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="MM"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Expiry Year</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newPaymentMethod.expiryYear}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) {
                          setNewPaymentMethod({...newPaymentMethod, expiryYear: value});
                        }
                      }}
                      className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none"
                      placeholder="YY"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={handleAddPaymentMethod}
                    className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            </section>

            {/* Saved Payment Methods */}
            <section>
              <h2 className="font-display text-2xl mb-6">Saved Payment Methods</h2>
              
              {paymentMethods.length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
                  <CreditCard className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                  <p className="text-sm text-gray-500 mb-6">Add a payment method to speed up checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg relative">
                      {method.isDefault && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">VISA</span>
                          </div>
                          <h3 className="font-bold text-sm uppercase tracking-widest">•••• •••• •••• {method.lastFour}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(method.id);
                              setNewPaymentMethod({
                                type: method.type,
                                lastFour: method.lastFour,
                                expiryMonth: method.expiryMonth,
                                expiryYear: method.expiryYear,
                                cardholderName: method.cardholderName,
                                isDefault: method.isDefault
                              });
                            }}
                            className="text-[10px] text-gray-500 hover:text-black dark:hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="text-[10px] text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        Expires: {method.expiryMonth}/{method.expiryYear}<br />
                        {method.cardholderName}
                      </p>
                      
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="mt-4 text-xs font-bold text-red-600 hover:text-red-500"
                        >
                          Set as Default
                        </button>
                      )}
                      
                      {editingId === method.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs font-bold uppercase text-gray-500">Cardholder Name</label>
                              <input
                                type="text"
                                value={newPaymentMethod.cardholderName}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                                className="w-full p-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePaymentMethod(method.id)}
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