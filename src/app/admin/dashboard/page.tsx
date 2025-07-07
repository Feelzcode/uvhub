'use client'

import { useEffect } from "react"
import { useProductsStore } from "@/store";

function DashboardPage() {
  const { getProducts, products, getCategories, categories } = useProductsStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getProducts(), getCategories()]);
    }
    fetchData();
  }, [getProducts, getCategories]);

  console.log(products, 'All the available products')
  console.log(categories, 'All the available categories')

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

      </div>
    </div>
  )
}
export default DashboardPage
