# Fix for Storage Bucket Error

## Problem
You're getting this error when uploading images:
```
tus: unexpected response while creating upload, originated from request (method: POST, url: https://bntlqarmnkqpcsmytvio.supabase.co/storage/v1/upload/resumable, response code: 404, response text: Bucket not found)
```

This means the storage bucket `file-bucket` doesn't exist in your Supabase project.

## Solutions

### Option 1: Create the Storage Bucket (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://app.supabase.com
   - Select your project

2. **Create Storage Bucket via UI**
   - Go to "Storage" in the left sidebar
   - Click "New Bucket"
   - Name: `file-bucket`
   - Make it **Public**
   - Set file size limit: 50MB
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

3. **Set Storage Policies via SQL**
   - Go to "SQL Editor" in your Supabase dashboard
   - Run the SQL script from `database/create_storage_bucket.sql`

### Option 2: Create Bucket via SQL Only

Run this SQL in your Supabase SQL Editor:

```sql
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

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to view files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'file-bucket' AND 
        auth.role() = 'authenticated'
    );

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### Option 3: Use an Existing Bucket

If you already have a storage bucket (like `avatars`), you can update the code to use that instead:

1. Check what buckets exist in your Supabase Storage
2. Update all instances of `'file-bucket'` to your existing bucket name

To find all instances that need updating:
```bash
grep -r "file-bucket" src/components/
```

## Verification

After creating the bucket, test the upload by:

1. Going to the variants page: `/admin/dashboard/variants`
2. Click "Create Variant"
3. Try uploading an image
4. The upload should now work without the 404 error

## Folder Structure

The uploads will be organized as:
- `file-bucket/products/` - Product images
- `file-bucket/variants/` - Variant images

## Security

The storage policies ensure that:
- Only authenticated users can upload/view/edit/delete files
- Files are publicly accessible once uploaded (for displaying on the frontend)
- File types are restricted to images only
- File size is limited to 50MB

## Troubleshooting

If you still get errors after creating the bucket:

1. **Check bucket exists**: Go to Supabase Storage and verify `file-bucket` is there
2. **Check permissions**: Ensure your user is authenticated and has the right permissions
3. **Check policies**: Verify the storage policies were created correctly
4. **Check file types**: Make sure you're uploading supported image formats
5. **Check file size**: Ensure files are under 50MB

## Next Steps

After the bucket is created, all image uploads should work properly in:
- Product image management
- Variant image management
- Create variant form
- Edit variant functionality
