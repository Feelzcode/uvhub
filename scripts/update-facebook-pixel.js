// Script to update Facebook Pixel ID
// Run with: node scripts/update-facebook-pixel.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFacebookPixel() {
    try {
        console.log('Updating Facebook Pixel settings...');

        // Get current settings
        const { data: currentSettings, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (fetchError && fetchError.code === 'PGRST116') {
            // No settings exist, create new ones
            console.log('No settings found, creating new settings...');
            const { data: newSettings, error: createError } = await supabase
                .from('settings')
                .insert([{
                    facebook_pixel_id: '775139811605510',
                    facebook_pixel_enabled: true,
                    google_analytics_id: '',
                    google_analytics_enabled: false,
                    site_name: 'UVHub',
                    site_description: 'Your Ultimate Shopping Destination',
                    contact_email: '',
                    contact_phone: '',
                }])
                .select()
                .single();

            if (createError) {
                console.error('Error creating settings:', createError);
                return;
            }

            console.log('✅ Settings created successfully:', newSettings);
        } else if (fetchError) {
            console.error('Error fetching settings:', fetchError);
            return;
        } else {
            // Update existing settings
            console.log('Updating existing settings...');
            const { data: updatedSettings, error: updateError } = await supabase
                .from('settings')
                .update({
                    facebook_pixel_id: '775139811605510',
                    facebook_pixel_enabled: true,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentSettings.id)
                .select()
                .single();

            if (updateError) {
                console.error('Error updating settings:', updateError);
                return;
            }

            console.log('✅ Settings updated successfully:', updatedSettings);
        }

        console.log('🎉 Facebook Pixel ID 775139811605510 has been enabled!');
        console.log('The pixel will now track events on your website.');

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

updateFacebookPixel();
