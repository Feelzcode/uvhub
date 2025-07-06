'use server'

import { createClient } from '@/utils/supabase/server'
import { resetPasswordSchema } from '@/utils/schema'

export async function resetPassword(formData: FormData) {
  try {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    // Validate password
    const validatedFields = resetPasswordSchema.safeParse({ 
      password, 
      confirmPassword 
    })
    
    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0]?.message || 'Invalid password',
        success: false,
      }
    }

    const supabase = await createClient()
    
    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error('Password update error:', error)
      return {
        error: 'Failed to update password',
        success: false,
      }
    }

    return {
      success: true,
      message: 'Password updated successfully',
    }

  } catch (error) {
    console.error('Reset password error:', error)
    return {
      error: 'An unexpected error occurred',
      success: false,
    }
  }
}

// Validate if user is authenticated (has valid session)
export async function validateAuthSession() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return {
        isAuthenticated: false,
        error: 'No valid session found',
      }
    }

    return {
      isAuthenticated: true,
      user,
    }

  } catch (error) {
    console.error('Session validation error:', error)
    return {
      isAuthenticated: false,
      error: 'Failed to validate session',
    }
  }
} 