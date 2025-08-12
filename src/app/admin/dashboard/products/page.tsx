import ProductsOverview from '@/components/ProductsOverview'
import React from 'react'
import { getPaginatedCategories, getPaginatedCustomers } from './actions'
import { ProductsDataTable } from '@/components/ProductsDatatable';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Management",
  description: "Manage UVHub categories, product types, and inventory.",
};

async function ProductsPage() {
    const [categories, customers] = await Promise.all([
        getPaginatedCategories({ page: 1, limit: 10 }),
        getPaginatedCustomers({ page: 1, limit: 10 }),
    ]);

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <ProductsOverview
                    categories={categories.documents}
                    customers={customers.documents}
                />
                <div className="px-4 lg:px-6">
                    <ProductsDataTable
                        categoriesData={categories}
                        customersData={customers}
                    />
                </div>
            </div>
        </div>
    )
} export default ProductsPage

