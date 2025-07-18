"use client";
import React, { useEffect, useState } from 'react';
import { useCurrencyStore } from '@/store/slices/currencySlice';
import { X, Globe, AlertCircle } from 'lucide-react';

const CurrencyDetectionPopup: React.FC = () => {
  const { 
    currentCurrency, 
    setCurrency, 
    location, 
    loading, 
    error, 
    detectLocation,
    currencies 
  } = useCurrencyStore();
  
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Show popup if location detection fails or after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      // Show popup if no location detected after 8 seconds, or if there's an error
      if ((!location && !loading && !hasShownPopup) || (error && !hasShownPopup)) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [location, loading, error, hasShownPopup]);

  // Hide popup when location is successfully detected
  useEffect(() => {
    if (location && showPopup) {
      setShowPopup(false);
    }
  }, [location, showPopup]);

  const handleCurrencySelect = (currency: 'NGN' | 'GHS' | 'USD') => {
    setCurrency(currency);
    setShowPopup(false);
  };

  const handleRetryDetection = () => {
    setShowPopup(false);
    detectLocation();
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select Your Currency
          </h3>
          <p className="text-gray-600 text-sm">
            {error 
              ? "We couldn't detect your location automatically. Please select your preferred currency."
              : "Choose your preferred currency for accurate pricing."
            }
          </p>
        </div>

        {/* Currency options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleCurrencySelect('NGN')}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              currentCurrency === 'NGN'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="font-medium">Nigerian Naira</div>
                <div className="text-sm text-gray-500">₦ NGN</div>
              </div>
              <div className="text-right">
                <div className="font-bold">₦</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleCurrencySelect('GHS')}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              currentCurrency === 'GHS'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="font-medium">Ghanaian Cedi</div>
                <div className="text-sm text-gray-500">₵ GHS</div>
              </div>
              <div className="text-right">
                <div className="font-bold">₵</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleCurrencySelect('USD')}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              currentCurrency === 'USD'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="font-medium">US Dollar</div>
                <div className="text-sm text-gray-500">$ USD</div>
              </div>
              <div className="text-right">
                <div className="font-bold">$</div>
              </div>
            </div>
          </button>
        </div>

        {/* Retry detection button */}
        {error && (
          <div className="text-center">
            <button
              onClick={handleRetryDetection}
              className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Retry Location Detection
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            You can change this later in your account settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetectionPopup; 