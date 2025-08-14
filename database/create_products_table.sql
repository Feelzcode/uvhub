-- Create products table with proper structure
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    price DECIMAL(10,2) DEFAULT 0,
    price_ngn DECIMAL(10,2) DEFAULT 0,
    price_ghs DECIMAL(10,2) DEFAULT 0,
    image VARCHAR(500) DEFAULT '',
    category UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Add comments to document the table
COMMENT ON TABLE products IS 'Main products table - contains basic product information';
COMMENT ON COLUMN products.name IS 'Product name (e.g., "Treadmill", "Exercise Bike")';
COMMENT ON COLUMN products.description IS 'Product description (optional at main level)';
COMMENT ON COLUMN products.category IS 'Reference to categories table - the main category this product belongs to';
COMMENT ON COLUMN products.subcategory_id IS 'Optional reference to subcategories table';
COMMENT ON COLUMN products.price IS 'Fallback price for the product (used when variant prices are not set)';
COMMENT ON COLUMN products.price_ngn IS 'Nigerian Naira price for the product';
COMMENT ON COLUMN products.price_ghs IS 'Ghanaian Cedi price for the product';

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Allow authenticated users to read products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_product_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_updated_at();

-- Add constraints
ALTER TABLE products ADD CONSTRAINT check_product_price_non_negative 
    CHECK (price >= 0 AND price_ngn >= 0 AND price_ghs >= 0);

ALTER TABLE products ADD CONSTRAINT check_product_stock_non_negative 
    CHECK (stock >= 0);

ALTER TABLE products ADD CONSTRAINT check_product_rating_range 
    CHECK (rating >= 0 AND rating <= 5);
