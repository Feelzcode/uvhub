'use client';

import { useState, useEffect } from 'react';
import { ProductVariant } from '@/store/types';
import { LocationInfo } from '@/store/types';
import { getVariantPrice, getActiveVariants, getDefaultVariant } from '@/utils/variantPrice';
import { useCurrencyStore } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  location: LocationInfo | null;
  selectedVariantId?: string;
  onVariantChange: (variant: ProductVariant) => void;
  showLocationIndicator?: boolean;
  className?: string;
}

export default function ProductVariantSelector({
  variants,
  location,
  selectedVariantId,
  onVariantChange,
  showLocationIndicator = true,
  className = ''
}: ProductVariantSelectorProps) {
  const { formatPrice, currentCurrency } = useCurrencyStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  const activeVariants = getActiveVariants(variants);
  const defaultVariant = getDefaultVariant(activeVariants);

  useEffect(() => {
    // Set selected variant based on selectedVariantId or default
    if (selectedVariantId) {
      const variant = activeVariants.find(v => v.id === selectedVariantId);
      if (variant) {
        setSelectedVariant(variant);
        onVariantChange(variant);
        return;
      }
    }
    
    // If no selected variant or selected variant not found, use default
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
      onVariantChange(defaultVariant);
    }
  }, [selectedVariantId, activeVariants, defaultVariant, onVariantChange]);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

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
            <MapPin className="w-3 h-3" />
            <span>International</span>
          </div>
        );
    }
  };

  if (!activeVariants || activeVariants.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No variants available
      </div>
    );
  }

  if (activeVariants.length === 1) {
    // Only one variant, show it as selected
    const variant = activeVariants[0];
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-gray-700">{variant.name}</span>
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(getVariantPrice(variant, location), currentCurrency)}
        </span>
        {getLocationIndicator()}
        {variant.stock <= 0 && (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Variants:</span>
        {getLocationIndicator()}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {activeVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock <= 0;
          
          return (
            <Button
              key={variant.id}
              variant={isSelected ? "default" : "outline"}
              disabled={isOutOfStock}
              onClick={() => handleVariantSelect(variant)}
              className={`justify-between h-auto p-3 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              } ${isOutOfStock ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">{variant.name}</span>
                <span className="text-sm text-gray-500">
                  {formatPrice(getVariantPrice(variant, location), currentCurrency)}
                </span>
                {variant.stock > 0 && (
                  <span className="text-xs text-green-600">
                    {variant.stock} in stock
                  </span>
                )}
              </div>
              {isOutOfStock && (
                <Badge variant="destructive" className="text-xs ml-2">
                  Out of Stock
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
      
      {selectedVariant && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Selected:</span>
              <span className="ml-2 font-medium">{selectedVariant.name}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(getVariantPrice(selectedVariant, location), currentCurrency)}
            </span>
          </div>
          {selectedVariant.description && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedVariant.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
