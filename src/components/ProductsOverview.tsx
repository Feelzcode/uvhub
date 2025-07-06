'use client'

import React from 'react'
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUp } from 'lucide-react'
import { Category, Customer, Product } from '@/store/types'

function ProductsOverview({ products, categories, customers }: { products: Product[], categories: Category[], customers: Customer[] }) {

    // calculate the growth rate for the last 30 days
    const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
    const customersLast30Days = customers.filter(customer => {
        // Convert string date to Date object for comparison
        const customerDate = new Date(customer.created_at);
        return customerDate > last30Days;
    });

    // Calculate growth rate, handling division by zero
    const growthRate = customers.length > 0 ? (customersLast30Days.length / customers.length) * 100 : 0;
    const growthRatePercentage = growthRate;

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Products</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {products.length}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +{products.length}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total Products <TrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Total Products
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Categories</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {categories.length}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +{categories.length}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total Categories <TrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Total Categories
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Customers</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {customers.length}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +{customers.length}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total Customers <TrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Total Customers</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Growth Rate</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {growthRatePercentage}%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +{growthRatePercentage}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Growth Rate <TrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Growth Rate</div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProductsOverview