'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trash2, 
  Edit, 
  Star,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUppyWithSupabase } from '@/hooks/use-uppy-with-supabase';
import { getPublicUrlOfUploadedFile } from '@/lib/utils';
import Image from 'next/image';

interface VariantImageManagerProps {
  variantId: string;
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function VariantImageManager({
  variantId,
  productId,
  images = [],
  onImagesChange,
  maxImages = 6
}: VariantImageManagerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingImage, setEditingImage] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductImage>>({});

  // Initialize Uppy for image uploads
  const uppy = useUppyWithSupabase({ bucketName: 'file-bucket', folderName: 'variants' });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`);
      return;
    }

    try {
      // Upload files to Supabase storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uppy.addFile(file);
      }

      const response = await uppy.upload();
      
      if (response?.successful) {
        const newImages: ProductImage[] = response.successful.map((file, index) => {
          const imageUrl = getPublicUrlOfUploadedFile(file.meta.objectName as string);
          return {
            id: `temp-${Date.now()}-${index}`,
            product_id: productId,
            variant_id: variantId,
            image_url: imageUrl,
            alt_text: file.name,
            is_primary: images.length === 0 && index === 0, // First image becomes primary if no images exist
            sort_order: images.length + index,
            created_at: new Date(),
            updated_at: new Date()
          };
        });

        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  const handleDeleteImage = (imageIndex: number) => {
    const imageToDelete = images[imageIndex];
    if (imageToDelete.is_primary && images.length > 1) {
      toast.error('Cannot delete primary image. Set another image as primary first.');
      return;
    }

    const updatedImages = images.filter((_, index) => index !== imageIndex);
    
    // If we deleted the primary image and there are other images, make the first one primary
    if (imageToDelete.is_primary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true;
    }

    // Update sort order
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      sort_order: index
    }));

    onImagesChange(reorderedImages);
    toast.success('Image deleted successfully');
  };

  const handleSetPrimary = (imageIndex: number) => {
    const updatedImages = images.map((img, index) => ({
      ...img,
      is_primary: index === imageIndex
    }));
    onImagesChange(updatedImages);
    toast.success('Primary image updated');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    // Update sort_order for all images
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      sort_order: index
    }));
    
    onImagesChange(reorderedImages);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEditImage = (index: number) => {
    setEditingImage(index);
    setEditForm(images[index]);
  };

  const saveEditImage = () => {
    if (editingImage !== null) {
      const updatedImages = [...images];
      updatedImages[editingImage] = { ...updatedImages[editingImage], ...editForm };
      onImagesChange(updatedImages);
      setEditingImage(null);
      setEditForm({});
      toast.success('Image details updated');
    }
  };

  const sortedImages = [...images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold">Variant Images</h4>
          <p className="text-sm text-gray-600">
            Manage images for this variant. First image will be the primary display image.
          </p>
        </div>
        <Badge variant="secondary">
          {images.length}/{maxImages} images
        </Badge>
      </div>

      {/* Image Upload */}
      {images.length < maxImages && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="variant-images">Upload Images</Label>
                <Input
                  id="variant-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can upload up to {maxImages - images.length} more image(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Grid */}
      {sortedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <Card key={image.id} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || `Variant image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Image Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openLightbox(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(index)}
                        className="h-8 w-8 p-0"
                        disabled={image.is_primary && images.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-blue-500">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">
                      {image.alt_text || `Image ${index + 1}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{image.sort_order + 1}
                    </span>
                  </div>
                  
                  {!image.is_primary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetPrimary(index)}
                      className="w-full text-xs h-6"
                    >
                      Set as Primary
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Image Modal */}
      {editingImage !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Edit Image Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-alt-text">Alt Text</Label>
                <Input
                  id="image-alt-text"
                  value={editForm.alt_text || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Describe this image for accessibility"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveEditImage} size="sm">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingImage(null);
                    setEditForm({});
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
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
            {images.length > 1 && (
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
            <div className="relative max-w-4xl max-h-full p-8">
              <Image
                src={sortedImages[currentImageIndex]?.image_url || ''}
                alt={sortedImages[currentImageIndex]?.alt_text || 'Variant image'}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} of {images.length}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-blue-500 scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || `Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
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
