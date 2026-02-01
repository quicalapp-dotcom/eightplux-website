'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CreditCard, Lock, Check } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const steps = ['Information', 'Shipping', 'Payment'];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: 'United States',
        postalCode: '',
        phone: '',
        shippingMethod: 'standard',
    });

    // Calculate totals
    const subtotal = getSubtotal();
    const shippingCost = formData.shippingMethod === 'express' ? 25 : 0;
    const total = subtotal + shippingCost;

    // Wait for hydration
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        if (items.length === 0) {
            // Redirect if cart is empty, but maybe wait a bit or show a message?
            // For now, let's just let them see the empty state or redirect
            // router.push('/shop'); 
        }
    }, [items, router]);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] text-black dark:text-white">
                <h1 className="font-display text-2xl mb-4">Your bag is empty</h1>
                <Link href="/shop" className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-xs font-bold tracking-widest">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            clearCart();
            router.push('/checkout/success'); // Create this page next
        }, 2000);
    };

    return (
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen flex flex-col lg:flex-row font-sans">
            {/* Left Column - Main Content */}
            <div className="w-full lg:w-[58%] px-6 py-8 lg:px-20 lg:py-16 order-2 lg:order-1">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="font-display text-2xl tracking-widest font-bold">
                        EIGHTPLU<span className="text-red-600">+</span>
                    </Link>

                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-xs mt-6 text-gray-500">
                        <Link href="/cart" className="hover:text-red-600 transition-colors">Cart</Link>
                        <ChevronRight className="w-3 h-3" />
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-center">
                                <span className={`${index === currentStep ? 'text-black dark:text-white font-bold' : ''} ${index < currentStep ? 'text-red-600' : ''}`}>
                                    {step}
                                </span>
                                {index < steps.length - 1 && <ChevronRight className="w-3 h-3 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleNextStep}>
                    {/* STEP 1: INFORMATION */}
                    {currentStep === 0 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-display uppercase tracking-widest mb-4">Contact</h2>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-display uppercase tracking-widest mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-2 w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="col-span-2 w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    >
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="France">France</option>
                                        <option value="Japan">Japan</option>
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone (optional)"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="col-span-2 w-full bg-transparent border border-gray-300 dark:border-gray-700 p-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SHIPPING */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="border border-gray-200 dark:border-gray-800 rounded p-4 mb-6 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-gray-500">Contact</span>
                                    <span>{formData.email}</span>
                                    <button type="button" onClick={() => setCurrentStep(0)} className="text-red-600 text-xs hover:underline">Change</button>
                                </div>
                                <div className="flex justify-between py-2 pt-4">
                                    <span className="text-gray-500">Ship to</span>
                                    <span className="truncate max-w-[200px]">{formData.address}, {formData.city}</span>
                                    <button type="button" onClick={() => setCurrentStep(0)} className="text-red-600 text-xs hover:underline">Change</button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-display uppercase tracking-widest mb-4">Shipping Method</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between border p-4 cursor-pointer transition-all ${formData.shippingMethod === 'standard' ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="standard"
                                                checked={formData.shippingMethod === 'standard'}
                                                onChange={handleInputChange}
                                                className="text-black focus:ring-black"
                                            />
                                            <span className="text-sm font-medium">Standard Shipping (3-7 Business Days)</span>
                                        </div>
                                        <span className="text-sm font-bold">Free</span>
                                    </label>

                                    <label className={`flex items-center justify-between border p-4 cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-gray-200 dark:border-gray-800'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="express"
                                                checked={formData.shippingMethod === 'express'}
                                                onChange={handleInputChange}
                                                className="text-black focus:ring-black"
                                            />
                                            <span className="text-sm font-medium">Express Shipping (1-3 Business Days)</span>
                                        </div>
                                        <span className="text-sm font-bold">$25.00</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="border border-gray-200 dark:border-gray-800 rounded p-4 mb-6 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-gray-500">Contact</span>
                                    <span>{formData.email}</span>
                                    <button type="button" onClick={() => setCurrentStep(0)} className="text-red-600 text-xs hover:underline">Change</button>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-gray-500">Ship to</span>
                                    <span className="truncate max-w-[200px]">{formData.address}, {formData.city}</span>
                                    <button type="button" onClick={() => setCurrentStep(0)} className="text-red-600 text-xs hover:underline">Change</button>
                                </div>
                                <div className="flex justify-between py-2 pt-4">
                                    <span className="text-gray-500">Method</span>
                                    <span>{formData.shippingMethod === 'standard' ? 'Standard · Free' : 'Express · $25.00'}</span>
                                    <button type="button" onClick={() => setCurrentStep(1)} className="text-red-600 text-xs hover:underline">Change</button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-display uppercase tracking-widest mb-4">Payment</h2>
                                <div className="bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-gray-800 p-8 text-center rounded">
                                    <Lock className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                                    <p className="text-sm text-gray-500 mb-4">
                                        All transactions are secure and encrypted.
                                    </p>
                                    <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                        <button type="button" className="bg-[#111] text-white py-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            <CreditCard className="w-4 h-4" /> Pay with Card
                                        </button>
                                        <button type="button" className="bg-[#5433FF] text-white py-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            Paystack / Flutterwave
                                        </button>
                                        <button type="button" className="bg-[#F7931A] text-white py-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            Pay with Crypto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex items-center justify-between">
                        {currentStep > 0 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep((prev) => prev - 1)}
                                className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Return to {steps[currentStep - 1]}
                            </button>
                        ) : (
                            <Link href="/cart" className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                                <ChevronLeft className="w-4 h-4" /> Return to Cart
                            </Link>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-lg flex items-center gap-2"
                        >
                            {loading ? 'Processing...' : currentStep === steps.length - 1 ? 'Pay Now' : 'Continue to ' + steps[currentStep + 1]}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[42%] bg-gray-50 dark:bg-[#141414] px-6 py-8 lg:px-12 lg:py-16 order-1 lg:order-2 border-l border-gray-200 dark:border-gray-800">
                <div className="sticky top-10">
                    <h2 className="text-lg font-display uppercase tracking-widest mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 items-center">
                                <div className="relative w-16 h-20 bg-white rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                                </div>
                                <p className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toLocaleString()}`}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6">
                        <div className="flex justify-between items-baseline">
                            <span className="text-base font-medium">Total</span>
                            <div className="text-right">
                                <span className="text-sm text-gray-400 mr-2">USD</span>
                                <span className="text-2xl font-display font-bold">${total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
