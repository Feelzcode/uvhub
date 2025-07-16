'use server'

import { Order, OrderItem } from '@/store/types'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  redirect('/admin/sign-in')
} 

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return user
}

// System Analytics Data
export async function getOrdersByProduct(): Promise<{
  product: string;
  quantity: number;
  total: number;
  date: Date;
}[]> {
  const supabase = await createClient();
  // Fetch order items
  const { data: orderItems, error: orderItemsError } = await supabase
    .from('order_items')
    .select('*, orders:order_id(*)')
    .eq('orders.status', 'delivered');
  if (orderItemsError) {
    console.error(orderItemsError);
    return [];
  }

  // Fetch products
  const { data: products, error: productsError } = await supabase.from('products').select('*');
  if (productsError) {
    console.error(productsError);
    return [];
  }

  // Arrange the data for the analytics chart
  const data = orderItems.map((orderItem: OrderItem) => {
    const order = (orderItem.order_id as unknown as Order);
    const product = products.find((product) => product.id === orderItem.product_id);
    return {
      product: product?.name,
      quantity: orderItem.quantity,
      total: order.total,
      date: order.created_at,
    };
  });


  return data;
}