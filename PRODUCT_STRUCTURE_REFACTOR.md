# Product Structure Refactor

## Overview

The product system has been refactored to use a new structure where categories contain product types instead of individual products with variants. This provides a more logical organization and better scalability.

## New Structure

### Before (Old Structure)
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  variants?: ProductVariant[];
  // ... other fields
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  // ... other fields
}
```

### After (New Structure)
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  types: ProductType[];
  created_at: Date;
  updated_at: Date;
}

interface ProductType {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  categoryId: string;
  created_at: Date;
  updated_at: Date;
}
```

## Example Data Structure

```typescript
const categories = [
  { 
    id: 1, 
    name: 'Treadmill', 
    categoryId: 1, 
    description: 'Running and walking machines',
    types: [
      {
        id: 1,
        name: 'Commercial Treadmill Pro',
        image: '/api/placeholder/300/200',
        price: 2999.99,
        description: 'Heavy-duty commercial grade treadmill with advanced features'
      },
      {
        id: 2,
        name: 'Home Treadmill Basic',
        image: '/api/placeholder/300/200',
        price: 899.99,
        description: 'Compact home treadmill perfect for daily cardio'
      }
    ]
  },
  { 
    id: 2, 
    name: 'Exercise Bike', 
    categoryId: 1, 
    description: 'Stationary cycling equipment',
    types: []
  }
];
```

## Key Changes

### 1. Types and Interfaces
- `Product` interface now includes `types?: ProductType[]`
- `ProductVariant` replaced with `ProductType`
- `Category` interface now includes `types: ProductType[]`
- `CartItem` updated to use `typeId` and `type` instead of `variantId` and `variant`

### 2. Store Structure
- `ProductsState` now focuses on categories instead of individual products
- `selectedProduct` replaced with `selectedCategory` and `selectedType`
- Store methods updated to work with categories and types

### 3. Actions
- New functions: `createCategory`, `updateCategory`, `deleteCategory`
- New functions: `createProductType`, `updateProductType`, `deleteProductType`
- Database queries updated to join categories with product types

### 4. Schema Updates
- New Zod schemas for categories and product types
- Legacy product schemas maintained for backward compatibility

## Usage Examples

### Getting Categories with Types
```typescript
const { categories, loading, error, getCategories } = useProductsStore();

useEffect(() => {
  getCategories();
}, [getCategories]);

// categories will contain the full structure with types
categories.forEach(category => {
  console.log(category.name);
  category.types.forEach(type => {
    console.log(`- ${type.name}: $${type.price}`);
  });
});
```

### Creating a New Category
```typescript
const { addCategory } = useProductsStore();

const newCategory = {
  name: 'New Category',
  description: 'Category description'
};

await addCategory(newCategory);
```

### Adding Product Types to a Category
```typescript
const { createProductType } = useProductsStore();

const newType = {
  name: 'New Product Type',
  description: 'Product description',
  image: '/path/to/image.jpg',
  price: 99.99,
  categoryId: 'category-id'
};

await createProductType(newType);
```

## Database Schema

The new structure requires these database tables:

### categories
- `id` (primary key)
- `name`
- `description`
- `created_at`
- `updated_at`

### product_types
- `id` (primary key)
- `name`
- `description`
- `image`
- `price`
- `category_id` (foreign key to categories.id)
- `created_at`
- `updated_at`

## Migration Notes

1. **Backward Compatibility**: The old `Product` interface is maintained for existing code
2. **Cart System**: Cart items now reference product types instead of variants
3. **Image Management**: Product images are now associated with product types
4. **Pricing**: Pricing is now handled at the product type level

## Benefits of New Structure

1. **Better Organization**: Products are logically grouped by category
2. **Scalability**: Easier to manage large numbers of products
3. **Flexibility**: Categories can have different numbers of product types
4. **Performance**: Reduced database joins for common queries
5. **Maintainability**: Clearer separation of concerns

## Components Updated

- `ProductList.tsx` - Now displays categories with their types
- `ProductCard.tsx` - Works with the new structure
- `ProductExample.tsx` - New example component showing the structure
- Store slices and actions updated to work with new structure

## Next Steps

1. Update database schema to match new structure
2. Migrate existing product data to new format
3. Update UI components to use new structure
4. Test cart and checkout functionality
5. Update admin interfaces for category and type management
