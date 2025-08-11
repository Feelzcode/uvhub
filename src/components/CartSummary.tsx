'use client';

import { useCartStore } from '@/store';
import { useCurrencyStore } from '@/store';
import Link from 'next/link';
import Image from 'next/image';
import { getProductImage } from '@/utils/productImage';
import { getProductPrice } from '@/utils/productPrice';

export default function CartSummary() {
    const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCartStore();
    const { formatPrice, currentCurrency, location } = useCurrencyStore();

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h2>
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
                <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Clear Cart
                </button>
            </div>

            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className='w-16 h-16 relative'>
                            <Image
                                src={getProductImage(item.product)}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded-md"
                                sizes="64px"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">{formatPrice(getProductPrice(item.product, location), currentCurrency)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">{formatPrice(getProductPrice(item.product, location) * item.quantity, currentCurrency)}</p>
                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total ({itemCount} items):</span>
                    <span className="text-xl font-bold text-blue-600">{formatPrice(total, currentCurrency)}</span>
                </div>

                <Link href="/home/check-out" className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 block text-center cursor-pointer">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
} 