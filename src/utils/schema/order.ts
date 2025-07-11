import { z } from 'zod';

export const orderInputSchema = z.object({
    status: z.string(),
    total: z.string(),
    customer_id: z.string(),
    order_items: z.array(z.object({
        product_id: z.string(),
        quantity: z.string(),
        price: z.string(),
    })),
})

export const orderSchema = z.object({
    id: z.string(),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    total: z.string(),
    customer_id: z.string(),
    order_items: z.array(z.object({
        product_id: z.string(),
        quantity: z.string(),
        price: z.string(),
    })),
})

export const transformOrderInput = (input: z.infer<typeof orderInputSchema>) => ({
    ...input,
    status: input.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
    total: parseFloat(input.total),
    order_items: input.order_items.map((item) => ({
        ...item,
        price: item.price.toString(),
        quantity: item.quantity.toString(),
    })),
})

export type OrderInputType = z.infer<typeof orderInputSchema>;
export type OrderSchemaType = z.infer<typeof orderSchema>;