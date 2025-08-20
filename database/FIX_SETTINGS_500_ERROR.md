# Fix Settings 500 Error

## Problem
The `/api/settings` endpoint is returning a 500 Internal Server Error due to Row Level Security (RLS) policies that require authentication for reading settings.

## Root Cause
The settings table has RLS enabled with policies that only allow authenticated users to read settings, but the API is being called from unauthenticated contexts (like when the app first loads).

## Solution

### Option 1: Update Database RLS Policies (Recommended)

Run the following SQL in your Supabase SQL editor:

```sql
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
```

### Option 2: Run the SQL File

1. Copy the contents of `update_settings_rls.sql`
2. Paste it into your Supabase SQL editor
3. Run the script

### Option 3: Manual Database Update

1. Go to your Supabase dashboard
2. Navigate to Authentication > Policies
3. Find the `settings` table
4. Update the SELECT policy to allow public access
5. Keep UPDATE and INSERT policies restricted to authenticated users

## What This Fixes

- ✅ Settings API will work for unauthenticated users
- ✅ Analytics components will load properly
- ✅ No more 500 errors in the console
- ✅ App will use default settings if server is unavailable
- ✅ Security is maintained (only authenticated users can modify settings)

## Verification

After applying the fix:

1. Check the browser console - no more 500 errors
2. Settings should load successfully
3. Analytics components should initialize properly
4. The app should work without authentication issues

## Fallback Behavior

The updated code now includes:
- Default settings fallback
- Graceful error handling
- Automatic retry logic
- Better error logging

If the database is still unavailable, the app will use default settings and continue to function.
