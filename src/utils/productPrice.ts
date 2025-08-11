import { Product } from '@/store/types';
import { LocationInfo } from '@/store/types';

/**
 * Gets the appropriate price for a product based on location
 * Priority: location-based price > fallback price
 */
export function getProductPrice(product: Product, location: LocationInfo | null): number {
  if (!location) {
    // Fallback to the original price field
    return product.price || 0;
  }

  // Return location-specific price based on country code
  switch (location.countryCode) {
    case 'NG':
      return product.price_ngn || product.price || 0;
    case 'GH':
      return product.price_ghs || product.price || 0;
    default:
      // For other countries, fallback to the original price field
      return product.price || 0;
  }
}

/**
 * Gets the Nigerian Naira price for a product
 */
export function getProductPriceNGN(product: Product): number {
  return product.price_ngn || product.price || 0;
}

/**
 * Gets the Ghanaian Cedi price for a product
 */
export function getProductPriceGHS(product: Product): number {
  return product.price_ghs || product.price || 0;
}

/**
 * Gets the fallback price for a product (original price field)
 */
export function getProductPriceFallback(product: Product): number {
  return product.price || 0;
}

/**
 * Checks if a product has location-specific pricing
 */
export function hasLocationSpecificPricing(product: Product): boolean {
  return !!(product.price_ngn || product.price_ghs);
}

/**
 * Gets all available prices for a product
 */
export function getProductAllPrices(product: Product): {
  ngn: number;
  ghs: number;
  fallback: number;
} {
  return {
    ngn: product.price_ngn || product.price || 0,
    ghs: product.price_ghs || product.price || 0,
    fallback: product.price || 0,
  };
}
