'use client';

import React, { useState } from 'react';
import { ProductVariant, ProductImage } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  GripVertical,
  Star 
} from 'lucide-react';

interface ProductVariantManagerProps {
  variants: Partial<ProductVariant>[];
  onVariantsChange: (variants: Partial<ProductVariant>[]) => void;
  maxVariants?: number;
}

export default function ProductVariantManager({
  variants = [],
  onVariantsChange,
  maxVariants = 6
}: ProductVariantManagerProps) {
  const [editingVariant, setEditingVariant] = useState<number | null>(null);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    price_ngn: 0,
    price_ghs: 0,
    currency: 'USD',
    stock: 0,
    is_active: true,
    sort_order: variants.length,
    images: []
  });

  const handleAddVariant = () => {
    if (variants.length >= maxVariants) {
      alert(`Maximum ${maxVariants} variants allowed`);
      return;
    }

    if (!newVariant.name || newVariant.price === 0) {
      alert('Variant name and price are required');
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
      currency: newVariant.currency || 'USD',
      stock: newVariant.stock || 0,
      is_active: newVariant.is_active || true,
      sort_order: newVariant.sort_order || variants.length,
      image_url: newVariant.image_url || '',
      images: newVariant.images || []
    };

    onVariantsChange([...variants, variant]);
    setNewVariant({
      name: '',
      description: '',
      sku: '',
      price: 0,
      price_ngn: 0,
      price_ghs: 0,
      currency: 'USD',
      stock: 0,
      is_active: true,
      sort_order: variants.length + 1,
      images: []
    });
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const updatedVariants = variants.map((variant, i) =>
      i === index ? { ...variant, ...updates } : variant
    );
    onVariantsChange(updatedVariants);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(updatedVariants);
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
      // For now, we'll create temporary image objects
      // In a real implementation, you'd upload these to your storage service
      const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        product_id: '',
        image_url: URL.createObjectURL(file),
        alt_text: file.name,
        is_primary: index === 0,
        sort_order: index,
        created_at: new Date(),
        updated_at: new Date()
      }));

      if (variantIndex === -1) {
        // This is for the new variant form
        setNewVariant(prev => ({
          ...prev,
          images: [...(prev.images || []), ...newImages]
        }));
      } else {
        // This is for editing an existing variant
        const updatedVariants = variants.map((variant, i) =>
          i === variantIndex
            ? { ...variant, images: [...(variant.images || []), ...newImages] }
            : variant
        );
        
        onVariantsChange(updatedVariants);
      }

    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Failed to upload images. Please try again.');
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
      // For now, we'll create temporary image objects
      // In a real implementation, you'd upload these to your storage service
      const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        product_id: '',
        image_url: URL.createObjectURL(file),
        alt_text: file.name,
        is_primary: false,
        sort_order: 0,
        created_at: new Date(),
        updated_at: new Date()
      }));

      // Update the variant with the new images
      const updatedVariants = variants.map((variant, i) =>
        i === variantIndex
          ? { ...variant, images: [...(variant.images || []), ...newImages] }
          : variant
      );
      
      onVariantsChange(updatedVariants);

    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Failed to upload images. Please try again.');
    }
  };

  const removeEditVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = variants.map((variant, i) =>
      i === variantIndex
        ? { ...variant, images: variant.images?.filter((_, index) => index !== imageIndex) || [] }
        : variant
    );
    
    onVariantsChange(updatedVariants);
  };

  const sortedVariants = [...variants].sort((a, b) => a.sort_order - b.sort_order);

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
            <CardTitle className="text-base">Add New Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Variant Name *</Label>
                <Input
                  id="variant-name"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Red, Large, Premium"
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
                <Label htmlFor="variant-currency">Currency</Label>
                <Select value={newVariant.currency} onValueChange={(value) => setNewVariant(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                    <SelectItem value="GHS">GHS (₵)</SelectItem>
                  </SelectContent>
                </Select>
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
                />
                <label 
                  htmlFor="new-variant-images"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Click to upload images
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Drag and drop images here or click to browse
                </p>
              </div>
              {/* Display uploaded images */}
              {newVariant.images && newVariant.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {newVariant.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Variant image ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
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
      {sortedVariants.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Existing Variants</h4>
          {sortedVariants.map((variant, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                {editingVariant === index ? (
                  <VariantEditForm
                    variant={variant}
                    variantIndex={index}
                    onSave={(updates) => handleUpdateVariant(index, updates)}
                    onCancel={() => setEditingVariant(null)}
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
          ))}
        </div>
      )}
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
            {variant.stock <= 0 && (
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
              <div className="grid grid-cols-4 gap-2">
                {variant.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Variant image ${imgIndex + 1}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                    {image.is_primary && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
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
  onCancel
}: {
  variant: Partial<ProductVariant>;
  variantIndex: number;
  onSave: (updates: Partial<ProductVariant>) => void;
  onCancel: () => void;
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
      <div className="space-y-2">
        <Label>Variant Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleEditVariantImageUpload(e, variantIndex)}
            className="hidden"
            id={`edit-variant-images-${variantIndex}`}
          />
          <label 
            htmlFor={`edit-variant-images-${variantIndex}`}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Click to add more images
          </label>
        </div>
        {/* Display existing images */}
        {variant.images && variant.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {variant.images.map((image, imgIndex) => (
              <div key={imgIndex} className="relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Variant image ${imgIndex + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => removeEditVariantImage(variantIndex, imgIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
                {image.is_primary && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
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
