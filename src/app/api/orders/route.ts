import { getAllOrders } from "@/app/admin/dashboard/orders/actions";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
