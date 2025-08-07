import { z } from "zod";

// Input schema for form data
export const productImageInputSchema = z.object({
    product_id: z.string().min(1),
    image_url: z.string().min(1),
    alt_text: z.string().optional(),
    is_primary: z.boolean().default(false),
    sort_order: z.number().default(0),
});

// Output schema for processed data
export const productImageSchema = z.object({
    product_id: z.string().min(1),
    image_url: z.string().min(1),
    alt_text: z.string().optional(),
    is_primary: z.boolean().default(false),
    sort_order: z.number().default(0),
});

// Transform function to convert input to output
export const transformProductImageInput = (input: z.infer<typeof productImageInputSchema>) => ({
    ...input,
});

export type ProductImageInputSchemaType = z.infer<typeof productImageInputSchema>;
export type ProductImageSchemaType = z.infer<typeof productImageSchema>;
