'use client';

import { useProductsStore } from '@/store';
import { useEffect } from 'react';
import Image from 'next/image';

export function ProductExample() {
    const { categories, loading, error, getCategories } = useProductsStore();

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Products by Category</h1>
            
            {categories?.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    {category.types && category.types.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.types.map((type) => (
                                <div key={type.id} className="border rounded p-3">
                                    <div className="relative w-full h-32 mb-2">
                                        <Image 
                                            src={type.image} 
                                            alt={type.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <h3 className="font-medium">{type.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                                    <p className="font-bold text-green-600">${type.price}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No product types available</p>
                    )}
                </div>
            ))}
        </div>
    );
}
