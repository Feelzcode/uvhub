'use client'


import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPassword } from "./actions"
import { type ForgotPasswordFormData, forgotPasswordSchema } from "@/utils/schema"
import { NextSeo } from 'next-seo';


export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError(null);

        try {
            // Create FormData for Server Action
            const formData = new FormData()
            formData.append('email', data.email)

            const result = await forgotPassword(formData)

            if (!result.success) {
                setError(result.error || 'Something went wrong');
            } else {
                setIsSubmitted(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    if (isSubmitted) {
        return (
            <>
                <NextSeo
                    title="Check Your Email | UVHub Admin"
                    description="Password reset link has been sent to your email address."
                />
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Check your email</h1>
                        <p className="text-muted-foreground mt-2">
                            We&apos;ve sent a password reset link to your email address.
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

    return (
        <>
            <NextSeo
                title="Forgot Password | UVHub Admin"
                description="Reset your UVHub admin account password. Enter your email to receive a reset link."
            />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Forgot your password?</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...register('email')}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
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
                                Sending...
                            </>
                        ) : (
                            'Send reset link'
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