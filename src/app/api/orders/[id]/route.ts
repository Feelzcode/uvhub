import { getOrderById, updateOrder, deleteOrder } from "@/app/admin/dashboard/orders/actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
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
    return new Response(JSON.stringify({ error: 'Failed to fetch order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const updatedOrder = await updateOrder(id, updates);
    
    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: 'Failed to update order' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to update order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteOrder(id);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to delete order' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}