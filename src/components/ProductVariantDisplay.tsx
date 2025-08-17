'use client';

import React, { useState } from 'react';
import { Product, ProductVariant, ProductImage } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Star,
  Eye,
  ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/store/hooks';
import { useCurrency } from '@/store/hooks/useCurrency';
import { getProductPrice } from '@/utils/productPrice';

interface ProductVariantDisplayProps {
  product: Product;
  onClose?: () => void;
}

export default function ProductVariantDisplay({ product, onClose }: ProductVariantDisplayProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);

  const { addToCart, isInCart } = useCart();
  const { formatCurrentPrice, location } = useCurrency();

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Update current images for lightbox
    if (variant.images && variant.images.length > 0) {
      setCurrentImages(variant.images);
    } else if (product.images && product.images.length > 0) {
      setCurrentImages(product.images);
    } else {
      setCurrentImages([]);
    }
  };

  const openLightbox = (imageIndex: number = 0) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }
  };

  const prevImage = () => {
    if (currentImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      // Add the variant to cart
      addToCart(product, 1, selectedVariant);
    } else {
      // Add the main product to cart
      addToCart(product, 1);
    }
  };

  const getDisplayImages = () => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [];
  };

  const getDisplayPrice = () => {
    if (selectedVariant) {
      return getProductPrice(selectedVariant, location);
    }
    return getProductPrice(product, location);
  };

  const getDisplayStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product.stock;
  };

  const displayImages = getDisplayImages();
  const displayPrice = getDisplayPrice();
  const displayStock = getDisplayStock();
  const isVariantInCart = selectedVariant ? isInCart(selectedVariant.id) : isInCart(product.id);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <p className="text-gray-600 mt-1">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            {displayImages.length > 0 ? (
              <Image
                src={displayImages[0]?.image_url || product.image}
                alt={displayImages[0]?.alt_text || product.name}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => openLightbox(0)}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            
            {/* Lightbox Button */}
            {displayImages.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openLightbox(0)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
          </div>

          {/* Thumbnail Grid */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.slice(1, 5).map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md border cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => openLightbox(index + 1)}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `Product image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </div>
              ))}
              {displayImages.length > 5 && (
                <div className="relative aspect-square bg-gray-100 rounded-md border flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{displayImages.length - 5}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrentPrice(displayPrice, { code: 'USD', symbol: '$' })}
              </span>
              {selectedVariant && (
                <Badge variant="outline" className="text-sm">
                  Variant Price
                </Badge>
              )}
            </div>
            {selectedVariant?.price_ngn && (
              <p className="text-lg text-gray-600">
                ₦{selectedVariant.price_ngn.toLocaleString()}
              </p>
            )}
            {selectedVariant?.price_ghs && (
              <p className="text-lg text-gray-600">
                ₵{selectedVariant.price_ghs.toLocaleString()}
              </p>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Available Variants</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <Card
                    key={variant.id}
                    className={`cursor-pointer transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'ring-2 ring-blue-500 border-blue-500'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    <CardContent className="p-3">
                      <div className="text-sm font-medium">{variant.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        ${variant.price}
                        {variant.price_ngn && ` • ₦${variant.price_ngn}`}
                        {variant.price_ghs && ` • ₵${variant.price_ghs}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Stock: {variant.stock}
                      </div>
                      {variant.images && variant.images.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Stock:</span>
            <Badge
              variant={displayStock > 0 ? 'default' : 'destructive'}
              className={displayStock > 0 ? 'bg-green-500' : ''}
            >
              {displayStock > 0 ? `${displayStock} available` : 'Out of Stock'}
            </Badge>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={displayStock === 0 || isVariantInCart}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isVariantInCart ? (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                In Cart
              </>
            ) : displayStock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Product Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Rating:</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{product.rating || '4.5'}</span>
                <span className="ml-1">({product.reviews || 0} reviews)</span>
              </div>
            </div>
            <div>Category: {product.category_data?.name || 'Uncategorized'}</div>
            {selectedVariant?.description && (
              <div>
                <span className="font-medium">Variant Details:</span> {selectedVariant.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:bg-white hover:text-black z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {currentImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black z-10"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:text-black z-10"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div className="relative max-w-5xl max-h-full p-8">
              <Image
                src={currentImages[currentImageIndex]?.image_url || ''}
                alt={currentImages[currentImageIndex]?.alt_text || 'Product image'}
                width={1000}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} of {currentImages.length}
            </div>

            {/* Thumbnail Navigation */}
            {currentImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
                {currentImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-blue-500 scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || `Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
