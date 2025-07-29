'use client'

import { useEffect, useState } from "react"
import { useOrdersStore, useProductsStore } from "@/store";
import DashboardCardsSections from "@/components/DashboardCardsSections"
import { getOrdersByProduct } from "./actions";
import DashboardChartSection from "@/components/DashboardChartSection";


function DashboardPage() {
  const { getProducts, products, getCategories } = useProductsStore();
  const { setOrders, orders } = useOrdersStore();
  const [ordersByProduct, setOrdersByProduct] = useState<{
    product: string;
    quantity: number;
    total: number;
    date: Date;
  }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getProducts(), getCategories(), setOrders()]);
      const ordersByProduct = await getOrdersByProduct();
      setOrdersByProduct(ordersByProduct);
    }
    fetchData();
  }, [getProducts, getCategories, setOrders]);


  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full">
        <DashboardCardsSections
          totalRevenue={orders.reduce((acc, order) => acc + order.total, 0)}
          totalProducts={products.length}
          totalOrders={orders.length}
          totalCustomers={0}
        />
        <DashboardChartSection ordersByProduct={ordersByProduct} />
      </div>
    </div>
  )
}
export default DashboardPage
