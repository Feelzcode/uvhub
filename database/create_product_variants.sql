-- Create product variants table to replace subcategories
-- This allows each product to have multiple variants with their own pricing

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_ngn DECIMAL(10,2) DEFAULT NULL,
    price_ghs DECIMAL(10,2) DEFAULT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_sort_order ON product_variants(sort_order);

-- Add comments to document the table
COMMENT ON TABLE product_variants IS 'Product variants with individual pricing and stock levels';
COMMENT ON COLUMN product_variants.name IS 'Variant name (e.g., "Red", "Large", "Premium")';
COMMENT ON COLUMN product_variants.sku IS 'Stock Keeping Unit - unique identifier for the variant';
COMMENT ON COLUMN product_variants.price IS 'Fallback price for the variant';
COMMENT ON COLUMN product_variants.price_ngn IS 'Nigerian Naira price for the variant';
COMMENT ON COLUMN product_variants.price_ghs IS 'Ghanaian Cedi price for the variant';
COMMENT ON COLUMN product_variants.stock IS 'Available stock for this specific variant';
COMMENT ON COLUMN product_variants.is_active IS 'Whether this variant is available for purchase';
COMMENT ON COLUMN product_variants.sort_order IS 'Order in which variants should be displayed';

-- Enable Row Level Security (RLS)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for product_variants
CREATE POLICY "Allow authenticated users to read product variants" ON product_variants
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert product variants" ON product_variants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update product variants" ON product_variants
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete product variants" ON product_variants
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp for variants
CREATE OR REPLACE FUNCTION update_variant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for variants
CREATE TRIGGER trigger_update_variant_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_variant_updated_at();

-- Create function to update fallback price when location-specific prices are updated
CREATE OR REPLACE FUNCTION update_variant_fallback_price()
RETURNS TRIGGER AS $$
BEGIN
    -- If both location-specific prices are set, use NGN as fallback
    IF NEW.price_ngn IS NOT NULL THEN
        NEW.price = NEW.price_ngn;
    ELSIF NEW.price_ghs IS NOT NULL THEN
        NEW.price = NEW.price_ghs;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update fallback price for variants
CREATE TRIGGER trigger_update_variant_fallback_price
    BEFORE INSERT OR UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_variant_fallback_price();

-- Remove subcategory_id from products table (optional - we can keep it for backward compatibility)
-- ALTER TABLE products DROP COLUMN IF EXISTS subcategory_id;

-- Add a constraint to ensure variants have at least one price
ALTER TABLE product_variants ADD CONSTRAINT check_variant_has_price 
    CHECK (price > 0 OR price_ngn > 0 OR price_ghs > 0);

-- Add a constraint to ensure stock is non-negative
ALTER TABLE product_variants ADD CONSTRAINT check_variant_stock_non_negative 
    CHECK (stock >= 0);
