-- Create storage bucket for file uploads
-- This needs to be run in your Supabase SQL editor

-- Create the storage bucket 'file-bucket' for storing uploaded files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'file-bucket',
    'file-bucket',
    true,
    52428800, -- 50MB limit
    ARRAY[
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

-- Create storage policy to allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

-- Create storage policy to allow authenticated users to update files
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

-- Create storage policy to allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

-- Make sure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
