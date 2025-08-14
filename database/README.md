# Database Setup for UVHub

This directory contains SQL files to set up the database schema for the UVHub application.

## Database Tables

The application requires the following tables to be created in order:

### 1. Core Tables (run these first)
- `categories` - Product categories (e.g., "Cardio Machines", "Strength Training")
- `subcategories` - Subcategories within main categories
- `products` - Main products (e.g., "Treadmill", "Exercise Bike")

### 2. Product Variants (run after core tables)
- `product_variants` - Individual variants of products with their own pricing and stock
- `variant_images` - Images associated with product variants

### 3. Supporting Tables
- `product_images` - General product images (legacy, may be removed)
- `settings` - Application settings and configuration

## Setup Order

1. **First, ensure you have the basic tables:**
   ```sql
   -- Run these in your Supabase SQL editor or database client
   -- 1. Create categories table (if not exists)
   -- 2. Create subcategories table
   -- 3. Create products table
   ```

2. **Then create the product variants system:**
   ```sql
   -- Run these after the core tables exist
   -- 4. Create product_variants table
   -- 5. Create variant_images table
   ```

3. **Finally, run any updates:**
   ```sql
   -- 6. Run any update scripts for existing data
   ```

## Important Notes

- **Category Column**: The `products` table uses a `category` column (UUID) that references the `categories.id`
- **Variant Structure**: Each product can have multiple variants, each with their own pricing, stock, and images
- **Image Management**: Variant images are stored in the `variant_images` table, linked to specific variants
- **Foreign Keys**: All tables use proper foreign key constraints for data integrity

## Current Issue

The application was failing because:
1. The `products` table didn't exist or had the wrong structure
2. The `category_id` column was expected but the database uses `category`
3. The `variant_images` table was missing for storing variant-specific images

## Solution

**IMPORTANT: You must set up the database tables before the application will work!**

### Step 1: Check Current Database State
First, run the diagnostic script to see what's currently in your database:
```sql
-- Run this in your Supabase SQL editor
\i database/check_tables.sql
```

### Step 2: Create Required Tables
Run these SQL files in your Supabase SQL editor in this exact order:

1. **`create_products_table.sql`** - Creates the main products table
2. **`create_product_variants.sql`** - Creates the product variants table  
3. **`create_variant_images_table.sql`** - Creates the variant images table

### Step 3: Verify Setup
After running the scripts, run the check again to confirm all tables exist:
```sql
\i database/check_tables.sql
```

### Step 4: Test the Application
Once all tables are created, the "Add Product" button should work correctly.

## Current Error Explanation

The error `"Could not find the 'category_id' column of 'products' in the schema cache"` means:
1. The `products` table doesn't exist, OR
2. The `products` table exists but doesn't have the expected structure

This happens because the application code expects a `products` table with a `category` column, but the database doesn't have this table yet.
