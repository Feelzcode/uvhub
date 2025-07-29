-- Create settings table for Facebook Pixel and other site configuration
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    facebook_pixel_id TEXT,
    facebook_pixel_enabled BOOLEAN DEFAULT false,
    google_analytics_id TEXT,
    google_analytics_enabled BOOLEAN DEFAULT false,
    site_name TEXT NOT NULL DEFAULT 'UVHub',
    site_description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);

-- Enable Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings" ON settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert settings
CREATE POLICY "Allow authenticated users to insert settings" ON settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (
    facebook_pixel_id,
    facebook_pixel_enabled,
    google_analytics_id,
    google_analytics_enabled,
    site_name,
    site_description,
    contact_email,
    contact_phone
) VALUES (
    '',
    false,
    '',
    false,
    'UVHub',
    'Your Ultimate Shopping Destination',
    '',
    ''
) ON CONFLICT DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON settings TO authenticated; 