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
          const { setLoading, setError, setLocation, setCurrency, location } = get();

          // Check if we already have location data
          if (location) {
            // set the current currency to the currency of the location
            setCurrency(location.countryCode === 'NG' ? 'NGN' : location.countryCode === 'GH' ? 'GHS' : 'USD');
            return; // Exit early if location is already detected
          }

          setLoading(true);
          setError(null);

          try {
            // Method 1: Try browser geolocation first (more accurate)
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
              try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    enableHighAccuracy: false,
                    maximumAge: 300000 // 5 minutes
                  });
                });

                // Use reverse geocoding to get country
                const reverseGeocodeResponse = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                );

                if (reverseGeocodeResponse.ok) {
                  const locationData = await reverseGeocodeResponse.json();
                  
                  const locationInfo: LocationInfo = {
                    country: locationData.countryName,
                    countryCode: locationData.countryCode,
                    city: locationData.city,
                    region: locationData.locality,
                  };

                  setLocation(locationInfo);

                  // Set currency based on country
                  let currency: Currency = 'USD';
                  if (locationData.countryCode === 'NG') {
                    currency = 'NGN';
                  } else if (locationData.countryCode === 'GH') {
                    currency = 'GHS';
                  }

                  setCurrency(currency);
                  setLoading(false);
                  return;
                }
              } catch  {
                console.log('Browser geolocation failed, falling back to IP-based detection');
                // Continue to IP-based detection
              }
            }

            // Method 2: IP-based geolocation with multiple services
            const ipServices = [
              'https://ipapi.co/json/',
              'https://ipinfo.io/json',
              'https://api.ipify.org?format=json',
              'https://api.myip.com'
            ];

            let locationData: unknown = null;

            for (const service of ipServices) {
              try {
                const response = await fetch(service, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                  // Add timeout
                  signal: AbortSignal.timeout(3000)
                });

                if (response.ok) {
                  locationData = await response.json();
                  break; // Use first successful response
                }
              } catch  {
                console.log(`Service ${service} failed, trying next...`);
                continue;
              }
            }

            if (!locationData) {
              throw new Error('All location detection methods failed');
            }
            const data = locationData as any;
            // Handle different response formats
            const countryCode = data.country_code || data.country || data.countryCode;
            const countryName = data.country_name || data.countryName || data.country;
            const city = data.city || data.locality;
            const region = data.region || data.regionName;

            const locationInfo: LocationInfo = {
              country: countryName,
              countryCode: countryCode,
              city: city,
              region: region,
            };

            setLocation(locationInfo);

            // Set currency based on country
            let currency: Currency = 'USD';

            if (countryCode === 'NG') {
              currency = 'NGN';
            } else if (countryCode === 'GH') {
              currency = 'GHS';
            }

            setCurrency(currency);

          } catch (error) {
            console.error('Location detection error:', error);
            setError(error instanceof Error ? error.message : 'Failed to detect location');

            // Fallback to NGN if location detection fails
            setCurrency('NGN');
          } finally {
            setLoading(false);
          }
        },

        formatPrice: (price) => {
          const { currencies, currentCurrency } = get();
          const currencyInfo = currencies[currentCurrency];

          // Convert price if needed
          let displayPrice = price;
          displayPrice = get().convertPrice(price, currentCurrency || 'NGN', currentCurrency);

          // Format based on currency
          switch (currentCurrency) {
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