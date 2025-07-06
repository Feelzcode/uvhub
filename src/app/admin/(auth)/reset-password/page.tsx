import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import ResetPasswordClient from './ResetPasswordClient'

const LoadingFallback = () => (
  <div className="flex flex-col items-center gap-6 text-center">
    <Loader2 className="w-8 h-8 animate-spin" />
    <p>Loading reset password form...</p>
  </div>
)

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordClient />
    </Suspense>
  )
}
