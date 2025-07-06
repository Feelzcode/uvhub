import { z } from "zod"

// Zod schema for form validation
export const signInSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
})

export type SignInFormData = z.infer<typeof signInSchema>

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
