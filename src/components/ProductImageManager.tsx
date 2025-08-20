'use client';

import React from 'react';
import { ProductImage } from '@/store/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trash2, 
  Star,
  Upload,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { UploadProgressInline } from '@/components/ui/upload-progress';

interface ProductImageManagerProps {
    images: ProductImage[];
    onImagesChange: (images: ProductImage[]) => void;
    productId?: string;
    maxImages?: number 
}

export default function ProductImageManager({
    images = [],
    onImagesChange,
    productId,
    maxImages = 6 
}: ProductImageManagerProps) {
    // Initialize Cloudinary for image uploads with progress tracking
    const { uploadFiles, uploadProgress } = useCloudinaryUpload({ 
        folder: 'products',
        callbacks: {
            onStart: () => toast.info('Starting image upload...'),
            onSuccess: (files) => toast.success(`${files.length} image(s) uploaded successfully`),
            onError: (error) => toast.error(`Upload failed: ${error.message}`),
        }
    });

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        if (images.length + files.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images. You currently have ${images.length} images.`);
            return;
        }

        try {
            const newImages: ProductImage[] = [];
            
            const response = await uploadFiles(Array.from(files));
            
            if (response && response.length > 0) {
                response.forEach((file, index) => {
                    const newImage: ProductImage = {
                        id: `temp-${Date.now()}-${index}`,
                        product_id: productId || 'temp',
                        image_url: file.secure_url,
                        alt_text: file.public_id.split('/').pop() || file.public_id,
                        is_primary: images.length === 0 && index === 0, // First image becomes primary if no images exist
                        sort_order: images.length + index,
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    newImages.push(newImage);
                });

                const updatedImages = [...images, ...newImages];
                onImagesChange(updatedImages);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images. Please try again.');
        }
    };

    const removeImage = (imageId: string) => {
        const updatedImages = images.filter(img => img.id !== imageId);
        
        // If we're removing the primary image, make the first remaining image primary
        const removedImage = images.find(img => img.id === imageId);
        if (removedImage?.is_primary && updatedImages.length > 0) {
            updatedImages[0].is_primary = true;
        }
        
        onImagesChange(updatedImages);
    };

    const setPrimaryImage = (imageId: string) => {
        const updatedImages = images.map(img => ({
            ...img,
            is_primary: img.id === imageId
        }));
        onImagesChange(updatedImages);
    };

    const reorderImages = (fromIndex: number, toIndex: number) => {
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        
        // Update sort_order
        updatedImages.forEach((img, index) => {
            img.sort_order = index;
        });
        
        onImagesChange(updatedImages);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (dragIndex !== dropIndex) {
            reorderImages(dragIndex, dropIndex);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Product Images ({images.length}/{maxImages})</Label>
                {images.length > 0 && (
                    <Badge variant="secondary">
                        {images.filter(img => img.is_primary).length > 0 ? 'Primary set' : 'No primary'}
                    </Badge>
                )}
            </div>

            {/* Upload Area */}
            {images.length < maxImages && (
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                    <CardContent className="p-6">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            className="hidden"
                            id="product-images"
                            disabled={uploadProgress.isUploading}
                        />
                        <label 
                            htmlFor="product-images"
                            className={`cursor-pointer text-center space-y-2 ${
                                uploadProgress.isUploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">
                                {uploadProgress.isUploading ? 'Uploading...' : 'Click to upload images'}
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB each
                            </p>
                        </label>
                        
                        {/* Upload Progress Indicator */}
                        <UploadProgressInline progress={uploadProgress} />
                        
                        {/* Upload Status */}
                        {uploadProgress.isUploading && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>
                                        {uploadProgress.currentFile ? `Uploading ${uploadProgress.currentFile}...` : 'Uploading...'}
                                    </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    {uploadProgress.uploadedFiles}/{uploadProgress.totalFiles} files uploaded
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <Card 
                            key={image.id}
                            className={`relative group cursor-move ${
                                image.is_primary ? 'ring-2 ring-blue-500' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <CardContent className="p-2">
                                <div className="relative aspect-square">
                                    <Image
                                        src={image.image_url}
                                        alt={image.alt_text || `Product image ${index + 1}`}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                    
                                    {/* Overlay with actions */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setPrimaryImage(image.id)}
                                                    disabled={image.is_primary}
                                                    className="bg-white/90 hover:bg-white"
                                                >
                                                    <Star className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removeImage(image.id)}
                                                    className="bg-red-500/90 hover:bg-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Drag handle */}
                                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <GripVertical className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                                    </div>

                                    {/* Primary badge */}
                                    {image.is_primary && (
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="default" className="bg-blue-500">
                                                <Star className="h-3 w-3 mr-1" />
                                                Primary
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Image number */}
                                    <div className="absolute bottom-2 left-2">
                                        <Badge variant="secondary" className="bg-black/70 text-white">
                                            {index + 1}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Instructions */}
            <div className="text-sm text-gray-600 space-y-1">
                <p>• Drag images to reorder them</p>
                <p>• Click the star icon to set an image as primary</p>
                <p>• The first image will be used as the main product image</p>
                <p>• Maximum {maxImages} images allowed per product</p>
            </div>
        </div>
    );
}
