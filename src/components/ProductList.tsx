'use client';

import { useProductsStore } from '@/store';
import { ProductCard } from './ProductCard';
import { useEffect } from 'react';

export function ProductList() {
    const { categories, loading, error, getCategories } = useProductsStore();

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    if (loading) {
        return <div className="flex justify-center items-center p-8">Loading products...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }

    if (!categories || categories.length === 0) {
        return <div className="text-center p-8">No products found.</div>;
    }

    return (
        <div className="space-y-8">
            {categories.map((category) => (
                <div key={category.id} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600">{category.description}</p>
                    
                    {category.types && category.types.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.types.map((type) => (
                                <ProductCard 
                                    key={type.id} 
                                    product={{
                                        id: type.id,
                                        name: type.name,
                                        description: type.description,
                                        price: type.price,
                                        image: type.image,
                                        category: category,
                                        stock: 0,
                                        rating: 0,
                                        reviews: 0,
                                        created_at: type.created_at,
                                        updated_at: type.updated_at,
                                        price_ngn: 0,
                                        price_ghs: 0,
                                        types: [type]
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No product types available for this category.</p>
                    )}
                </div>
            ))}
        </div>
    );
} 