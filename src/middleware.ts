import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
    // update user's auth session
    const response = await updateSession(request);

    // Check if the request is for admin dashboard routes
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        // Create Supabase client to check authentication
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { user }, error } = await supabase.auth.getUser();

        // If user is not authenticated, redirect to sign-in
        if (!user || error) {
            const signInUrl = new URL('/admin/sign-in', request.url)
            signInUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(signInUrl)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}