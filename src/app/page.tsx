'use client';

import { useState } from 'react';
import { useEcommerce } from '@/store/hooks';
import ProductList from '@/components/ProductList';
import CartSummary from '@/components/CartSummary';

export default function Home() {
  const { cart } = useEcommerce();
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">UVHub E-commerce</h1>
            
            {/* Navigation */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  activeTab === 'cart'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cart
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Our Products
              </h2>
              <p className="text-gray-600">
                Discover amazing products with our powerful state management powered by Zustand
              </p>
            </div>
            <ProductList />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h2>
              <p className="text-gray-600">
                Your cart is persisted using Zustand&apos;s persist middleware
              </p>
            </div>
            <div className="max-w-2xl">
              <CartSummary />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>Built with Next.js and Zustand State Management</p>
            <p className="mt-2 text-sm">
              Features: Product filtering, shopping cart, persistent state, and more!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
