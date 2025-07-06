'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from './ProtectedRoute'

interface ProtectedRouteWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

export default function ProtectedRouteWrapper({ children, fallback }: ProtectedRouteWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <ProtectedRoute fallback={fallback}>
        {children}
      </ProtectedRoute>
    </Suspense>
  )
}
