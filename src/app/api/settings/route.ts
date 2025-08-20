import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // First, try to get the current user to check authentication
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Check if settings table exists and has data
        const { data: settings, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) {
            console.error('Settings fetch error:', error);
            
            // If no settings exist, create default settings
            if (error.code === 'PGRST116') {
                console.log('No settings found, creating default settings...');
                
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
                    console.error('Failed to create default settings:', createError);
                    return NextResponse.json(
                        { 
                            error: 'Failed to create default settings',
                            details: createError.message,
                            code: createError.code
                        },
                        { status: 500 }
                    );
                }

                console.log('Default settings created successfully');
                return NextResponse.json(newSettings);
            }

            // If it's an RLS error, return a more specific message
            if (error.code === '42501') {
                console.error('RLS policy error - user may not be authenticated');
                return NextResponse.json(
                    { 
                        error: 'Access denied - authentication required',
                        code: error.code,
                        message: 'Settings table requires authentication'
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { 
                    error: 'Failed to fetch settings',
                    details: error.message,
                    code: error.code
                },
                { status: 500 }
            );
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication for PUT requests
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required to update settings' },
                { status: 401 }
            );
        }

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
                console.error('Settings update error:', error);
                return NextResponse.json(
                    { 
                        error: 'Failed to update settings',
                        details: error.message,
                        code: error.code
                    },
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
                console.error('Settings creation error:', error);
                return NextResponse.json(
                    { 
                        error: 'Failed to create settings',
                        details: error.message,
                        code: error.code
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(newSettings);
        }
    } catch (error) {
        console.error('Settings PUT error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 