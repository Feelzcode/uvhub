'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProductImage } from '@/store/types';

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName: string;
    className?: string;
}

export default function ProductImageGallery({ images, productName, className = '' }: ProductImageGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
                <div className="text-gray-500 text-center p-8">
                    <p>No images available</p>
                </div>
            </div>
        );
    }

    const primaryImage = images.find(img => img.is_primary) || images[0];
    const sortedImages = images.sort((a, b) => a.sort_order - b.sort_order);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Image */}
            <div className="relative group">
                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                        src={sortedImages[currentImageIndex].image_url}
                        alt={sortedImages[currentImageIndex].alt_text || `${productName} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        onClick={openModal}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>
                
                {/* Navigation Arrows */}
                {sortedImages.length > 1 && (
                    <>
                        <button
                            onClick={previousImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {sortedImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {sortedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {sortedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                index === currentImageIndex
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <Image
                                src={image.image_url}
                                alt={image.alt_text || `${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Full Screen Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                            aria-label="Close modal"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={sortedImages[currentImageIndex].image_url}
                                alt={sortedImages[currentImageIndex].alt_text || `${productName} - Image ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>

                        {/* Navigation Arrows */}
                        {sortedImages.length > 1 && (
                            <>
                                <button
                                    onClick={previousImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {sortedImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-lg">
                                {currentImageIndex + 1} / {sortedImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
