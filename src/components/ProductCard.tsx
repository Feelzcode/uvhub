'use client';

import { useCart, useProducts } from '@/store/hooks';
import { Product } from '@/store/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, isInCart } = useCart();
    const { setSelectedProduct } = useProducts();

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    const handleViewDetails = () => {
        setSelectedProduct(product);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    ${product.price}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviews} reviews)
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {product.stock} in stock
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleViewDetails}
                        className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                        View Details
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isInCart(product.id) || product.stock === 0}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${isInCart(product.id)
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : product.stock === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isInCart(product.id) ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
} 