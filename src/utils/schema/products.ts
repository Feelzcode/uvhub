import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0).max(1000000),
    stock: z.number().min(0).max(1000000),
    image: z.string().min(1),
});

export type ProductSchemaType = z.infer<typeof productSchema>;