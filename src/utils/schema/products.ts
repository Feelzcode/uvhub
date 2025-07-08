import { z } from "zod";

// Input schema for form data (strings from HTML inputs)
export const productInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.string().min(1),
    stock: z.string().min(1),
    image: z.string().min(1),
});

// Output schema for processed data (numbers)
export const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0).max(1000000),
    stock: z.number().min(0).max(1000000),
    image: z.string().min(1),
});

// Transform function to convert input to output
export const transformProductInput = (input: z.infer<typeof productInputSchema>) => ({
    ...input,
    price: parseFloat(input.price),
    stock: parseInt(input.stock, 10),
});

export type ProductInputType = z.infer<typeof productInputSchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;