'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { toast } from 'sonner'

export async function login(formData: FormData, redirectTo?: string) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    console.log(data, 'Data being passed to the auth endpoint');

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        toast.error(error.message)
    }

    revalidatePath('/', 'layout')

    if (redirectTo) redirect(redirectTo) 

    redirect('/admin/dashboard')
}
