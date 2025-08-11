'use client';

import React, { useState } from 'react';
import { ProductVariant } from '@/store/types';
import { Button } from '@/components/ui/button';
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
  Save, 
  X, 
  GripVertical,
  Star 
} from 'lucide-react';

interface ProductVariantManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  maxVariants?: number;
}

export default function ProductVariantManager({
  variants = [],
  onVariantsChange,
  maxVariants = 6
}: ProductVariantManagerProps) {
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    price_ngn: 0,
    price_ghs: 0,
    stock: 0,
    is_active: true,
    sort_order: variants.length
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

    const variant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: '',
      name: newVariant.name!,
      description: newVariant.description || '',
      sku: newVariant.sku || '',
      price: newVariant.price || 0,
      price_ngn: newVariant.price_ngn || undefined,
      price_ghs: newVariant.price_ghs || undefined,
      stock: newVariant.stock || 0,
      is_active: newVariant.is_active || true,
      sort_order: newVariant.sort_order || variants.length,
      created_at: new Date(),
      updated_at: new Date()
    };

    onVariantsChange([...variants, variant]);
    setNewVariant({
      name: '',
      description: '',
      sku: '',
      price: 0,
      price_ngn: 0,
      price_ghs: 0,
      stock: 0,
      is_active: true,
      sort_order: variants.length + 1
    });
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    const updatedVariants = variants.map(variant =>
      variant.id === id ? { ...variant, ...updates, updated_at: new Date() } : variant
    );
    onVariantsChange(updatedVariants);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (id: string) => {
    const updatedVariants = variants.filter(variant => variant.id !== id);
    onVariantsChange(updatedVariants);
  };

  const handleToggleActive = (id: string) => {
    const variant = variants.find(v => v.id === id);
    if (variant) {
      handleUpdateVariant(id, { is_active: !variant.is_active });
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
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="variant-active"
                checked={newVariant.is_active}
                onCheckedChange={(checked) => setNewVariant(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="variant-active">Active (available for purchase)</Label>
            </div>
            <Button onClick={handleAddVariant} className="mt-4">
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
            <Card key={variant.id}>
              <CardContent className="p-4">
                {editingVariant === variant.id ? (
                  <VariantEditForm
                    variant={variant}
                    onSave={(updates) => handleUpdateVariant(variant.id, updates)}
                    onCancel={() => setEditingVariant(null)}
                  />
                ) : (
                  <VariantDisplay
                    variant={variant}
                    index={index}
                    onEdit={() => setEditingVariant(variant.id)}
                    onDelete={() => handleDeleteVariant(variant.id)}
                    onToggleActive={() => handleToggleActive(variant.id)}
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
  variant: ProductVariant;
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
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onToggleActive}>
          <Star className={`w-4 h-4 ${variant.is_active ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Variant Edit Form Component
function VariantEditForm({
  variant,
  onSave,
  onCancel
}: {
  variant: ProductVariant;
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
      <div className="flex gap-2">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
