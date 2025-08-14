-- Check if required tables exist and show their structure
-- Run this in your Supabase SQL editor to see what's currently in your database

-- Check if products table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as products_table_status;

-- Check if product_variants table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_variants') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as product_variants_table_status;

-- Check if variant_images table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'variant_images') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as variant_images_table_status;

-- If products table exists, show its structure
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        RAISE NOTICE 'Products table structure:';
        RAISE NOTICE 'Columns: %', (
            SELECT string_agg(column_name || ' ' || data_type, ', ')
            FROM information_schema.columns 
            WHERE table_name = 'products'
        );
    ELSE
        RAISE NOTICE 'Products table does not exist. You need to run create_products_table.sql first.';
    END IF;
END $$;

-- If product_variants table exists, show its structure
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_variants') THEN
        RAISE NOTICE 'Product variants table structure:';
        RAISE NOTICE 'Columns: %', (
            SELECT string_agg(column_name || ' ' || data_type, ', ')
            FROM information_schema.columns 
            WHERE table_name = 'product_variants'
        );
    ELSE
        RAISE NOTICE 'Product variants table does not exist. You need to run create_product_variants.sql first.';
    END IF;
END $$;

-- If variant_images table exists, show its structure
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'variant_images') THEN
        RAISE NOTICE 'Variant images table structure:';
        RAISE NOTICE 'Columns: %', (
            SELECT string_agg(column_name || ' ' || data_type, ', ')
            FROM information_schema.columns 
            WHERE table_name = 'variant_images'
        );
    ELSE
        RAISE NOTICE 'Variant images table does not exist. You need to run create_variant_images_table.sql first.';
    END IF;
END $$;
