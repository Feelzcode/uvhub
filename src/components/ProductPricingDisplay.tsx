'use client';

import { Product } from '@/store/types';
import { LocationInfo } from '@/store/types';
import { getProductPrice, getProductAllPrices, hasLocationSpecificPricing } from '@/utils/productPrice';
import { useCurrencyStore } from '@/store';
import { MapPin, Globe } from 'lucide-react';

interface ProductPricingDisplayProps {
  product: Product;
  location: LocationInfo | null;
  showLocationIndicator?: boolean;
  className?: string;
}

export default function ProductPricingDisplay({ 
  product, 
  location, 
  showLocationIndicator = true,
  className = '' 
}: ProductPricingDisplayProps) {
  const { formatPrice, currentCurrency } = useCurrencyStore();
  const currentPrice = getProductPrice(product, location);
  const allPrices = getProductAllPrices(product);
  const hasSpecificPricing = hasLocationSpecificPricing(product);

  const getLocationIndicator = () => {
    if (!showLocationIndicator || !location) return null;

    switch (location.countryCode) {
      case 'NG':
        return (
          <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            <MapPin className="w-3 h-3" />
            <span>Nigeria</span>
          </div>
        );
      case 'GH':
        return (
          <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            <MapPin className="w-3 h-3" />
            <span>Ghana</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            <Globe className="w-3 h-3" />
            <span>International</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(currentPrice, currentCurrency)}
        </span>
        {getLocationIndicator()}
      </div>
      
      {/* Show other available prices if product has location-specific pricing */}
      {hasSpecificPricing && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {allPrices.ngn !== currentPrice && allPrices.ngn > 0 && (
            <span>₦{allPrices.ngn.toLocaleString()}</span>
          )}
          {allPrices.ghs !== currentPrice && allPrices.ghs > 0 && (
            <span>₵{allPrices.ghs.toLocaleString()}</span>
          )}
        </div>
      )}
    </div>
  );
}
