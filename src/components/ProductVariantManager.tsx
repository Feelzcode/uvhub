'use client';

import React, { useState } from 'react';
import { ProductVariant, ProductImage } from '@/store/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GripVertical,
  Star,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import VariantImageManager from './VariantImageManager';

interface ProductVariantManagerProps {
  variants: Partial<ProductVariant>[];
  onVariantsChange: (variants: Partial<ProductVariant>[]) => void;
  maxVariants?: number;
  categoryId?: string;
  onVariantUpdate?: (variantId: string, updates: Partial<ProductVariant>) => Promise<void>;
  onVariantCreate?: (variant: Partial<ProductVariant>) => Promise<void>;
  onVariantDelete?: (variantId: string) => Promise<void>;
  productId?: string; // Add productId prop for proper image handling
}

export default function ProductVariantManager({
  variants = [],
  onVariantsChange,
  maxVariants = 6,
  categoryId,
  onVariantUpdate,
  onVariantCreate,
  onVariantDelete,
  productId // Add productId prop
}: ProductVariantManagerProps) {
  const [editingVariant, setEditingVariant] = useState<number | null>(null);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    price_ngn: 0,
    price_ghs: 0,
    stock: 0,
    is_active: true,
    sort_order: variants.length,
    images: []
  });
  
  // Initialize Cloudinary for variant image uploads with progress tracking
  const { uploadFiles, uploadProgress } = useCloudinaryUpload({ 
    folder: 'variants',
    callbacks: {
      onStart: () => toast.info('Starting image upload...'),
      onSuccess: (files) => toast.success(`${files.length} image(s) uploaded successfully`),
      onError: (error) => toast.error(`Upload failed: ${error.message}`),
    }
  });

  const handleAddVariant = async () => {
    if (variants.length >= maxVariants) {
      toast.error(`Maximum ${maxVariants} variants allowed`);
      return;
    }

    if (!newVariant.name || newVariant.price === 0) {
      toast.error('Variant name and price are required');
      return;
    }

    // Create a draft variant (no ID yet - will be created when form is submitted)
    const variant: Partial<ProductVariant> = {
      name: newVariant.name!,
      description: newVariant.description || '',
      sku: newVariant.sku || '',
      price: newVariant.price || 0,
      price_ngn: newVariant.price_ngn || undefined,
      price_ghs: newVariant.price_ghs || undefined,
      stock: newVariant.stock || 0,
      is_active: newVariant.is_active || true,
      sort_order: newVariant.sort_order || variants.length,
      image_url: newVariant.image_url || '',
      images: newVariant.images || [],
      ...(categoryId && { category_id: categoryId }) // Include category_id if available
    };

    if (onVariantCreate) {
      // If we have a create handler, use it
      try {
        await onVariantCreate(variant);
        toast.success('Variant created successfully');
      } catch (error) {
        console.error('Error creating variant:', error);
        toast.error('Failed to create variant');
      }
    } else {
      // Fallback to local state management
      const updatedVariants = [...variants, variant];
      onVariantsChange(updatedVariants);
      toast.success('Variant added successfully');
    }

    // Reset form
    setNewVariant({
      name: '',
      description: '',
      sku: '',
      price: 0,
      price_ngn: 0,
      price_ghs: 0,
      stock: 0,
      is_active: true,
      sort_order: variants.length + 1,
      images: []
    });
  };

  const handleUpdateVariant = async (index: number, updates: Partial<ProductVariant>) => {
    const variant = variants[index];
    if (!variant) return;

    const updatedVariant = { ...variant, ...updates };

    if (onVariantUpdate && variant.id && !variant.id.startsWith('temp-')) {
      // If we have an update handler and this is an existing variant, use it
      try {
        await onVariantUpdate(variant.id, updates);
        toast.success('Variant updated successfully');
      } catch (error) {
        console.error('Error updating variant:', error);
        toast.error('Failed to update variant');
        return;
      }
    }

    // Update local state
    const updatedVariants = variants.map((v, i) => i === index ? updatedVariant : v);
    onVariantsChange(updatedVariants);
    setEditingVariant(null);
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = variants[index];
    if (!variant) return;

    if (onVariantDelete && variant.id && !variant.id.startsWith('temp-')) {
      // If we have a delete handler and this is an existing variant, use it
      try {
        await onVariantDelete(variant.id);
        // Remove from local state
        const updatedVariants = variants.filter((_, i) => i !== index);
        onVariantsChange(updatedVariants);
        toast.success('Variant deleted successfully');
      } catch (error) {
        console.error('Error deleting variant:', error);
        toast.error('Failed to delete variant');
      }
    } else {
      // Fallback to local state management
      const updatedVariants = variants.filter((_, i) => i !== index);
      onVariantsChange(updatedVariants);
    }
  };

  const handleToggleActive = (index: number) => {
    const variant = variants[index];
    if (variant) {
      handleUpdateVariant(index, { is_active: !variant.is_active });
    }
  };

  const handleReorderVariants = (fromIndex: number, toIndex: number) => {
    const updatedVariants = [...variants];
    const [movedVariant] = updatedVariants.splice(fromIndex, 1);
    updatedVariants.splice(toIndex, 0, movedVariant);
    
    // Update sort_order for all variants
    const reorderedVariants = updatedVariants.map((variant, index) => ({
      ...variant,
      sort_order: index
    }));
    
    onVariantsChange(reorderedVariants);
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      console.log(`🖼️ Uploading ${files.length} images for variant index: ${variantIndex}`);
      
      // Upload files to Cloudinary
      const response = await uploadFiles(Array.from(files));
      
      if (response && response.length > 0) {
        const newImages: ProductImage[] = response.map((file: { secure_url: string; public_id: string }, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          product_id: productId || '', // Use productId prop
          image_url: file.secure_url,
          alt_text: file.public_id.split('/').pop() || file.public_id,
          is_primary: index === 0,
          sort_order: index,
          created_at: new Date(),
          updated_at: new Date()
        }));

        console.log('🖼️ New images created:', newImages);

        if (variantIndex === -1) {
          // This is for the new variant form
          console.log('🆕 Adding images to new variant form');
          setNewVariant(prev => ({
            ...prev,
            images: [...(prev.images || []), ...newImages]
          }));
        } else {
          // This is for editing an existing variant
          console.log(`✏️ Adding images to existing variant at index: ${variantIndex}`);
          const updatedVariants = variants.map((variant, i) =>
            i === variantIndex
              ? { ...variant, images: [...(variant.images || []), ...newImages] }
              : variant
          );
          
          console.log('🔄 Calling onVariantsChange with updated variants:', updatedVariants);
          onVariantsChange(updatedVariants);
        }
      }
    } catch (error) {
      console.error('❌ Error handling image upload:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  const removeVariantImage = (imageIndex: number) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== imageIndex) || []
    }));
  };

  const handleEditVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      console.log(`🖼️ Uploading ${files.length} images for existing variant at index: ${variantIndex}`);
      
      // Upload files to Cloudinary
      const response = await uploadFiles(Array.from(files));
      
      if (response && response.length > 0) {
        const newImages: ProductImage[] = response.map((file: { secure_url: string; public_id: string }, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          product_id: variants[variantIndex].product_id || '',
          variant_id: variants[variantIndex].id,
          image_url: file.secure_url,
          alt_text: file.public_id.split('/').pop() || file.public_id,
          is_primary: index === 0,
          sort_order: index,
          created_at: new Date(),
          updated_at: new Date()
        }));

        console.log('🖼️ New images for existing variant:', newImages);

        // This is for editing an existing variant
        const updatedVariants = variants.map((variant, i) =>
          i === variantIndex
            ? { ...variant, images: [...(variant.images || []), ...newImages] }
            : variant
        );
        
        console.log('🔄 Calling onVariantsChange with updated existing variants:', updatedVariants);
        onVariantsChange(updatedVariants);
      }
    } catch (error) {
      console.error('❌ Error handling edit image upload:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  const removeEditVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = variants.map((variant, i) =>
      i === variantIndex
        ? { 
            ...variant, 
            images: variant.images?.filter((_, imgIndex) => imgIndex !== imageIndex) || [] 
          }
        : variant
    );
    
    onVariantsChange(updatedVariants);
  };

  const sortedVariants = [...variants].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-gray-600">
            Manage different versions of this product with individual pricing and stock
          </p>
        </div>
        <Badge variant="secondary">
          {variants.length}/{maxVariants} variants
        </Badge>
      </div>
      
      {/* Add New Variant Form */}
      {variants.length < maxVariants && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Variant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Variant Name *</Label>
                <Input
                  id="variant-name"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Small, Red, Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-sku">SKU</Label>
                <Input
                  id="variant-sku"
                  value={newVariant.sku}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="Stock Keeping Unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-price">Fallback Price *</Label>
                <Input
                  id="variant-price"
                  type="number"
                  step="0.01"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-stock">Stock</Label>
                <Input
                  id="variant-stock"
                  type="number"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-price-ngn">Nigerian Price (₦)</Label>
                <Input
                  id="variant-price-ngn"
                  type="number"
                  step="0.01"
                  value={newVariant.price_ngn}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price_ngn: parseFloat(e.target.value) || 0 }))}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-price-ghs">Ghanaian Price (₵)</Label>
                <Input
                  id="variant-price-ghs"
                  type="number"
                  step="0.01"
                  value={newVariant.price_ghs}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price_ghs: parseFloat(e.target.value) || 0 }))}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="variant-description">Description</Label>
              <Textarea
                id="variant-description"
                value={newVariant.description}
                onChange={(e) => setNewVariant(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this variant"
                rows={2}
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label>Variant Images</Label>
              <p className="text-xs text-muted-foreground">
                Upload images for this variant. You can add multiple images.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleVariantImageUpload(e, -1)}
                  className="hidden"
                  id="new-variant-images"
                  disabled={uploadProgress.isUploading}
                />
                <label 
                  htmlFor="new-variant-images"
                  className={`cursor-pointer text-blue-600 hover:text-blue-800 ${
                    uploadProgress.isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadProgress.isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    'Click to upload images'
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Drag and drop images here or click to browse
                </p>
                
                {/* Upload Progress Indicator */}
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
              </div>
              {/* Display uploaded images */}
              {newVariant.images && newVariant.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {newVariant.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-20">
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || `Variant image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <button
                        onClick={() => removeVariantImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="variant-active"
                checked={newVariant.is_active}
                onCheckedChange={(checked) => setNewVariant(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="variant-active">Active (available for purchase)</Label>
            </div>
            <Button type="button" onClick={handleAddVariant} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Existing Variants */}
      <div className="space-y-3">
        <h4 className="font-medium">Existing Variants ({sortedVariants.length})</h4>
        
        {sortedVariants.length > 0 ? (
          sortedVariants.map((variant, index) => (
            <Card key={variant.id || index}>
              <CardContent className="p-4">
                {editingVariant === index ? (
                  <VariantEditForm
                    variant={variant}
                    variantIndex={index}
                    onSave={(updates) => handleUpdateVariant(index, updates)}
                    onCancel={() => setEditingVariant(null)}
                    onImageUpload={handleEditVariantImageUpload}
                    onImageRemove={removeEditVariantImage}
                  />
                ) : (
                  <VariantDisplay
                    variant={variant}
                    index={index}
                    onEdit={() => setEditingVariant(index)}
                    onDelete={() => handleDeleteVariant(index)}
                    onToggleActive={() => handleToggleActive(index)}
                    onReorder={handleReorderVariants}
                  />
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p>No variants have been created yet.</p>
            <p className="text-sm mt-2">Use the form above to add your first variant.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Variant Display Component
function VariantDisplay({
  variant,
  index,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder
}: {
  variant: Partial<ProductVariant>;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onReorder(index, Math.max(0, index - 1))}
          disabled={index === 0}
        >
          <GripVertical className="w-4 h-4" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="font-medium">{variant.name}</h5>
            {!variant.is_active && (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {variant.stock && variant.stock <= 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <span>SKU: {variant.sku || 'N/A'}</span>
            <span className="mx-2">•</span>
            <span>Stock: {variant.stock}</span>
            <span className="mx-2">•</span>
            <span>Price: ${variant.price}</span>
            {variant.price_ngn && <span className="ml-2">₦{variant.price_ngn}</span>}
            {variant.price_ghs && <span className="ml-2">₵{variant.price_ghs}</span>}
          </div>
          {variant.description && (
            <p className="text-sm text-gray-500 mt-1">{variant.description}</p>
          )}
          {/* Display variant images */}
          {variant.images && variant.images.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Images: {variant.images.length}</span>
                {variant.images.some(img => img.is_primary) && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Primary Set
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {variant.images.slice(0, 4).map((image, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <div className="relative w-full h-16 overflow-hidden rounded border">
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || `Variant image ${imgIndex + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {image.is_primary && (
                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">
                          Primary
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {variant.images.length > 4 && (
                  <div className="relative w-full h-16 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs text-gray-500">+{variant.images.length - 4} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onToggleActive}>
          <Star className={`w-4 h-4 ${variant.is_active ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Variant Edit Form Component
function VariantEditForm({
  variant,
  variantIndex,
  onSave,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onImageUpload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onImageRemove,
}: {
  variant: Partial<ProductVariant>;
  variantIndex: number;
  onSave: (updates: Partial<ProductVariant>) => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => void;
  onImageRemove: (variantIndex: number, imageIndex: number) => void;
}) {
  const [formData, setFormData] = useState({
    name: variant.name,
    description: variant.description || '',
    sku: variant.sku || '',
    price: variant.price,
    price_ngn: variant.price_ngn || 0,
    price_ghs: variant.price_ghs || 0,
    stock: variant.stock,
    is_active: variant.is_active
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-variant-name">Variant Name</Label>
          <Input
            id="edit-variant-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-variant-sku">SKU</Label>
          <Input
            id="edit-variant-sku"
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-variant-price">Fallback Price</Label>
          <Input
            id="edit-variant-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-variant-stock">Stock</Label>
          <Input
            id="edit-variant-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-variant-price-ngn">Nigerian Price (₦)</Label>
          <Input
            id="edit-variant-price-ngn"
            type="number"
            step="0.01"
            value={formData.price_ngn}
            onChange={(e) => setFormData(prev => ({ ...prev, price_ngn: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-variant-price-ghs">Ghanaian Price (₵)</Label>
          <Input
            id="edit-variant-price-ghs"
            type="number"
            step="0.01"
            value={formData.price_ghs}
            onChange={(e) => setFormData(prev => ({ ...prev, price_ghs: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-variant-description">Description</Label>
        <Textarea
          id="edit-variant-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-variant-active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
        />
        <Label htmlFor="edit-variant-active">Active</Label>
      </div>
      
      {/* Image Management */}
      <VariantImageManager
        variantId={variant.id || `temp-${variantIndex}`}
        productId={variant.product_id || ''}
        images={variant.images || []}
        onImagesChange={(newImages) => {
          const updatedVariant = { ...variant, images: newImages };
          onSave(updatedVariant);
        }}
        maxImages={6}
      />
      
      <div className="flex gap-2">
        <Button type="button" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}


