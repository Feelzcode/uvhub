import { z } from "zod";

// Input schema for category form data
export const categoryInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

// Output schema for processed category data
export const categorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

// Input schema for product type form data
export const productTypeInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    price: z.string().min(1),
    categoryId: z.string().min(1),
});

// Output schema for processed product type data
export const productTypeSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    price: z.number().min(0).max(1000000),
    categoryId: z.string().min(1),
});

// Legacy schemas for backward compatibility
export const productInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.string().min(1),
    price_ngn: z.string().optional(),
    price_ghs: z.string().optional(),
    stock: z.string().min(1),
    image: z.string().min(1),
    subcategory_id: z.string().optional(),
});

export const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0).max(1000000),
    price_ngn: z.number().min(0).max(1000000).optional(),
    price_ghs: z.number().min(0).max(1000000).optional(),
    stock: z.number().min(0).max(1000000),
    image: z.string().min(1),
    subcategory_id: z.string().optional(),
});

// Transform function to convert input to output
export const transformProductInput = (input: z.infer<typeof productInputSchema>) => ({
    ...input,
    price: parseFloat(input.price),
    price_ngn: input.price_ngn ? parseFloat(input.price_ngn) : undefined,
    price_ghs: input.price_ghs ? parseFloat(input.price_ghs) : undefined,
    stock: parseInt(input.stock, 10),
});

export type CategoryInputType = z.infer<typeof categoryInputSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type ProductTypeInputType = z.infer<typeof productTypeInputSchema>;
export type ProductTypeSchemaType = z.infer<typeof productTypeSchema>;
export type ProductInputType = z.infer<typeof productInputSchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;