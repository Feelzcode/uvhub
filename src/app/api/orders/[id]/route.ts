import { getOrderById } from "@/app/admin/dashboard/orders/actions";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    
    if (!order) {
      return new Response('Order not found', {
        status: 404
      });
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 