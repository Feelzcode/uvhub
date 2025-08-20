'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductVariant, Product } from '@/store/types';
import { useCurrencyStore } from '@/store';
import { useCartStore } from '@/store';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ShoppingCart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductImageGallery from '@/components/ProductImageGallery';
import { getCategoryName, getSubcategoryName, getProductName, getProductDescription, getVariantName, safeRender } from '@/utils/safeRender';

interface ProductVariantLightboxProps {
  product: Product;
  variants: ProductVariant[];
  className?: string;
  isLoading?: boolean;
}

export default function ProductVariantLightbox({ 
  product, 
  variants, 
  className = '',
  isLoading = false
}: ProductVariantLightboxProps) {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  
  const { formatPrice, currentCurrency } = useCurrencyStore();
  const { addToCart } = useCartStore();

  const currentVariant = variants[currentVariantIndex];
  
  // Safety check to ensure currentVariant exists
  if (!currentVariant) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <p className="text-gray-500">No variant data available.</p>
        </div>
      </div>
    );
  }
  
  // Debug logging to help identify object rendering issues
  console.log('ProductVariantLightbox render:', {
    product: product?.name,
    variantsCount: variants?.length,
    currentVariantIndex,
    currentVariant: currentVariant?.name,
    category: product?.category,
    subcategory: product?.subcategory
  });

  // Auto-sliding functionality with progress bar
  useEffect(() => {
    if (!isAutoPlaying || variants.length <= 1) return;

    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        setCurrentVariantIndex((prev) => (prev + 1) % variants.length);
        setProgress(0);
      }
    }, 50); // Update progress every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isAutoPlaying, variants.length, currentVariantIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousVariant();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextVariant();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle variant change with smooth transition
  const changeVariant = useCallback((newIndex: number) => {
    if (newIndex === currentVariantIndex || isTransitioning) return;
    
    pauseOnInteraction();
    setIsTransitioning(true);
    setCurrentVariantIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentVariantIndex, isTransitioning]);

  const nextVariant = () => {
    changeVariant((currentVariantIndex + 1) % variants.length);
  };

  const previousVariant = () => {
    changeVariant((currentVariantIndex - 1 + variants.length) % variants.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleAddToCart = () => {
    if (currentVariant && currentVariant.stock > 0) {
      addToCart(product);
    }
  };

  // Pause auto-play when user interacts
  const pauseOnInteraction = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      // Resume auto-play after 10 seconds of inactivity
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }
  }, [isAutoPlaying]);

  // Touch/swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextVariant();
    } else if (isRightSwipe) {
      previousVariant();
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center">
            <div className="animate-pulse w-80 h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!variants || variants.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <p className="text-gray-500">No variants available for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}
      role="region"
      aria-label="Product Variants Lightbox"
    >
      {/* Main Lightbox Container */}
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Panel - Product Details */}
        <div className="lg:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center">
          <div className="space-y-6">
                         {/* Product Header */}
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-gray-900">
                   {getProductName(product)}
                 </h1>
                 {variants.length > 1 && (
                   <Badge variant="secondary" className="text-sm">
                     {currentVariantIndex + 1} of {variants.length}
                   </Badge>
                 )}
               </div>
               {product.description && (
                 <p className="text-gray-600 leading-relaxed text-lg">{getProductDescription(product)}</p>
               )}
             </div>

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

            {/* Variant Navigation Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Variants</span>
                <div className="flex items-center gap-2">
                  {variants.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAutoPlay}
                      className={`text-gray-600 hover:text-gray-900 auto-play-button ${
                        isAutoPlaying ? 'playing' : ''
                      }`}
                      aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
                    >
                      {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {/* Variant Indicators */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  {variants.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeVariant(index)}
                      className={`w-3 h-3 rounded-full variant-indicator ${
                        index === currentVariantIndex
                          ? 'bg-blue-600 active'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to variant ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Progress Bar */}
                {isAutoPlaying && variants.length > 1 && (
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              
                             {/* Quick Variant Comparison */}
               {variants.length > 1 && (
                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                   <p className="text-sm font-medium text-gray-700 mb-2">Quick Comparison:</p>
                   <div className="grid grid-cols-2 gap-2 text-xs">
                     {variants.slice(0, 4).map((variant, index) => (
                       <div 
                         key={variant.id || index}
                         className={`p-2 rounded cursor-pointer transition-colors ${
                           index === currentVariantIndex 
                             ? 'bg-blue-100 border border-blue-300' 
                             : 'bg-white hover:bg-gray-100'
                         }`}
                         onClick={() => changeVariant(index)}
                       >
                         <div className="font-medium text-gray-900 truncate">
                           {variant.name || `Variant ${index + 1}`}
                         </div>
                         <div className="text-gray-600">
                           {formatPrice(variant.price || variant.price_ngn || 0, currentCurrency)}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Panel - Variant Display */}
        <div className="lg:w-1/2 bg-gray-100 flex flex-col">
          {/* Variant Image Section */}
          <div 
            className="flex-1 flex items-center justify-center p-8 relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
                         {currentVariant.images && currentVariant.images.length > 0 ? (
               <ProductImageGallery 
                 images={currentVariant.images} 
                 productName={`${getProductName(product)} - ${getVariantName(currentVariant, currentVariantIndex)}`}
                 className="w-full"
               />
                         ) : currentVariant.image_url ? (
               <div className="relative w-full h-80">
                 <Image
                   src={currentVariant.image_url}
                   alt={`${getProductName(product)} - ${getVariantName(currentVariant, currentVariantIndex)}`}
                   fill
                   className="object-contain rounded-xl shadow-md"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                 />
               </div>
             ) : (
               <div className="relative w-full h-80">
                 <Image
                   src={product.image}
                   alt={`${getProductName(product)} - ${getVariantName(currentVariant, currentVariantIndex)}`}
                   fill
                   className="object-contain rounded-xl shadow-md"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                 />
               </div>
             )}

            {/* Navigation Arrows */}
            {variants.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousVariant}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg nav-button"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextVariant}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 shadow-lg nav-button"
                  disabled={isTransitioning}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                {/* Swipe Hint for Mobile */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium opacity-75">
                  Swipe to navigate
                </div>
                
                {/* Auto-play Status */}
                {!isAutoPlaying && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Auto-play paused
                  </div>
                )}
              </>
            )}
          </div>

          {/* Variant Details Section */}
          <div className="p-8 bg-white border-t border-gray-200">
            <div className="space-y-4">
                             {/* Variant Name and Description */}
               <div>
                 <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                   {getVariantName(currentVariant, currentVariantIndex)}
                 </h3>
                 {currentVariant.description && (
                   <p className="text-gray-600 text-base">{safeRender(currentVariant.description)}</p>
                 )}
               </div>

              {/* Variant Properties */}
              <div className="space-y-3">
                                 {currentVariant.sku && (
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-gray-500">SKU:</span>
                     <span className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                       {safeRender(currentVariant.sku)}
                     </span>
                   </div>
                 )}

                {/* Price and Stock */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {formatPrice(currentVariant.price || currentVariant.price_ngn || 0, currentCurrency)}
                      </span>
                      {(currentVariant.price_ngn || currentVariant.price_ghs) && (
                        <span className="text-sm text-gray-500">
                          {currentVariant.price_ngn && `₦${currentVariant.price_ngn}`}
                          {currentVariant.price_ngn && currentVariant.price_ghs && ' / '}
                          {currentVariant.price_ghs && `₵${currentVariant.price_ghs}`}
                        </span>
                      )}
                    </div>
                    
                    <Badge 
                      variant={currentVariant.stock > 0 ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  
                  {/* Additional Pricing Info */}
                  {(currentVariant.price_ngn || currentVariant.price_ghs) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Regional Pricing:</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        {currentVariant.price_ngn && (
                          <div className="flex justify-between">
                            <span>Nigeria:</span>
                            <span className="font-medium">₦{currentVariant.price_ngn}</span>
                          </div>
                        )}
                        {currentVariant.price_ghs && (
                          <div className="flex justify-between">
                            <span>Ghana:</span>
                            <span className="font-medium">₵{currentVariant.price_ghs}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                                     {/* Variant Type/Description */}
                   {currentVariant.type && (
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                       <p className="text-sm font-medium text-blue-700 mb-1">Variant Type:</p>
                       <p className="text-sm text-blue-600">{safeRender(currentVariant.type)}</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={currentVariant.stock === 0}
                size="lg"
                className={`w-full py-4 text-lg font-medium transition-all duration-300 ${
                  currentVariant.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {currentVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      {variants.length > 1 && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
               <span className="text-sm text-gray-600">
                 Variant {currentVariantIndex + 1} of {variants.length}
               </span>
               <span className="text-sm font-medium text-gray-900">
                 {getVariantName(currentVariant, currentVariantIndex)}
               </span>
             </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousVariant}
                disabled={isTransitioning}
                aria-label="Go to previous variant"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextVariant}
                disabled={isTransitioning}
                aria-label="Go to next variant"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
