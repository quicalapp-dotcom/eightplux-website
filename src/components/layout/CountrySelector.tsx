'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrencyStore, Country } from '@/stores/currencyStore';
import { countries } from '@/lib/currency';

export default function CountrySelector() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { country, setCountry, getSymbol } = useCurrencyStore();

    const selectedCountry = countries.find(c => c.id === country);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectCountry = (countryId: Country) => {
        setCountry(countryId);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-md transition-colors"
            >
                <img
                    src={`https://flagcdn.com/16x12/${selectedCountry?.id === 'usa' ? 'us' : 'ng'}.png`}
                    srcSet={`https://flagcdn.com/32x24/${selectedCountry?.id === 'usa' ? 'us' : 'ng'}.png 2x,
                             https://flagcdn.com/48x36/${selectedCountry?.id === 'usa' ? 'us' : 'ng'}.png 3x`}
                    width="16"
                    height="12"
                    alt={selectedCountry?.name}
                    className="w-4 h-3 object-cover"
                />
                <span>{selectedCountry?.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md min-w-[220px] z-50">
                    <div className="py-2">
                        {countries.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => handleSelectCountry(c.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                                    country === c.id ? 'bg-gray-50' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://flagcdn.com/16x12/${c.id === 'usa' ? 'us' : 'ng'}.png`}
                                        srcSet={`https://flagcdn.com/32x24/${c.id === 'usa' ? 'us' : 'ng'}.png 2x,
                                                 https://flagcdn.com/48x36/${c.id === 'usa' ? 'us' : 'ng'}.png 3x`}
                                        width="16"
                                        height="12"
                                        alt={c.name}
                                        className="w-4 h-3 object-cover"
                                    />
                                    <div className="text-left">
                                        <p className="font-bold text-black">{c.name}</p>
                                        <p className="text-xs text-gray-500">{c.currency} {c.symbol}</p>
                                    </div>
                                </div>
                                {country === c.id && (
                                    <Check className="w-4 h-4 text-black" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            Exchange Rate: 1 USD = ₦{useCurrencyStore.getState().exchangeRate.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
