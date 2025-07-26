import { placeOrder } from "@/app/admin/dashboard/orders/actions";

export async function POST(req: Request) {
    const body = await req.json();
    try {

        const order = await placeOrder(body);
        if (!order) {
            return new Response('Order creation failed', {
                status: 500
            });
        }
        return new Response(JSON.stringify(order), {
            status: 200
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: (error as Error).message || "Internal server error" }), {
            status: 500
        })
    }
}