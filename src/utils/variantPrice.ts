import { ProductVariant } from '@/store/types';
import { LocationInfo } from '@/store/types';

/**
 * Gets the appropriate price for a variant based on location
 * Priority: location-based price > fallback price
 */
export function getVariantPrice(variant: ProductVariant, location: LocationInfo | null): number {
  if (!location) {
    // Fallback to the original price field
    return variant.price || 0;
  }

  // Return location-specific price based on country code
  switch (location.countryCode) {
    case 'NG':
      return variant.price_ngn || variant.price || 0;
    case 'GH':
      return variant.price_ghs || variant.price || 0;
    default:
      // For other countries, fallback to the original price field
      return variant.price || 0;
  }
}

/**
 * Gets the Nigerian Naira price for a variant
 */
export function getVariantPriceNGN(variant: ProductVariant): number {
  return variant.price_ngn || variant.price || 0;
}

/**
 * Gets the Ghanaian Cedi price for a variant
 */
export function getVariantPriceGHS(variant: ProductVariant): number {
  return variant.price_ghs || variant.price || 0;
}

/**
 * Gets the fallback price for a variant (original price field)
 */
export function getVariantPriceFallback(variant: ProductVariant): number {
  return variant.price || 0;
}

/**
 * Checks if a variant has location-specific pricing
 */
export function hasVariantLocationSpecificPricing(variant: ProductVariant): boolean {
  return !!(variant.price_ngn || variant.price_ghs);
}

/**
 * Gets all available prices for a variant
 */
export function getVariantAllPrices(variant: ProductVariant): {
  ngn: number;
  ghs: number;
  fallback: number;
} {
  return {
    ngn: variant.price_ngn || variant.price || 0,
    ghs: variant.price_ghs || variant.price || 0,
    fallback: variant.price || 0,
  };
}

/**
 * Gets the default variant for a product (first active variant or first variant)
 */
export function getDefaultVariant(variants: ProductVariant[]): ProductVariant | null {
  if (!variants || variants.length === 0) return null;
  
  // First try to find an active variant
  const activeVariant = variants.find(v => v.is_active);
  if (activeVariant) return activeVariant;
  
  // If no active variants, return the first one
  return variants[0];
}

/**
 * Gets the total stock across all variants
 */
export function getTotalVariantStock(variants: ProductVariant[]): number {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((total, variant) => total + (variant.stock || 0), 0);
}

/**
 * Gets the lowest price among all variants
 */
export function getLowestVariantPrice(variants: ProductVariant[], location: LocationInfo | null): number {
  if (!variants || variants.length === 0) return 0;
  
  const prices = variants
    .filter(v => v.is_active)
    .map(v => getVariantPrice(v, location))
    .filter(p => p > 0);
    
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/**
 * Gets the highest price among all variants
 */
export function getHighestVariantPrice(variants: ProductVariant[], location: LocationInfo | null): number {
  if (!variants || variants.length === 0) return 0;
  
  const prices = variants
    .filter(v => v.is_active)
    .map(v => getVariantPrice(v, location))
    .filter(p => p > 0);
    
  return prices.length > 0 ? Math.max(...prices) : 0;
}

/**
 * Checks if a product has multiple variants
 */
export function hasMultipleVariants(variants: ProductVariant[]): boolean {
  return variants && variants.length > 1;
}

/**
 * Gets active variants only
 */
export function getActiveVariants(variants: ProductVariant[]): ProductVariant[] {
  if (!variants) return [];
  return variants.filter(v => v.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
