'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { useUserStore } from '@/store'
import { User } from '@/store/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { setUser, setLoading, setError, loading } = useUserStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'
          router.push(`/admin/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`)
          return
        }

        setUser(user as User)
        setLoading(false)
        setError(null)

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/sign-in')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, searchParams, supabase.auth, setUser, setLoading, setError])

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Signing you in...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
} 