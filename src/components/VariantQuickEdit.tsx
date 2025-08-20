'use client';

import React, { useState } from 'react';
import { ProductVariant } from '@/store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Save, 
  X, 
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface VariantQuickEditProps {
  variant: ProductVariant;
  onSave: (variantId: string, updates: Partial<ProductVariant>) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export default function VariantQuickEdit({
  variant,
  onSave,
  onCancel,
  className = ''
}: VariantQuickEditProps) {
  const [editingVariant, setEditingVariant] = useState<ProductVariant>({ ...variant });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!editingVariant.name.trim()) {
      toast.error('Variant name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(variant.id, editingVariant);
      toast.success('Variant updated successfully');
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingVariant({ ...variant });
    onCancel();
  };

  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-white ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Quick Edit: {variant.name}</h4>
        <Badge variant="outline">ID: {variant.id.slice(0, 8)}...</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${variant.id}`}>Name *</Label>
          <Input
            id={`name-${variant.id}`}
            value={editingVariant.name}
            onChange={(e) => setEditingVariant(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Variant name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`sku-${variant.id}`}>SKU</Label>
          <Input
            id={`sku-${variant.id}`}
            value={editingVariant.sku || ''}
            onChange={(e) => setEditingVariant(prev => ({ ...prev, sku: e.target.value }))}
            placeholder="Stock keeping unit"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`price-ngn-${variant.id}`}>Price (₦)</Label>
          <Input
            id={`price-ngn-${variant.id}`}
            type="number"
            step="0.01"
            value={editingVariant.price_ngn || ''}
            onChange={(e) => setEditingVariant(prev => ({ 
              ...prev, 
              price_ngn: parseFloat(e.target.value) || 0 
            }))}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`price-ghs-${variant.id}`}>Price (₵)</Label>
          <Input
            id={`price-ghs-${variant.id}`}
            type="number"
            step="0.01"
            value={editingVariant.price_ghs || ''}
            onChange={(e) => setEditingVariant(prev => ({ 
              ...prev, 
              price_ghs: parseFloat(e.target.value) || 0 
            }))}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
          <Input
            id={`stock-${variant.id}`}
            type="number"
            value={editingVariant.stock}
            onChange={(e) => setEditingVariant(prev => ({ 
              ...prev, 
              stock: parseInt(e.target.value) || 0 
            }))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${variant.id}`}>Description</Label>
        <Textarea
          id={`description-${variant.id}`}
          value={editingVariant.description || ''}
          onChange={(e) => setEditingVariant(prev => ({ 
            ...prev, 
            description: e.target.value 
          }))}
          placeholder="Optional description"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`active-${variant.id}`}
          checked={editingVariant.is_active}
          onCheckedChange={(checked) => setEditingVariant(prev => ({ 
            ...prev, 
            is_active: checked as boolean 
          }))}
        />
        <Label htmlFor={`active-${variant.id}`}>Active (available for purchase)</Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
