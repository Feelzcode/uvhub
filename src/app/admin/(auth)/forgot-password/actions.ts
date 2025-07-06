'use server'

import { createClient } from '@/utils/supabase/server'
import { forgotPasswordSchema } from '@/utils/schema'

export async function forgotPassword(formData: FormData) {
  try {
    const email = formData.get('email') as string
    
    // Validate email
    const validatedFields = forgotPasswordSchema.safeParse({ email })
    
    if (!validatedFields.success) {
      return {
        error: 'Invalid email address',
        success: false,
      }
    }

    const supabase = await createClient()
    
    // Use Supabase's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      return {
        error: 'Failed to send password reset email',
        success: false,
      }
    }

    // Always return success for security (don't reveal if email exists)
    return {
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      error: 'An unexpected error occurred',
      success: false,
    }
  }
} 