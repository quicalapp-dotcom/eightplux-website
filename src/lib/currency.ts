// Currency conversion utilities
import { useCurrencyStore } from '@/stores/currencyStore';

// Static conversion function (for use outside React components)
export const convertPrice = (price: number, currency: 'NGN' | 'USD', exchangeRate: number): number => {
    return currency === 'NGN' ? price * exchangeRate : price;
};

// Format price with currency symbol
export const formatPrice = (price: number, currency: 'NGN' | 'USD', exchangeRate: number): string => {
    const convertedPrice = convertPrice(price, currency, exchangeRate);
    
    if (currency === 'NGN') {
        return `₦${convertedPrice.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Get currency symbol
export const getCurrencySymbol = (currency: 'NGN' | 'USD'): string => {
    return currency === 'NGN' ? '₦' : '$';
};

// Country data
export const countries = [
    {
        id: 'usa' as const,
        name: 'United States',
        code: 'US',
        currency: 'USD' as const,
        symbol: '$',
        flag: '🇺🇸'
    },
    {
        id: 'nigeria' as const,
        name: 'Nigeria',
        code: 'NG',
        currency: 'NGN' as const,
        symbol: '₦',
        flag: '🇳🇬'
    }
];
