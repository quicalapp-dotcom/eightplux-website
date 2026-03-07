'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Stores & Contexts
import { useCartStore } from '@/stores/cartStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useAuth } from '@/contexts/AuthContext';

// Modular Components
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutIdentification from '@/components/checkout/CheckoutIdentification';
import CheckoutShipping from '@/components/checkout/CheckoutShipping';
import CheckoutPayment from '@/components/checkout/CheckoutPayment';
import OrderSummary from '@/components/checkout/OrderSummary';

const steps = ['Identification', 'Shipping', 'Payment'];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    const { formatPrice, currency } = useCurrencyStore();
    const { user } = useAuth();
    
    // UI State
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [mounted, setMounted] = useState(false);
    const [discountData, setDiscountData] = useState<{
        discountAmount: number;
        finalTotal: number;
        discountId: string;
        code: string;
    } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: 'Nigeria',
        postalCode: '',
        phone: '',
        shippingMethod: 'standard',
        paymentMethod: 'paystack',
    });

    // Sync email if user is logged in
    useEffect(() => {
        if (user && user.email) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
            if (currentStep === 0) setCurrentStep(1);
        }
    }, [user, currentStep]);

    // Paystack script loading commented out — using direct wallet crypto
    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = 'https://js.paystack.co/v1/inline.js';
    //     script.async = true;
    //     document.body.appendChild(script);
    //     return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    // }, []);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    // Totals
    const subtotal = getSubtotal();
    const shippingCostUSD = formData.shippingMethod === 'express' ? 25 : 0;
    const totalWithDiscount = discountData ? discountData.finalTotal : subtotal + shippingCostUSD;

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setAuthError('');
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            setCurrentStep(1);
        } catch (err: any) {
            setAuthError('Invalid credentials. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleGuestCheckout = () => {
        if (!formData.email) {
            setAuthError('Please enter an email address.');
            return;
        }
        setCurrentStep(1);
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const finalizeOrder = async (reference: string, paymentStatus: 'paid' | 'pending', nowPaymentsOrderId?: string) => {
        const orderRef = doc(collection(db, 'orders'));
        const orderData = {
            id: orderRef.id,
            orderId: nowPaymentsOrderId || `ORDER_${Date.now()}`,
            userId: user?.uid || 'guest',
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            })),
            subtotal,
            shipping: shippingCostUSD,
            discount: discountData?.discountAmount || 0,
            discountCode: discountData?.code || null,
            discountId: discountData?.discountId || null,
            total: totalWithDiscount,
            orderStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending',
            paymentMethod: formData.paymentMethod,
            paymentStatus,
            currency: 'USD',
            shippingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address1: formData.address,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode,
                phone: formData.phone || '',
            },
            email: formData.email,
            paymentReference: reference,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        await setDoc(orderRef, orderData);
        return orderRef.id;
    };

    // Paystack handlePlaceOrder commented out — using direct wallet
    // const handlePlaceOrder = async () => { /* ... paystack logic ... */ };
    const handlePlaceOrder = async () => {}; // no-op; crypto uses handleCryptoConfirm

    const handleCryptoConfirm = async (txHash: string, coin: string) => {
        setLoading(true);
        try {
            const ref = 'CRYPTO-' + Date.now();
            const orderId = await finalizeOrder(ref, 'pending', `ORDER_${Date.now()}`);
            // Store tx hash on the order
            const { doc, updateDoc } = await import('firebase/firestore');
            await updateDoc(doc(db, 'orders', orderId), {
                cryptoTransactionHash: txHash || 'awaiting',
                cryptoCoin: coin,
            });
            clearCart();
            router.push(`/checkout/success?orderId=${orderId}`);
        } catch (err) {
            console.error('Crypto confirm error:', err);
            alert('Order creation failed. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    // Handle NOWPayments redirect - creates order before redirecting to payment
    const handleNowPaymentsOrder = async () => {
        setLoading(true);
        try {
            const nowPaymentsOrderId = `ORDER_${Date.now()}`;
            const orderId = await finalizeOrder('NOWPAYMENTS-' + Date.now(), 'pending', nowPaymentsOrderId);

            // Call NOWPayments API to get invoice URL
            // NOTE: NOWPayments requires USD as the base currency
            const res = await fetch('/api/payments/crypto/create-charge', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-user-id': user?.uid || 'guest',
                },
                body: JSON.stringify({
                    email: formData.email,
                    orderId: nowPaymentsOrderId,
                }),
            });
            
            const data = await res.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.invoice_url) {
                // Store firestore orderId for success page redirect after payment
                sessionStorage.setItem('pendingOrderId', orderId);
                // Redirect to NOWPayments checkout
                window.location.href = data.invoice_url;
            } else {
                throw new Error('Failed to create payment invoice');
            }
        } catch (err: any) {
            console.error('NOWPayments error:', err);
            alert(err.message || 'Payment creation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Empty state
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
                <h1 className="font-tt text-2xl mb-8 lowercase text-gray-400">your bag is empty</h1>
                <Link href="/shop" className="border border-black px-12 py-4 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                    continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row">
                
                {/* Left Section - Process Steps */}
                <div className="flex-1 px-6 py-10 lg:px-20 lg:py-20 border-r border-gray-100">
                    <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                        <CheckoutHeader 
                            currentStep={currentStep} 
                            steps={steps} 
                            setCurrentStep={setCurrentStep} 
                        />

                        {currentStep === 0 && (
                            <CheckoutIdentification 
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleLogin={handleLogin}
                                handleGuestCheckout={handleGuestCheckout}
                                loginLoading={loginLoading}
                                authError={authError}
                            />
                        )}

                        {currentStep === 1 && (
                            <CheckoutShipping 
                                formData={formData}
                                handleInputChange={handleInputChange}
                                setCurrentStep={setCurrentStep}
                                formatPrice={formatPrice}
                                handleNextStep={handleNextStep}
                            />
                        )}

                        {currentStep === 2 && (
                            <CheckoutPayment
                                formData={formData}
                                handleInputChange={handleInputChange}
                                setCurrentStep={setCurrentStep}
                                handlePlaceOrder={handlePlaceOrder}
                                handleCryptoConfirm={handleCryptoConfirm}
                                handleNowPaymentsOrder={handleNowPaymentsOrder}
                                loading={loading}
                                total={totalWithDiscount}
                                currency={currency}
                                email={formData.email}
                                orderId={`ORDER_${Date.now()}`}
                                userId={user?.uid || 'guest'}
                            />
                        )}
                    </div>
                </div>

                {/* Right Section - Order Summary */}
                <OrderSummary
                    items={items}
                    formatPrice={formatPrice}
                    currency={currency}
                    subtotal={subtotal}
                    shippingCostUSD={shippingCostUSD}
                    total={subtotal + shippingCostUSD}
                    onDiscountChange={setDiscountData}
                    userEmail={formData.email}
                />
            </div>
        </div>
    );
}

