'use client';

import { useProducts } from '@/store/hooks';
import { Star, Filter, X, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/store/types';
import { useProductsStore, useCurrencyStore } from '@/store';



export default function AllEquipmentPage() {
  const {
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    getProducts,
  } = useProductsStore();
  const {
    products,
  } = useProducts();
  const { formatPrice, currentCurrency } = useCurrencyStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();

  // Fetch products on mount and when filters change
  useEffect(() => {
    getProducts();
  }, [getProducts, filters]);

  // Get unique categories from products (as objects)
  const categories: Category[] = products && products.length > 0
    ? Array.from(
      new Map(
        products
          .filter((p): p is Product & { category: Category } => !!p && !!p.category && !!p.category.id)
          .map((p) => [p.category.id, p.category])
      ).values()
    )
    : [];

  // Filter products based on active filters
  const filteredProducts = products?.filter((product): product is Product => {
    if (!product) return false;
    if (filters.category && product.category?.id !== filters.category) return false;
    return true;
  }) || [];

  const handleSetCategoryFilter = (categoryId: string) => {
    setFilters({ ...filters, category: categoryId });
    setMobileFiltersOpen(false);
  };

  const handleClearCategoryFilter = () => {
    const newFilters = { ...filters, category: undefined };
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Error loading products: {error}</p>
        <button
          onClick={getProducts}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with back button and mobile filter toggle */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/home" className="flex items-center gap-2 text-blue-600 hover:underline">
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Filters</h2>
              {filters.category && (
                <button
                  onClick={handleClearCategoryFilter}
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleClearCategoryFilter}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSetCategoryFilter(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${filters.category === category.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={handleClearCategoryFilter}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleSetCategoryFilter(category.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${filters.category === category.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filters.category && (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Filtered by:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {categories.find((cat) => cat.id === filters.category)?.name || filters.category}
                  <button
                    onClick={handleClearCategoryFilter}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/home/product/${product.id}`)}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <Image
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name} 
                      fill
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price, currentCurrency)}</span>
                        {product.price && (
                          <span className="text-gray-500 line-through text-sm ml-2">
                            {formatPrice(product.price, currentCurrency)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="ml-1">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {product.category?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
              <p className="text-gray-500 mt-2">
                {filters.category
                  ? `No products in "${categories.find((cat) => cat.id === filters.category)?.name || filters.category}" category`
                  : 'No products available'}
              </p>
              {filters.category && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}