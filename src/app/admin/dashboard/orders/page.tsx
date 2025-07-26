import OrdersOverview from '@/components/OrdersOverview'
import React from 'react'
import { getAllOrders } from './actions';
import { getAllCustomers } from '../products/actions';
import { OrdersDatatable } from '@/components/OrdersDatatable';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders Management",
  description: "View and manage customer orders at UVHub.",
};

async function OrdersPage() {
  const [orders, customers] = await Promise.all([
    getAllOrders(),
    getAllCustomers(),
  ]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <OrdersOverview orders={orders} customers={customers} />
        <div className="px-4 lg:px-6">
          <OrdersDatatable />
        </div>
      </div>
    </div>
  )
}

export default OrdersPage