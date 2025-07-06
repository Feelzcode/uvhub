import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Currency, CurrencyInfo, LocationInfo, CurrencyState, CurrencyActions } from '../types';

const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    exchangeRate: 1500, // Approximate rate to USD
  },
  GHS: {
    code: 'GHS',
    symbol: '₵',
    name: 'Ghanaian Cedi',
    exchangeRate: 12, // Approximate rate to USD
  },
};

const initialState: CurrencyState = {
  currentCurrency: 'USD',
  location: null,
  loading: false,
  error: null,
  currencies: CURRENCIES,
};

export const useCurrencyStore = create<CurrencyState & CurrencyActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setCurrency: (currency) => set({ currentCurrency: currency }),

        setLocation: (location) => set({ location }),

        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error, loading: false }),

        detectLocation: async () => {
          const { setLoading, setError, setLocation, setCurrency, location, currentCurrency } = get();

          // Check if we already have location data
          if (location) {
            console.log('Using cached location data:', location);
            return; // Exit early if location is already detected
          }

          setLoading(true);
          setError(null);

          try {
            // Use IP-based geolocation service
            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
              throw new Error('Failed to fetch location data');
            }

            const locationData = await response.json();

            const locationInfo: LocationInfo = {
              country: locationData.country_name,
              countryCode: locationData.country_code,
              city: locationData.city,
              region: locationData.region,
            };

            setLocation(locationInfo);

            // Set currency based on country
            let currency: Currency = 'USD';

            if (locationData.country_code === 'NG') {
              currency = 'NGN';
            } else if (locationData.country_code === 'GH') {
              currency = 'GHS';
            }

            setCurrency(currency);

          } catch (error) {
            console.error('Location detection error:', error);
            setError(error instanceof Error ? error.message : 'Failed to detect location');

            // Fallback to USD if location detection fails
            setCurrency('USD');
          } finally {
            setLoading(false);
          }
        },

        formatPrice: (price, currency) => {
          const { currencies, currentCurrency } = get();
          const targetCurrency = currency || currentCurrency;
          const currencyInfo = currencies[targetCurrency];

          // Convert price if needed
          let displayPrice = price;
          if (currency !== targetCurrency) {
            displayPrice = get().convertPrice(price, currency || 'USD', targetCurrency);
          }

          // Format based on currency
          switch (targetCurrency) {
            case 'NGN':
              return `${currencyInfo.symbol}${displayPrice.toLocaleString('en-NG', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`;

            case 'GHS':
              return `${currencyInfo.symbol}${displayPrice.toLocaleString('en-GH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;

            case 'USD':
            default:
              return `${currencyInfo.symbol}${displayPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
          }
        },

        convertPrice: (price, fromCurrency, toCurrency) => {
          const { currencies } = get();

          if (fromCurrency === toCurrency) {
            return price;
          }

          // Convert to USD first, then to target currency
          const usdPrice = price / currencies[fromCurrency].exchangeRate;
          return usdPrice * currencies[toCurrency].exchangeRate;
        },
      }),
      {
        name: 'currency-storage',
        partialize: (state) => ({
          currentCurrency: state.currentCurrency,
          location: state.location,
        }),
      }
    ),
    {
      name: 'currency-store',
    }
  )
); 