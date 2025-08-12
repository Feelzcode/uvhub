'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProductsStore } from '@/store'
import { Category, ProductType } from '@/store/types'
import { IconPlus, IconTrash, IconLoader2 } from '@tabler/icons-react'
import { toast } from 'sonner'

interface CategoryTypeFormProps {
    onClose: () => void
    category?: Category // For editing existing category
}

export function CategoryTypeForm({ onClose, category }: CategoryTypeFormProps) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    })

    const [productTypes, setProductTypes] = useState<Partial<ProductType>[]>(
        category?.types?.map(type => ({
            name: type.name,
            description: type.description,
            image: type.image,
            price: type.price,
            price_ngn: type.price_ngn,
            price_ghs: type.price_ghs,
            stock: type.stock,
            rating: type.rating,
            reviews: type.reviews,
        })) || []
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addCategory, updateCategory, createProductType, updateProductType } = useProductsStore()

    const addProductType = () => {
        setProductTypes([...productTypes, {
            name: '',
            description: '',
            image: '',
            price: 0,
            price_ngn: 0,
            price_ghs: 0,
            stock: 0,
            rating: 0,
            reviews: 0,
        }])
    }

    const removeProductType = (index: number) => {
        setProductTypes(productTypes.filter((_, i) => i !== index))
    }

    const updateProductTypeField = (index: number, field: keyof ProductType, value: any) => {
        const updatedTypes = [...productTypes]
        updatedTypes[index] = { ...updatedTypes[index], [field]: value }
        setProductTypes(updatedTypes)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (category) {
                // Update existing category
                await updateCategory(category.id, formData)
                
                // Update product types
                for (let i = 0; i < productTypes.length; i++) {
                    const type = productTypes[i]
                    if (type.id) {
                        // Update existing type
                        await updateProductType(type.id, type)
                    } else {
                        // Create new type
                        await createProductType({
                            ...type,
                            categoryId: category.id,
                        })
                    }
                }
                
                toast.success('Category updated successfully')
            } else {
                // Create new category
                await addCategory(formData)
                
                if (category && (category as Category).id) {
                    // Create product types for the new category
                    for (const type of productTypes) {
                        if (type.name && type.price && type.price > 0) {
                            await createProductType({
                                ...type,
                                categoryId: (category as Category).id,
                            })
                        }
                    }
                    
                    toast.success('Category created successfully')
                }
            }

            onClose()
        } catch (error) {
            console.error('Error saving category:', error)
            toast.error('Failed to save category')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Category Information</h3>
                
                <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="e.g., Treadmills"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                        placeholder="Describe this category of products"
                        rows={3}
                    />
                </div>
            </div>

            {/* Product Types */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Product Types</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addProductType}
                        className="flex items-center gap-2"
                    >
                        <IconPlus className="w-4 h-4" />
                        Add Type
                    </Button>
                </div>

                {productTypes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No product types added yet. Click "Add Type" to get started.
                    </p>
                )}

                {productTypes.map((type, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Product Type {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProductType(index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <IconTrash className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-name`}>Name *</Label>
                                <Input
                                    id={`type-${index}-name`}
                                    value={type.name || ''}
                                    onChange={(e) => updateProductTypeField(index, 'name', e.target.value)}
                                    required
                                    placeholder="e.g., Commercial Treadmill Pro"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-price`}>Price (USD) *</Label>
                                <Input
                                    id={`type-${index}-price`}
                                    type="number"
                                    step="0.01"
                                    value={type.price || ''}
                                    onChange={(e) => updateProductTypeField(index, 'price', parseFloat(e.target.value) || 0)}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`type-${index}-description`}>Description *</Label>
                            <Textarea
                                id={`type-${index}-description`}
                                value={type.description || ''}
                                onChange={(e) => updateProductTypeField(index, 'description', e.target.value)}
                                required
                                placeholder="Describe this product type"
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-image`}>Image URL *</Label>
                                <Input
                                    id={`type-${index}-image`}
                                    value={type.image || ''}
                                    onChange={(e) => updateProductTypeField(index, 'image', e.target.value)}
                                    required
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-stock`}>Stock</Label>
                                <Input
                                    id={`type-${index}-stock`}
                                    type="number"
                                    value={type.stock || ''}
                                    onChange={(e) => updateProductTypeField(index, 'stock', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-price-ngn`}>Price (NGN)</Label>
                                <Input
                                    id={`type-${index}-price-ngn`}
                                    type="number"
                                    step="0.01"
                                    value={type.price_ngn || ''}
                                    onChange={(e) => updateProductTypeField(index, 'price_ngn', parseFloat(e.target.value) || 0)}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`type-${index}-price-ghs`}>Price (GHS)</Label>
                                <Input
                                    id={`type-${index}-price-ghs`}
                                    type="number"
                                    step="0.01"
                                    value={type.price_ghs || ''}
                                    placeholder="Optional"
                                    onChange={(e) => updateProductTypeField(index, 'price_ghs', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <IconLoader2 className="w-4 h-4 animate-spin" />
                            {category ? 'Updating...' : 'Creating...'}
                        </div>
                    ) : (
                        category ? 'Update Category' : 'Create Category'
                    )}
                </Button>
            </div>
        </form>
    )
}
