'use client';

import { useCart } from '@/store/hooks';
import { useCurrency } from '@/store/hooks/useCurrency';
import { Currency, Product } from '@/store/types';
import Image from 'next/image';
import { getProductImage } from '@/utils/productImage';
import { getProductPrice } from '@/utils/productPrice';
import { Badge } from '@/components/ui/badge';
import { Eye, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    currency: Currency;
}

export default function ProductCard({ product, currency }: ProductCardProps) {
    const { addToCart, isInCart } = useCart();
    const { formatCurrentPrice, location } = useCurrency();

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
                <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {formatCurrentPrice(getProductPrice(product, location), currency)}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                    </h3>
                    {product.variants && product.variants.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
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
                    <div className="text-right">
                        {product.variants && product.variants.length > 0 ? (
                            <div className="text-xs text-gray-500">
                                <div>From {formatCurrentPrice(getProductPrice(product, location), currency)}</div>
                                <div>{product.variants.length} options</div>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {product.stock} in stock
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    {product.variants && product.variants.length > 0 && (
                        <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                                <Eye className="w-3 h-3" />
                                <span>Hover to see variants</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                {product.variants.slice(0, 3).map((variant, index) => (
                                    <div key={variant.id} className="text-center p-1 bg-gray-50 rounded text-xs">
                                        {variant.name}
                                    </div>
                                ))}
                                {product.variants.length > 3 && (
                                    <div className="text-center p-1 bg-gray-50 rounded text-xs">
                                        +{product.variants.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={isInCart(product.id) || product.stock === 0}
                        className={`w-full py-2 px-4 rounded-md transition-colors duration-200 ${isInCart(product.id)
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