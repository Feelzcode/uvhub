/**
 * Utility functions to safely render data and prevent "Objects are not valid as React child" errors
 */

/**
 * Safely extracts a category name from various possible formats
 */
export function getCategoryName(category: any): string {
  if (!category) return 'Unknown';
  
  // If it's already a string, return it
  if (typeof category === 'string') return category;
  
  // If it's an object with a name property
  if (typeof category === 'object' && category !== null) {
    if (category.name && typeof category.name === 'string') {
      return category.name;
    }
    // If it has other properties that might be useful
    if (category.description && typeof category.description === 'string') {
      return category.description;
    }
    if (category.id && typeof category.id === 'string') {
      return category.id;
    }
  }
  
  return 'Unknown';
}

/**
 * Safely extracts a subcategory name from various possible formats
 */
export function getSubcategoryName(subcategory: any): string {
  if (!subcategory) return '';
  
  // If it's already a string, return it
  if (typeof subcategory === 'string') return subcategory;
  
  // If it's an object with a name property
  if (typeof subcategory === 'object' && subcategory !== null) {
    if (subcategory.name && typeof subcategory.name === 'string') {
      return subcategory.name;
    }
    // If it has other properties that might be useful
    if (subcategory.description && typeof subcategory.description === 'string') {
      return subcategory.description;
    }
    if (subcategory.id && typeof subcategory.id === 'string') {
      return subcategory.id;
    }
  }
  
  return '';
}

/**
 * Safely renders any value as a string, preventing object rendering errors
 */
export function safeRender(value: any, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback;
  
  // If it's already a string, return it
  if (typeof value === 'string') return value;
  
  // If it's a number, convert to string
  if (typeof value === 'number') return value.toString();
  
  // If it's a boolean, convert to string
  if (typeof value === 'boolean') return value.toString();
  
  // If it's an object, try to extract useful information
  if (typeof value === 'object') {
    // Try to get a name property first
    if (value.name && typeof value.name === 'string') {
      return value.name;
    }
    
    // Try to get a description property
    if (value.description && typeof value.description === 'string') {
      return value.description;
    }
    
    // Try to get an id property
    if (value.id && typeof value.id === 'string') {
      return value.id;
    }
    
    // If none of the above, return fallback
    return fallback;
  }
  
  return fallback;
}

/**
 * Safely renders a product name
 */
export function getProductName(product: any): string {
  return safeRender(product?.name, 'Product');
}

/**
 * Safely renders a product description
 */
export function getProductDescription(product: any): string {
  return safeRender(product?.description, '');
}

/**
 * Safely renders a variant name
 */
export function getVariantName(variant: any, index: number): string {
  return safeRender(variant?.name, `Variant ${index + 1}`);
}

/**
 * Safely renders a price value
 */
export function getPriceValue(price: any): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

