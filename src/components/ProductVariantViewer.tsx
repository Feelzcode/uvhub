'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductVariant, Product } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Plus,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductVariantViewerProps {
  product: Product;
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  onVariantUpdate?: (variantId: string, updates: Partial<ProductVariant>) => Promise<void>;
  onVariantCreate?: (variant: Partial<ProductVariant>) => Promise<void>;
  onVariantDelete?: (variantId: string) => Promise<void>;
  className?: string;
}

export default function ProductVariantViewer({
  product,
  variants,
  onVariantsChange,
  onVariantUpdate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onVariantCreate,
  onVariantDelete,
  className = ''
}: ProductVariantViewerProps) {
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<ProductVariant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant({ ...variant });
  };

  const handleSaveVariant = async () => {
    if (!editingVariant) return;

    setIsSubmitting(true);
    try {
      if (onVariantUpdate) {
        await onVariantUpdate(editingVariant.id, editingVariant);
      }
      
      // Update local state
      const updatedVariants = variants.map(v => 
        v.id === editingVariant.id ? editingVariant : v
      );
      onVariantsChange(updatedVariants);
      
      setEditingVariant(null);
      toast.success('Variant updated successfully');
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
  };

  const handleDeleteVariant = async () => {
    if (!variantToDelete || !onVariantDelete) return;

    try {
      await onVariantDelete(variantToDelete.id);
      const updatedVariants = variants.filter(v => v.id !== variantToDelete.id);
      onVariantsChange(updatedVariants);
      toast.success('Variant deleted successfully');
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    } finally {
      setIsDeleteDialogOpen(false);
      setVariantToDelete(null);
    }
  };

  const openDeleteDialog = (variant: ProductVariant) => {
    setVariantToDelete(variant);
    setIsDeleteDialogOpen(true);
  };

  const getVariantPrice = (variant: ProductVariant) => {
    if (variant.price_ngn) return `₦${variant.price_ngn.toFixed(2)}`;
    if (variant.price_ghs) return `₵${variant.price_ghs.toFixed(2)}`;
    if (variant.price) return `$${variant.price.toFixed(2)}`;
    return 'No price set';
  };

  const getVariantStatus = (variant: ProductVariant) => {
    if (!variant.is_active) return { label: 'Inactive', variant: 'destructive' as const };
    if (variant.stock <= 0) return { label: 'Out of Stock', variant: 'secondary' as const };
    if (variant.stock < 10) return { label: 'Low Stock', variant: 'outline' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Manage variants for {product.name}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => (
          <Card key={variant.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{variant.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getVariantStatus(variant).variant}>
                      {getVariantStatus(variant).label}
                    </Badge>
                    {variant.sku && (
                      <Badge variant="outline" className="text-xs">
                        {variant.sku}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditVariant(variant)}
                    disabled={!!editingVariant}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(variant)}
                    disabled={!!editingVariant}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Variant Image */}
              {variant.image_url && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={variant.image_url}
                    alt={variant.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                  {variant.images && variant.images.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 text-xs"
                    >
                      {variant.images.length} images
                    </Badge>
                  )}
                </div>
              )}

              {/* Variant Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-sm">{getVariantPrice(variant)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stock:</span>
                  <span className="text-sm">{variant.stock}</span>
                </div>
                {variant.description && (
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {variant.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit Form Overlay */}
              {editingVariant && editingVariant.id === variant.id && (
                <div className="absolute inset-0 bg-white rounded-lg border-2 border-blue-200 p-4 z-10">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`name-${variant.id}`}>Name</Label>
                      <Input
                        id={`name-${variant.id}`}
                        value={editingVariant.name}
                        onChange={(e) => setEditingVariant(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`sku-${variant.id}`}>SKU</Label>
                      <Input
                        id={`sku-${variant.id}`}
                        value={editingVariant.sku || ''}
                        onChange={(e) => setEditingVariant(prev => 
                          prev ? { ...prev, sku: e.target.value } : null
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`price-ngn-${variant.id}`}>Price (₦)</Label>
                        <Input
                          id={`price-ngn-${variant.id}`}
                          type="number"
                          step="0.01"
                          value={editingVariant.price_ngn || ''}
                          onChange={(e) => setEditingVariant(prev => 
                            prev ? { ...prev, price_ngn: parseFloat(e.target.value) || 0 } : null
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-ghs-${variant.id}`}>Price (₵)</Label>
                        <Input
                          id={`price-ghs-${variant.id}`}
                          type="number"
                          step="0.01"
                          value={editingVariant.price_ghs || ''}
                          onChange={(e) => setEditingVariant(prev => 
                            prev ? { ...prev, price_ghs: parseFloat(e.target.value) || 0 } : null
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                      <Input
                        id={`stock-${variant.id}`}
                        type="number"
                        value={editingVariant.stock}
                        onChange={(e) => setEditingVariant(prev => 
                          prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${variant.id}`}>Description</Label>
                      <Textarea
                        id={`description-${variant.id}`}
                        value={editingVariant.description || ''}
                        onChange={(e) => setEditingVariant(prev => 
                          prev ? { ...prev, description: e.target.value } : null
                        )}
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`active-${variant.id}`}
                        checked={editingVariant.is_active}
                        onCheckedChange={(checked) => setEditingVariant(prev => 
                          prev ? { ...prev, is_active: checked as boolean } : null
                        )}
                      />
                      <Label htmlFor={`active-${variant.id}`}>Active</Label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveVariant}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {variants.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first variant to get started
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Variant
          </Button>
        </div>
      )}

      {/* Create Variant Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Variant</DialogTitle>
            <DialogDescription>
              Add a new variant to {product.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <CreateVariantForm
              productId={product.id}
              productName={product.name}
              categoryId={product.category}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={(newVariant) => {
                onVariantsChange([...variants, newVariant]);
                setIsCreateModalOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{variantToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Create Variant Form Component
interface CreateVariantFormProps {
  productId: string;
  productName: string;
  categoryId: string;
  onClose: () => void;
  onSuccess: (variant: ProductVariant) => void;
}

function CreateVariantForm({ 
  productId, 
  productName, 
  categoryId, 
  onClose, 
  onSuccess 
}: CreateVariantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price_ngn: 0,
    price_ghs: 0,
    stock: 0,
    description: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  
  // Initialize Cloudinary for image uploads
  const { uploadFiles, uploadProgress } = useCloudinaryUpload({ 
    folder: 'variants',
    callbacks: {
      onStart: () => toast.info('Starting image upload...'),
      onSuccess: (files) => {
        const urls = files.map((file: { secure_url: string }) => file.secure_url).filter(Boolean);
        setUploadedImageUrls(urls);
        toast.success(`${urls.length} image(s) uploaded successfully`);
      },
      onError: (error) => toast.error(`Upload failed: ${error.message}`),
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!productId) {
      console.error('❌ Product ID is missing in form submission');
      toast.error('Product ID is required to create a variant');
      return;
    }
    
    if (!categoryId) {
      console.error('❌ Category ID is missing in form submission');
      toast.error('Category ID is required to create a variant');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create the variant
      const variant = await createProductVariant({
        product_id: productId,
        category_id: categoryId,
        name: formData.name,
        sku: formData.sku || `${productName}-${formData.name}`.toLowerCase().replace(/\s+/g, '-'),
        price: 0,
        price_ngn: formData.price_ngn || undefined,
        price_ghs: formData.price_ghs || undefined,
        stock: formData.stock,
        description: formData.description || formData.name,
        is_active: formData.is_active,
        sort_order: 0
      });

      if (variant) {
        // Handle image uploads
        if (uploadedImageUrls.length > 0) {
          try {
            for (const imageUrl of uploadedImageUrls) {
              const imageData = {
                variant_id: variant.id,
                product_id: productId,
                image_url: imageUrl,
                alt_text: `${formData.name} variant image`,
                is_primary: uploadedImageUrls.indexOf(imageUrl) === 0,
                sort_order: uploadedImageUrls.indexOf(imageUrl)
              };
              console.log('🔍 About to call createVariantImage with:', imageData);
              console.log('🔍 Product ID being passed:', imageData.product_id);
              console.log('🔍 Variant ID being passed:', imageData.variant_id);
              
              await createVariantImage(imageData);
            }
            toast.success(`${uploadedImageUrls.length} image(s) linked to variant successfully!`);
          } catch (imageError) {
            console.error('Error linking images to variant:', imageError);
            toast.warning('Variant created but there was an issue linking images');
          }
        }
        
        toast.success(`Variant "${formData.name}" created successfully!`);
        onSuccess(variant);
      } else {
        throw new Error('Failed to create variant');
      }
    } catch (error) {
      console.error('Error creating variant:', error);
      toast.error('Failed to create variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {/* Product Name (Read-only) */}
      <div className="space-y-2">
        <Label>Product Name</Label>
        <Input value={productName} disabled className="bg-gray-50" />
        <p className="text-xs text-muted-foreground">This variant will be added to this product</p>
      </div>

      {/* Variant Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="variant-name">Variant Name *</Label>
          <Input
            id="variant-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Small, Red, Premium"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variant-sku">SKU</Label>
          <Input
            id="variant-sku"
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            placeholder="Auto-generated if empty"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="variant-price-ngn">Nigeria Price (₦)</Label>
          <Input
            id="variant-price-ngn"
            type="number"
            step="0.01"
            value={formData.price_ngn}
            onChange={(e) => setFormData(prev => ({ ...prev, price_ngn: parseFloat(e.target.value) || 0 }))}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variant-price-ghs">Ghana Price (₵)</Label>
          <Input
            id="variant-price-ghs"
            type="number"
            step="0.01"
            value={formData.price_ghs}
            onChange={(e) => setFormData(prev => ({ ...prev, price_ghs: parseFloat(e.target.value) || 0 }))}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Stock and Description */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="variant-stock">Stock *</Label>
          <Input
            id="variant-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variant-active">Active</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="variant-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="variant-active" className="text-sm">Available for purchase</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="variant-description">Description</Label>
        <Textarea
          id="variant-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description for this variant"
          rows={3}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Variant Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                
                try {
                  toast.info(`Uploading ${files.length} image(s)...`);
                  await uploadFiles(files);
                  
                } catch (error) {
                  console.error('Error uploading files:', error);
                  toast.error('Failed to upload images. Please try again.');
                }
              }
            }}
            className="hidden"
            id="variant-images"
            disabled={uploadProgress.isUploading}
          />
          <label 
            htmlFor="variant-images"
            className={`cursor-pointer text-center space-y-2 ${
              uploadProgress.isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              {uploadProgress.isUploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB each
            </p>
          </label>
        </div>
        
        {/* Upload Progress */}
        {uploadProgress.isUploading && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2 text-blue-600">
              Uploading Images...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {uploadProgress.progress}% complete
            </p>
          </div>
        )}
        
        {/* Uploaded Images Preview */}
        {uploadedImageUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Uploaded Images ({uploadedImageUrls.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {uploadedImageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <Image 
                    src={url} 
                    alt={`Variant image ${index + 1}`}
                    width={100}
                    height={80}
                    className="w-full h-20 object-cover rounded border"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadProgress.isUploading}>
          {isSubmitting ? 'Creating...' : 'Create Variant'}
        </Button>
      </div>
    </form>
  );
}

// Import the necessary functions from actions
import { 
  createProductVariant, 
  createVariantImage 
} from '@/app/admin/dashboard/products/actions';
