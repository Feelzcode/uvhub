-- Add subcategory_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Create index for subcategory_id
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);

-- Update existing products to have a default subcategory if needed
-- This will be handled in the application logic when subcategories are created
