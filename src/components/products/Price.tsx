'use client';

import { useCurrencyStore } from '@/stores/currencyStore';

interface PriceProps {
    price: number;
    className?: string;
    originalCurrency?: 'USD' | 'NGN';
}

export default function Price({ price, className = '', originalCurrency = 'USD' }: PriceProps) {
    const { currency, exchangeRate, getSymbol, formatPrice } = useCurrencyStore();
    
    // Convert price if original currency differs from selected currency
    let displayPrice = price;
    let displayCurrency = currency;
    
    // If price was set in NGN originally and user selected USD, convert
    if (originalCurrency === 'NGN' && currency === 'USD') {
        displayPrice = price / exchangeRate;
    } 
    // If price was set in USD originally and user selected NGN, convert
    else if (originalCurrency === 'USD' && currency === 'NGN') {
        displayPrice = price * exchangeRate;
    }

    return (
        <span className={className}>
            {formatPrice(price)}
        </span>
    );
}

// Static price display component for non-interactive use
export function StaticPrice({ price, currency = 'USD', exchangeRate = 1550, className = '' }: { 
    price: number; 
    currency?: 'USD' | 'NGN';
    exchangeRate?: number;
    className?: string;
}) {
    const symbol = currency === 'NGN' ? '₦' : '$';
    const convertedPrice = currency === 'NGN' ? price * exchangeRate : price;
    
    const formattedPrice = currency === 'NGN' 
        ? convertedPrice.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    return (
        <span className={className}>
            {symbol}{formattedPrice}
        </span>
    );
}
