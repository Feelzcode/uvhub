'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPassword, validateResetToken } from "./actions"
import { ResetPasswordFormData, resetPasswordSchema } from "@/utils/schema"
import { useSearchParams } from "next/navigation"
import { NextSeo } from 'next-seo';

export default function ResetPasswordClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // I should validate the code that is available as a query parameter here
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await validateResetToken(token || '')
        
        if (!result.success) {
          setError(result.error || 'Invalid or expired reset link. Please request a new password reset.');
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
        }
      } catch (err) {
        setIsValidSession(false);
        setError(err instanceof Error ? err.message : 'Failed to validate reset link. Please try again.');
      }
    };

    checkSession();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    try {
      // Create FormData for Server Action
      const formData = new FormData()
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      
      const result = await resetPassword(formData)

      if (!result.success) {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  if (isSubmitSuccessful) {
    return (
      <>
        <NextSeo
          title="Password Reset Successful | UVHub Admin"
          description="Your password has been successfully reset. You can now sign in with your new password."
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Password reset successful</h1>
            <p className="text-muted-foreground mt-2">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>
          <Link
            href="/admin/sign-in"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </>
    );
  }

  if (isValidSession === false) {
    return (
      <>
        <NextSeo
          title="Invalid Reset Link | UVHub Admin"
          description="The password reset link is invalid or has expired. Please request a new password reset."
        />
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Invalid reset link</h1>
            <p className="text-muted-foreground mt-2">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
          </div>
          <Link
            href="/admin/forgot-password"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Request new reset link
          </Link>
        </div>
      </>
    );
  }

  if (isValidSession === null) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Validating reset link...</p>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title="Reset Password | UVHub Admin"
        description="Set a new password for your UVHub admin account."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                className="absolute right-0 top-0 h-full p-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                className="absolute right-0 top-0 h-full p-2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/admin/sign-in"
              className="flex items-center justify-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
