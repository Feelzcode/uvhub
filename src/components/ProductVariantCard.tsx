'use client';

import React, { useState } from 'react';
import { ProductVariant, Product } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Star, 
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/store/hooks';
import { useCurrency } from '@/store/hooks/useCurrency';
import { getCategoryName, getSubcategoryName, getProductName, getProductDescription, getVariantName, safeRender } from '@/utils/safeRender';
import { getProductImage } from '@/utils/productImage';

interface ProductVariantCardProps {
  product: Product;
  variant: ProductVariant;
  variantIndex: number;
  className?: string;
}

export default function ProductVariantCard({ 
  product, 
  variant, 
  variantIndex,
  className = ''
}: ProductVariantCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { formatCurrentPrice, location } = useCurrency();

  const handleAddToCart = () => {
    if (variant.stock > 0) {
      addToCart(product, 1);
    }
  };

  const getDisplayImages = () => {
    // Debug logging
    console.log('ProductVariantCard - Variant:', {
      variantId: variant.id,
      variantName: variant.name,
      variantImages: variant.images,
      variantImageUrl: variant.image_url,
      productImages: product.images,
      productImage: product.image
    });

    if (variant.images && variant.images.length > 0) {
      console.log('Using variant images:', variant.images);
      return variant.images;
    }
    if (variant.image_url) {
      console.log('Using variant image_url:', variant.image_url);
      return [{ id: 'single', image_url: variant.image_url, alt_text: variant.name }];
    }
    // Fallback to product's main image (which might be from another variant)
    const fallbackImage = getProductImage(product);
    console.log('Using fallback image:', fallbackImage);
    return [{ id: 'fallback', image_url: fallbackImage, alt_text: getProductName(product) }];
  };

  const displayImages = getDisplayImages();
  const isVariantInCart = isInCart(variant.id);

  const nextImage = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }
  };

  const openLightbox = (imageIndex: number = 0) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
          
          {/* Left Side - Image Layout */}
          <div className="bg-gray-50 flex flex-col">
            {/* Main Image */}
            <div className="flex-1 relative overflow-hidden">
              <Image
                src={displayImages[currentImageIndex]?.image_url || getProductImage(product)}
                alt={displayImages[currentImageIndex]?.alt_text || getVariantName(variant, variantIndex)}
                fill
                className="object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => openLightbox(currentImageIndex)}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Image Navigation */}
              {displayImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {currentImageIndex + 1} / {displayImages.length}
                  </div>
                </>
              )}
              
              {/* View Images Button */}
              {displayImages.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openLightbox(currentImageIndex)}
                  className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
              <div className="p-3 bg-white border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {displayImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || `Variant image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Description and Details */}
          <div className="p-6 flex flex-col">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Variant Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {getVariantName(variant, variantIndex)}
                  </h3>
                  <Badge variant="secondary" className="text-sm">
                    Variant {variantIndex + 1}
                  </Badge>
                </div>
                
                {/* Product Name */}
                <p className="text-lg text-gray-600 mb-2">
                  {getProductName(product)}
                </p>
                
                {/* Variant Description with proper text handling */}
                {variant.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-sm max-h-32 overflow-y-auto">
                      {safeRender(variant.description)}
                    </p>
                    {variant.description.length > 200 && (
                      <button 
                        className="text-blue-600 text-xs mt-1 hover:underline"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const description = target.previousElementSibling as HTMLElement;
                          if (description) {
                            description.classList.toggle('max-h-32');
                            description.classList.toggle('max-h-none');
                            target.textContent = description.classList.contains('max-h-32') 
                              ? 'Show more...' 
                              : 'Show less...';
                          }
                        }}
                      >
                        Show more...
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Variant Details */}
              <div className="space-y-3">
                {/* SKU */}
                {variant.sku && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">SKU:</span>
                    <span className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                      {safeRender(variant.sku)}
                    </span>
                  </div>
                )}

                {/* Variant Type */}
                {variant.type && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="text-sm text-gray-700 bg-blue-100 px-2 py-1 rounded">
                      {safeRender(variant.type)}
                    </span>
                  </div>
                )}

                {/* Category Information */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">
                      Category: <span className="font-medium text-gray-700">
                        {getCategoryName(product.category_data?.name || product.category)}
                      </span>
                    </span>
                    {product.subcategory && (
                      <span className="text-sm text-gray-500">
                        Subcategory: <span className="font-medium text-gray-700">
                          {getSubcategoryName(product.subcategory)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrentPrice(variant.price || variant.price_ngn || 0, 'USD')}
                  </span>
                  {(variant.price_ngn || variant.price_ghs) && (
                    <span className="text-sm text-gray-500">
                      {variant.price_ngn && `₦${variant.price_ngn.toLocaleString()}`}
                      {variant.price_ngn && variant.price_ghs && ' / '}
                      {variant.price_ghs && `₵${variant.price_ghs.toLocaleString()}`}
                    </span>
                  )}
                </div>
                
                {/* Regional Pricing */}
                {(variant.price_ngn || variant.price_ghs) && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Regional Pricing:</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      {variant.price_ngn && (
                        <div className="flex justify-between">
                          <span>Nigeria:</span>
                          <span className="font-medium">₦{variant.price_ngn.toLocaleString()}</span>
                        </div>
                      )}
                      {variant.price_ghs && (
                        <div className="flex justify-between">
                          <span>Ghana:</span>
                          <span className="font-medium">₵{variant.price_ghs.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Stock:</span>
                <Badge
                  variant={variant.stock > 0 ? 'default' : 'destructive'}
                  className={variant.stock > 0 ? 'bg-green-500' : ''}
                >
                  {variant.stock > 0 ? `${variant.stock} available` : 'Out of Stock'}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating || '4.5'}</span>
                  <span className="ml-1 text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button - Fixed at bottom */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleAddToCart}
                disabled={variant.stock === 0 || isVariantInCart}
                size="lg"
                className={`w-full py-3 text-lg font-medium transition-all duration-300 ${
                  variant.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isVariantInCart
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isVariantInCart ? 'In Cart' : variant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

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
            {displayImages.length > 1 && (
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
                src={displayImages[currentImageIndex]?.image_url || ''}
                alt={displayImages[currentImageIndex]?.alt_text || 'Variant image'}
                width={1000}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} of {displayImages.length}
            </div>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
                {displayImages.map((image, index) => (
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
    </>
  );
}
