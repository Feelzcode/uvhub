-- Update Facebook Pixel ID in settings table
UPDATE settings 
SET 
    facebook_pixel_id = '775139811605510',
    facebook_pixel_enabled = true,
    updated_at = NOW()
WHERE id = (SELECT id FROM settings LIMIT 1);

-- If no settings exist, create them
INSERT INTO settings (
    facebook_pixel_id,
    facebook_pixel_enabled,
    google_analytics_id,
    google_analytics_enabled,
    site_name,
    site_description,
    contact_email,
    contact_phone,
    created_at,
    updated_at
) 
SELECT 
    '775139811605510',
    true,
    '',
    false,
    'UVHub',
    'Your Ultimate Shopping Destination',
    '',
    '',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM settings);
