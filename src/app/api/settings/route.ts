import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: settings, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) {
            // If no settings exist, create default settings
            if (error.code === 'PGRST116') {
                const defaultSettings = {
                    facebook_pixel_id: '',
                    facebook_pixel_enabled: false,
                    google_analytics_id: '',
                    google_analytics_enabled: false,
                    site_name: 'UVHub',
                    site_description: 'Your Ultimate Shopping Destination',
                    contact_email: '',
                    contact_phone: '',
                };

                const { data: newSettings, error: createError } = await supabase
                    .from('settings')
                    .insert([defaultSettings])
                    .select()
                    .single();

                if (createError) {
                    return NextResponse.json(
                        { error: 'Failed to create default settings' },
                        { status: 500 }
                    );
                }

                return NextResponse.json(newSettings);
            }

            return NextResponse.json(
                { error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Validate required fields
        if (!body.site_name) {
            return NextResponse.json(
                { error: 'Site name is required' },
                { status: 400 }
            );
        }

        // Get current settings
        const { data: currentSettings } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (currentSettings) {
            // Update existing settings
            const { data: updatedSettings, error } = await supabase
                .from('settings')
                .update({
                    ...body,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentSettings.id)
                .select()
                .single();

            if (error) {
                return NextResponse.json(
                    { error: 'Failed to update settings' },
                    { status: 500 }
                );
            }

            return NextResponse.json(updatedSettings);
        } else {
            // Create new settings
            const { data: newSettings, error } = await supabase
                .from('settings')
                .insert([{
                    ...body,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) {
                return NextResponse.json(
                    { error: 'Failed to create settings' },
                    { status: 500 }
                );
            }

            return NextResponse.json(newSettings);
        }
    } catch (error) {
        console.error('Settings PUT error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 