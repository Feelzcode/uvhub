import { Customer, Order, OrderItem } from '@/store/types';

// Client-side API client for orders
export const ordersApi = {
  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Place a new order
  async placeOrder(orderDetails: {
    customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[],
    total: number,
    paymentMethod: string,
  }): Promise<Order | null> {
    try {
      const response = await fetch('/api/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    }
  },

  // Update an order
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  },

  // Delete an order
  async deleteOrder(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  },
};
