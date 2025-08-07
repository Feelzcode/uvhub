import { z } from "zod";

// Input schema for form data (strings from HTML inputs)
export const subcategoryInputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category_id: z.string().min(1),
});

// Output schema for processed data
export const subcategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category_id: z.string().min(1),
});

// Transform function to convert input to output
export const transformSubcategoryInput = (input: z.infer<typeof subcategoryInputSchema>) => ({
    ...input,
});

export type SubcategoryInputSchemaType = z.infer<typeof subcategoryInputSchema>;
export type SubcategorySchemaType = z.infer<typeof subcategorySchema>;
