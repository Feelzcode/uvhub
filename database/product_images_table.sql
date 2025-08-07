-- Create product_images table for multiple images per product
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read product images
CREATE POLICY "Allow authenticated users to read product images" ON product_images
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update product images
CREATE POLICY "Allow authenticated users to update product images" ON product_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert product images
CREATE POLICY "Allow authenticated users to insert product images" ON product_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images" ON product_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create unique constraint to ensure only one primary image per product
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_images_primary_unique 
ON product_images(product_id) WHERE is_primary = true;
