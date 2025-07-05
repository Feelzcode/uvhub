'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/store/hooks';
import ProductCard from './ProductCard';

export default function ProductList() {
    const {
        products,
        loading,
        error,
        filters,
        setFilters,
        clearFilters,
        getFilteredProducts,
        fetchProducts,
    } = useProducts();

    const [searchTerm, setSearchTerm] = useState(filters.search);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilters({ search: searchTerm });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, setFilters]);

    const filteredProducts = getFilteredProducts();

    const categories = Array.from(new Set(products.map(p => p.category)));

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error: {error}</p>
                <button
                    onClick={fetchProducts}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price
                        </label>
                        <input
                            type="number"
                            value={filters.maxPrice === Infinity ? '' : filters.maxPrice}
                            onChange={(e) => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : Infinity })}
                            placeholder="Max price..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="mb-4">
                <p className="text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
} 