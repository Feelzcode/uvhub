-- Add dual pricing fields to products table
-- This migration adds separate pricing fields for Nigerian and Ghanaian buyers

-- Add Nigerian Naira price field
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_ngn DECIMAL(10,2) DEFAULT NULL;

-- Add Ghanaian Cedi price field  
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_ghs DECIMAL(10,2) DEFAULT NULL;

-- Create indexes for the new price fields
CREATE INDEX IF NOT EXISTS idx_products_price_ngn ON products(price_ngn);
CREATE INDEX IF NOT EXISTS idx_products_price_ghs ON products(price_ghs);

-- Update existing products to have the new pricing fields
-- For existing products, we'll set the new fields to NULL initially
-- This allows for gradual migration of pricing data

-- Add comments to document the new fields
COMMENT ON COLUMN products.price_ngn IS 'Price in Nigerian Naira (NGN)';
COMMENT ON COLUMN products.price_ghs IS 'Price in Ghanaian Cedi (GHS)';
COMMENT ON COLUMN products.price IS 'Fallback price (legacy field for backward compatibility)';

-- Create a function to automatically update the fallback price when location-specific prices are updated
CREATE OR REPLACE FUNCTION update_fallback_price()
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

-- Create trigger to automatically update fallback price
CREATE TRIGGER trigger_update_fallback_price
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_fallback_price();
