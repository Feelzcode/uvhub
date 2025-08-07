-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_name ON subcategories(name);

-- Enable Row Level Security (RLS)
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read subcategories
CREATE POLICY "Allow authenticated users to read subcategories" ON subcategories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update subcategories
CREATE POLICY "Allow authenticated users to update subcategories" ON subcategories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert subcategories
CREATE POLICY "Allow authenticated users to insert subcategories" ON subcategories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete subcategories
CREATE POLICY "Allow authenticated users to delete subcategories" ON subcategories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subcategories_updated_at
    BEFORE UPDATE ON subcategories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
