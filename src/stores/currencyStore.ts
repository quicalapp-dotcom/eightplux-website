// Currency State Management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Country = 'nigeria' | 'usa';
export type Currency = 'NGN' | 'USD';

interface CurrencyState {
    country: Country;
    currency: Currency;
    exchangeRate: number; // USD to NGN rate
    lastUpdated: Date | null;
    loading: boolean;

    // Actions
    setCountry: (country: Country) => void;
    setExchangeRate: (rate: number) => void;
    toggleCountry: () => void;
    fetchExchangeRate: () => Promise<void>;

    // Computed
    getSymbol: () => string;
    formatPrice: (price: number) => string;
    convertPrice: (price: number) => number;
}

// Default exchange rate (will be updated dynamically)
const DEFAULT_EXCHANGE_RATE = 1550; // 1 USD = 1550 NGN (approximate)

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            country: 'usa',
            currency: 'USD',
            exchangeRate: DEFAULT_EXCHANGE_RATE,
            lastUpdated: null,
            loading: false,

            setCountry: (country) => {
                set({
                    country,
                    currency: country === 'nigeria' ? 'NGN' : 'USD',
                    lastUpdated: new Date()
                });
            },

            setExchangeRate: (rate) => {
                set({
                    exchangeRate: rate,
                    lastUpdated: new Date()
                });
            },

            toggleCountry: () => {
                const current = get().country;
                const next = current === 'usa' ? 'nigeria' : 'usa';
                set({
                    country: next,
                    currency: next === 'nigeria' ? 'NGN' : 'USD',
                    lastUpdated: new Date()
                });
            },

            fetchExchangeRate: async () => {
                set({ loading: true });
                try {
                    const response = await fetch('/api/exchange-rate');
                    const data = await response.json();
                    
                    if (data.rate) {
                        set({
                            exchangeRate: data.rate,
                            lastUpdated: new Date(),
                        });
                    } else if (data.fallbackRate) {
                        set({
                            exchangeRate: data.fallbackRate,
                            lastUpdated: new Date(),
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch exchange rate:', error);
                    // Keep current rate if fetch fails
                } finally {
                    set({ loading: false });
                }
            },

            getSymbol: () => {
                return get().currency === 'NGN' ? '₦' : '$';
            },

            formatPrice: (price: number) => {
                const { currency, exchangeRate } = get();
                const convertedPrice = currency === 'NGN' ? price * exchangeRate : price;

                if (currency === 'NGN') {
                    return `₦${convertedPrice.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                }
                return `$${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            },

            convertPrice: (price: number) => {
                const { currency, exchangeRate } = get();
                const convertedPrice = currency === 'NGN' ? price * exchangeRate : price;

                return convertedPrice;
            },
        }),
        {
            name: 'eightplux-currency',
            onRehydrateStorage: () => (state) => {
                state?.fetchExchangeRate();
            },
        }
    )
);
