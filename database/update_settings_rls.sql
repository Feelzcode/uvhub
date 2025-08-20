-- Update RLS policies for settings table to allow public read access
-- This fixes the 500 error when fetching settings from unauthenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON settings;

-- Create new policy to allow public read access to settings
CREATE POLICY "Allow public read access to settings" ON settings
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert settings
CREATE POLICY "Allow authenticated users to insert settings" ON settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Verify the policies are in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'settings';

-- Test the public read access
-- This should work without authentication
SELECT * FROM settings LIMIT 1;
