-- Create variant_images table to store images for product variants
CREATE TABLE IF NOT EXISTS variant_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_id ON variant_images(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_images_product_id ON variant_images(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_images_is_primary ON variant_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_variant_images_sort_order ON variant_images(sort_order);

-- Add comments to document the table
COMMENT ON TABLE variant_images IS 'Images associated with product variants';
COMMENT ON COLUMN variant_images.variant_id IS 'Reference to the product variant this image belongs to';
COMMENT ON COLUMN variant_images.product_id IS 'Reference to the main product (for easier querying)';
COMMENT ON COLUMN variant_images.image_url IS 'URL or path to the image file';
COMMENT ON COLUMN variant_images.alt_text IS 'Alternative text for accessibility';
COMMENT ON COLUMN variant_images.is_primary IS 'Whether this is the primary image for the variant';
COMMENT ON COLUMN variant_images.sort_order IS 'Order in which images should be displayed';

-- Enable Row Level Security (RLS)
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;

-- Create policies for variant_images
CREATE POLICY "Allow authenticated users to read variant images" ON variant_images
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert variant images" ON variant_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update variant images" ON variant_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete variant images" ON variant_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_variant_image_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_variant_image_updated_at
    BEFORE UPDATE ON variant_images
    FOR EACH ROW
    EXECUTE FUNCTION update_variant_image_updated_at();

-- Add constraints
ALTER TABLE variant_images ADD CONSTRAINT check_variant_image_sort_order_non_negative 
    CHECK (sort_order >= 0);

-- Ensure only one primary image per variant
CREATE UNIQUE INDEX idx_variant_images_primary_per_variant 
    ON variant_images(variant_id) 
    WHERE is_primary = true;
