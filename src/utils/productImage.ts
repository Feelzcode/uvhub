import { Product, ProductImage } from '@/store/types';

/**
 * Gets the best image for a product
 * Priority: primary variant image > primary product image > first variant image > first product image > fallback image
 */
export function getProductImage(product: Product): string {
  // First, check if there are variants with images
  if (product.variants && product.variants.length > 0) {
    // Find variants with images
    const variantsWithImages = product.variants.filter(variant => 
      variant.images && variant.images.length > 0
    );
    
    if (variantsWithImages.length > 0) {
      // Get the first variant with images
      const firstVariantWithImages = variantsWithImages[0];
      
      // Try to get primary image from variant
      if (firstVariantWithImages.images) {
        const primaryVariantImage = firstVariantWithImages.images.find(img => img.is_primary);
        if (primaryVariantImage) {
          return primaryVariantImage.image_url;
        }
        // Fallback to first variant image
        return firstVariantWithImages.images[0].image_url;
      }
    }
    
    // If variants have image_url but no images array
    const variantWithImageUrl = product.variants.find(variant => variant.image_url);
    if (variantWithImageUrl?.image_url) {
      return variantWithImageUrl.image_url;
    }
  }
  
  // If no variant images, check product images
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

/**
 * Gets the best variant image for a product
 * Returns the primary image from the first variant with images, or null if no variants have images
 */
export function getBestVariantImage(product: Product): string | null {
  if (product.variants && product.variants.length > 0) {
    // Find variants with images
    const variantsWithImages = product.variants.filter(variant => 
      variant.images && variant.images.length > 0
    );
    
    if (variantsWithImages.length > 0) {
      const firstVariantWithImages = variantsWithImages[0];
      
      // Try to get primary image from variant
      if (firstVariantWithImages.images) {
        const primaryVariantImage = firstVariantWithImages.images.find(img => img.is_primary);
        if (primaryVariantImage) {
          return primaryVariantImage.image_url;
        }
        // Fallback to first variant image
        return firstVariantWithImages.images[0].image_url;
      }
    }
    
    // If variants have image_url but no images array
    const variantWithImageUrl = product.variants.find(variant => variant.image_url);
    if (variantWithImageUrl?.image_url) {
      return variantWithImageUrl.image_url;
    }
  }
  
  return null;
}

/**
 * Gets all variant images for a product
 * Returns an array of all images from all variants
 */
export function getAllVariantImages(product: Product): ProductImage[] {
  if (!product.variants || product.variants.length === 0) {
    return [];
  }
  
  const allVariantImages: ProductImage[] = [];
  
  product.variants.forEach(variant => {
    if (variant.images && variant.images.length > 0) {
      allVariantImages.push(...variant.images);
    }
  });
  
  return allVariantImages;
}
