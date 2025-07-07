'use client'

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "./actions"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/utils/schema"
import { useSearchParams } from "next/navigation"

export default function SignInPage(){
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // get the query parameter from the url
    const query = useSearchParams();
    const redirectTo = query.get('redirectTo');
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            // Create FormData for Server Action
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)
            
            // Call the Server Action
            await login(formData, redirectTo ?? undefined)
        } catch (error) {
            // Handle errors from Server Action
            if (error instanceof Error) {
                setError('root', {
                    type: 'manual',
                    message: error.message,
                })
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'An unexpected error occurred',
                })
            }
        }
    }

    return (
        <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            
            {/* Root error display */}
            {errors.root && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {errors.root.message}
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
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/admin/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
                        >
                            Forgot your password?
                        </Link>
                    </div>
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
                <Button 
                    type="submit" 
                    className="w-full cursor-pointer" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
            </div>
        </form>
    )
}