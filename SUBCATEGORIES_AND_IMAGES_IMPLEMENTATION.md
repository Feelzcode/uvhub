# Subcategories and Multiple Product Images Implementation

This document outlines the implementation of subcategories for products and multiple images per product to create a proper e-commerce experience.

## Features Implemented

### 1. Subcategories
- **Database Structure**: New `subcategories` table with relationship to `categories`
- **Admin Management**: Full CRUD operations for subcategories in the admin dashboard
- **Product Association**: Products can now be assigned to both categories and subcategories
- **Filtering**: Enhanced product filtering to include subcategory filtering

### 2. Multiple Product Images
- **Database Structure**: New `product_images` table to store multiple images per product
- **Image Management**: Support for up to 5-6 images per product with ordering
- **Primary Image**: One image can be marked as primary for the product
- **Gallery Component**: Interactive image gallery with thumbnail navigation and full-screen modal

## Database Changes

### New Tables Created

#### 1. `subcategories` Table
```sql
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `product_images` Table
```sql
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Updated Tables

#### `products` Table
- Added `subcategory_id` field to reference subcategories

## Frontend Components

### 1. ProductImageGallery Component
- **Location**: `src/components/ProductImageGallery.tsx`
- **Features**:
  - Thumbnail navigation
  - Full-screen modal view
  - Image counter
  - Keyboard navigation support
  - Responsive design

### 2. Enhanced ProductsDatatable
- **Location**: `src/components/ProductsDatatable.tsx`
- **New Features**:
  - Subcategory management tab
  - Subcategory creation form
  - Subcategory columns in product table
  - Pagination for subcategories

## API Endpoints

### Subcategory Management
- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/:id` - Get subcategory by ID
- `POST /api/subcategories` - Create new subcategory
- `PUT /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory
- `GET /api/subcategories/category/:categoryId` - Get subcategories by category

### Product Images Management
- `GET /api/products/:id/images` - Get product images
- `POST /api/products/:id/images` - Add product image
- `PUT /api/products/:id/images/:imageId` - Update product image
- `DELETE /api/products/:id/images/:imageId` - Delete product image
- `PUT /api/products/:id/images/:imageId/primary` - Set primary image

## Store Updates

### Products Store (`src/store/slices/productsSlice.ts`)
- Added subcategory state management
- Added product images state management
- Enhanced filtering to include subcategories
- New actions for subcategory and image management

### Types (`src/store/types.ts`)
- Added `Subcategory` interface
- Added `ProductImage` interface
- Updated `Product` interface to include subcategory and images

## Usage Examples

### Creating a Subcategory
```typescript
const { createSubcategory } = useProductsStore();

await createSubcategory({
  name: "Smartphones",
  description: "Mobile phones and smartphones",
  category_id: "electronics-category-id"
});
```

### Adding Product Images
```typescript
const { createProductImage } = useProductsStore();

await createProductImage({
  product_id: "product-id",
  image_url: "https://example.com/image.jpg",
  alt_text: "Product front view",
  is_primary: true,
  sort_order: 0
});
```

### Using the Image Gallery
```tsx
import ProductImageGallery from '@/components/ProductImageGallery';

<ProductImageGallery 
  images={productImages} 
  productName={product.name}
  className="w-full"
/>
```

## Migration Steps

1. **Run Database Migrations**:
   ```bash
   # Execute the SQL files in order:
   # 1. database/subcategories_table.sql
   # 2. database/product_images_table.sql
   # 3. database/update_products_table.sql
   ```

2. **Update Existing Products**:
   - Existing products will continue to work with the single image field
   - New products can use the multiple images feature
   - Subcategories can be added gradually

3. **Admin Setup**:
   - Access the admin dashboard
   - Navigate to the "Subcategories" tab
   - Create subcategories for existing categories
   - Assign subcategories to products as needed

## Benefits

1. **Better Organization**: Products can be organized more granularly with subcategories
2. **Enhanced Shopping Experience**: Multiple product images provide better product visualization
3. **Improved SEO**: More detailed categorization helps with search engine optimization
4. **Professional E-commerce**: The multiple image gallery creates a more professional shopping experience

## Future Enhancements

1. **Bulk Image Upload**: Add support for uploading multiple images at once
2. **Image Optimization**: Automatic image resizing and optimization
3. **Video Support**: Add support for product videos
4. **360° Views**: Support for 360-degree product views
5. **Image Analytics**: Track which images are viewed most frequently

## Notes

- The implementation maintains backward compatibility with existing single-image products
- The image gallery gracefully handles products with no additional images
- All new features are optional and can be implemented gradually
- The admin interface provides intuitive management of both subcategories and product images
