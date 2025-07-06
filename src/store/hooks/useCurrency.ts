import { useEffect } from 'react';
import { useCurrencyStore } from '../slices/currencySlice';

export const useCurrency = () => {
    const {
        currentCurrency,
        location,
        loading,
        error,
        currencies,
        setCurrency,
        setLocation,
        setLoading,
        setError,
        detectLocation,
        formatPrice,
        convertPrice,
    } = useCurrencyStore();

    // Auto-detect location on mount
    useEffect(() => {
        // Only detect if we don't have location data yet
        if (!location && !loading) {
            detectLocation();
        }
    }, [location, loading, detectLocation]);

    // Helper function to check if user is in Nigeria
    const isInNigeria = () => location?.countryCode === 'NG';

    // Helper function to check if user is in Ghana
    const isInGhana = () => location?.countryCode === 'GH';

    // Helper function to get current currency info
    const getCurrentCurrencyInfo = () => currencies[currentCurrency];

    // Helper function to format price with current currency
    const formatCurrentPrice = (price: number) => formatPrice(price, currentCurrency);

    // Helper function to format price in USD
    const formatUSDPrice = (price: number) => formatPrice(price, 'USD');

    // Helper function to format price in NGN
    const formatNGNPrice = (price: number) => formatPrice(price, 'NGN');

    // Helper function to format price in GHS
    const formatGHSPrice = (price: number) => formatPrice(price, 'GHS');

    return {
        // State
        currentCurrency,
        location,
        loading,
        error,
        currencies,

        // Actions
        setCurrency,
        setLocation,
        setLoading,
        setError,
        detectLocation,
        formatPrice,
        convertPrice,

        // Helper functions
        isInNigeria,
        isInGhana,
        getCurrentCurrencyInfo,
        formatCurrentPrice,
        formatUSDPrice,
        formatNGNPrice,
        formatGHSPrice,
    };
}; 