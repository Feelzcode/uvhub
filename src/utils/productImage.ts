import { Product, ProductImage } from '@/store/types';

/**
 * Gets the best image for a product
 * Priority: primary image from images array > first image from images array > fallback image
 */
export function getProductImage(product: Product): string {
  // If product has multiple images, get the primary one or the first one
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.is_primary);
    if (primaryImage) {
      return primaryImage.image_url;
    }
    return product.images[0].image_url;
  }
  
  // Fallback to the single image field
  return product.image || '/placeholder-product.jpg';
}

/**
 * Gets all images for a product
 */
export function getProductImages(product: Product): ProductImage[] {
  return product.images || [];
}

/**
 * Gets the primary image for a product
 */
export function getPrimaryProductImage(product: Product): ProductImage | null {
  if (product.images && product.images.length > 0) {
    return product.images.find(img => img.is_primary) || product.images[0];
  }
  return null;
}
