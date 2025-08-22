'use client'

import * as React from "react"
import {
    IconDotsVertical,
    IconEye,
    IconEdit,
    IconTrash,
    IconUser,
    IconLayoutColumns,
    IconChevronDown,
    IconPlus,
    IconChevronsLeft,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsRight,
    IconCategory,
    IconLoader2,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    PaginationState,
    Updater,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,  
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Category, Customer, PaginatedResponse, ProductVariant, Subcategory, Product, ProductImage } from "@/store/types"

import { toast } from "sonner"
import ProductVariantManager from "@/components/ProductVariantManager"
import { CategoryTypeForm } from "@/components/CategoryTypeForm"
import { useProductsStore, useSubcategories } from "@/store"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { UploadProgressInline } from "@/components/ui/upload-progress"

// Get Supabase project URL for URL construction (keep for potential future use)
// const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
import {
    getPaginatedCustomers,
    getPaginatedCategories,
    getPaginatedSubcategories,
    getProducts,
    getProductVariants,
    getSubcategoriesByCategory,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    createVariantImage,
    getVariantImages,
    deleteVariantImage,
    updateVariantImage
} from "@/app/admin/dashboard/products/actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


// Create a separate component for the drag handle
// function DragHandle({ id }: { id: string }) {
//     const { attributes, listeners } = useSortable({
//         id,
//     })
//     return (
//         <Button
//             {...attributes}
//             {...listeners}
//             variant="ghost"
//             size="icon"
//             className="text-muted-foreground size-7 hover:bg-transparent"
//         >
//             <IconGripVertical className="text-muted-foreground size-3" />
//             <span className="sr-only">Drag to reorder</span>
//         </Button>
//     )
// }

// Create a separate component for category actions
function CategoryActions({ category }: { category: Category }) {
    const { deleteCategory, loading } = useProductsStore();
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);

    const handleDelete = async () => {
        await deleteCategory(category.id);
        setIsDeleteDialogOpen(false);
    };

    const handleView = () => {
        setIsViewDialogOpen(true);
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem className="cursor-pointer" onClick={handleView}>
                        <IconEye className="mr-2 size-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
                        <IconEdit className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="cursor-pointer" 
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <IconTrash className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>View Category: {category.name}</DialogTitle>
                        <DialogDescription>
                            Category details and product types
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Product Types ({category.types?.length || 0})</Label>
                            {category.types && category.types.length > 0 ? (
                                <div className="space-y-2">
                                    {category.types.map((type) => (
                                        <div key={type.id} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">{type.name}</h4>
                                                <Badge variant="secondary">${type.price}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>Stock: {type.stock}</span>
                                                <span>Rating: {type.rating}/5 ({type.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No product types added yet.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Category: {category.name}</DialogTitle>
                        <DialogDescription>
                            Update category details and product types
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <CategoryTypeForm 
                            onClose={() => setIsEditDialogOpen(false)} 
                            category={category}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{category.name}&quot;? This action cannot be undone and will also delete all associated product types.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? <IconLoader2 className="animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Create a separate component for product actions
function ProductActions({ product }: { product: Product }) {
    const { deleteProduct, updateProduct, loading, categories } = useProductsStore();
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);
    const [isCreateVariantModalOpen, setIsCreateVariantModalOpen] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: product.name,
        description: product.description || '',
        price: product.price?.toString() || '0',
        price_ngn: product.price_ngn?.toString() || '0',
        price_ghs: product.price_ghs?.toString() || '0',
        stock: product.stock?.toString() || '0',
        category: product.category,
        subcategory_id: product.subcategory_id || 'none'
    });
    
    const [variants, setVariants] = React.useState<Partial<ProductVariant>[]>([]);
    const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);
    const [isLoadingVariants, setIsLoadingVariants] = React.useState(true);
    

    const handleDelete = async () => {
        await deleteProduct(product.id);
        setIsDeleteDialogOpen(false);
        toast.success("Product deleted successfully");
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const transformedData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                price_ngn: parseFloat(formData.price_ngn) || 0,
                price_ghs: parseFloat(formData.price_ghs) || 0,
                stock: parseInt(formData.stock) || 0,
                category: formData.category,
                subcategory_id: formData.subcategory_id === 'none' ? undefined : formData.subcategory_id
            };
            
            await updateProduct(product.id, transformedData);
            
            // Process variant changes
            await processVariantChanges();
            
            setIsEditModalOpen(false);
            toast.success("Product and variants updated successfully");
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        }
    };

    // Process variant changes (create, update, delete)
    const processVariantChanges = async () => {
        try {
            console.log('🔄 Starting to process variant changes...');
            console.log('📊 Current variants:', variants);
            console.log('🏷️ Product ID being used:', product.id);
            console.log('🏷️ Product object:', product);
            console.log('🏷️ Product ID type:', typeof product.id);
            console.log('🏷️ Product ID length:', product.id?.length);
            
            // Validate product ID
            if (!product.id || typeof product.id !== 'string' || product.id.trim() === '') {
                console.error('❌ Invalid product ID:', product.id);
                toast.error('Invalid product ID. Cannot process variant changes.');
                return;
            }
            
            // Get the original variants from the database
            const originalVariants = await getProductVariants(product.id);
            console.log('🗄️ Original variants from DB:', originalVariants);
            
            const currentVariants = variants;
            
            // Find variants to delete (in original but not in current)
            const variantsToDelete = originalVariants.filter(original => 
                !currentVariants.some(current => current.id === original.id)
            );
            console.log('🗑️ Variants to delete:', variantsToDelete);
            
            // Find variants to create (in current but not in original - have temp IDs)
            const variantsToCreate = currentVariants.filter(current => 
                current.id && current.id.startsWith('temp-')
            );
            console.log('➕ Variants to create:', variantsToCreate);
            
            // Find variants to update (in both, but may have changes)
            const variantsToUpdate = currentVariants.filter(current => 
                current.id && !current.id.startsWith('temp-')
            );
            console.log('✏️ Variants to update:', variantsToUpdate);
            
            // Delete removed variants (images will be deleted automatically due to CASCADE)
            for (const variant of variantsToDelete) {
                console.log('🗑️ Deleting variant:', variant.id);
                await deleteProductVariant(variant.id);
            }
            
            // Create new variants and their images
            for (const variant of variantsToCreate) {
                console.log('➕ Creating variant:', variant.name);
                const createdVariant = await createProductVariant({
                    ...variant,
                    product_id: product.id,
                    category_id: formData.category
                });
                
                                 if (createdVariant && variant.images && variant.images.length > 0) {
                     console.log(`🖼️ Saving ${variant.images.length} images for variant:`, createdVariant.id);
                     
                     // Validate that we have the required IDs
                     if (!product.id) {
                         console.error('❌ Product ID is missing!');
                         toast.error('Product ID is missing. Cannot save variant images.');
                         return;
                     }
                     
                     if (!createdVariant.id) {
                         console.error('❌ Created variant ID is missing!');
                         toast.error('Created variant ID is missing. Cannot save variant images.');
                         return;
                     }
                     
                     // Save all images for the new variant
                     for (const image of variant.images) {
                         console.log('🖼️ Creating variant image:', image.image_url);
                         console.log('📝 Image data:', {
                             variant_id: createdVariant.id,
                             product_id: product.id,
                             image_url: image.image_url,
                             alt_text: image.alt_text,
                             is_primary: image.is_primary || false,
                             sort_order: image.sort_order || 0
                         });
                         
                         const imageData = {
                             variant_id: createdVariant.id,
                             product_id: product.id,
                             image_url: image.image_url,
                             alt_text: image.alt_text,
                             is_primary: image.is_primary || false,
                             sort_order: image.sort_order || 0
                         };
                         
                         console.log('🚀 About to call createVariantImage with:', imageData);
                         
                         const savedImage = await createVariantImage(imageData);
                         
                         if (savedImage) {
                             console.log('✅ Variant image saved:', savedImage);
                         } else {
                             console.error('❌ Failed to save variant image');
                         }
                     }
                 } else if (createdVariant) {
                     console.log('ℹ️ No images to save for variant:', createdVariant.id);
                 }
            }
            
            // Update existing variants and handle their images
            for (const variant of variantsToUpdate) {
                if (!variant.id) continue; // Skip variants without ID
                
                const originalVariant = originalVariants.find(orig => orig.id === variant.id);
                if (originalVariant && hasVariantChanges(originalVariant, variant)) {
                    console.log('✏️ Updating variant:', variant.id);
                    await updateProductVariant(variant.id!, variant);
                }
                
                // Handle image changes for existing variants
                if (variant.images) {
                    console.log(`🖼️ Processing ${variant.images.length} images for variant:`, variant.id);
                    await processVariantImageChanges(variant.id, variant.images);
                }
            }
            
            if (variantsToDelete.length > 0 || variantsToCreate.length > 0 || variantsToUpdate.length > 0) {
                toast.success(`Processed ${variantsToDelete.length} deletions, ${variantsToCreate.length} creations, ${variantsToUpdate.length} updates`);
            }
            
            console.log('✅ Finished processing variant changes');
            
        } catch (error) {
            console.error('❌ Error processing variant changes:', error);
            toast.error('Failed to process variant changes');
        }
    };

    // Helper function to process variant image changes
    const processVariantImageChanges = async (variantId: string, currentImages: ProductImage[]) => {
        try {
            console.log(`🖼️ Processing image changes for variant: ${variantId}`);
            console.log('📸 Current images:', currentImages);
            console.log('🏷️ Product ID being used:', product.id);
            console.log('🏷️ Variant ID being used:', variantId);
            
            // Validate that we have the required IDs
            if (!product.id) {
                console.error('❌ Product ID is missing in processVariantImageChanges!');
                toast.error('Product ID is missing. Cannot process variant image changes.');
                return;
            }
            
            if (!variantId) {
                console.error('❌ Variant ID is missing in processVariantImageChanges!');
                toast.error('Variant ID is missing. Cannot process variant image changes.');
                return;
            }
            
            // Get existing images from database
            const existingImages = await getVariantImages(variantId);
            console.log('🗄️ Existing images from DB:', existingImages);
            
            // Find images to delete (in existing but not in current)
            const imagesToDelete = existingImages.filter(existing => 
                !currentImages.some(current => current.id === existing.id)
            );
            console.log('🗑️ Images to delete:', imagesToDelete);
            
            // Find images to create (in current but not in existing - have temp IDs)
            const imagesToCreate = currentImages.filter(current => 
                current.id && current.id.startsWith('temp-')
            );
            console.log('➕ Images to create:', imagesToCreate);
            
            // Find images to update (in both, but may have changes)
            const imagesToUpdate = currentImages.filter(current => 
                current.id && !current.id.startsWith('temp-')
            );
            console.log('✏️ Images to update:', imagesToUpdate);
            
            // Delete removed images
            for (const image of imagesToDelete) {
                console.log('🗑️ Deleting image:', image.id);
                await deleteVariantImage(image.id);
            }
            
                         // Create new images
             for (const image of imagesToCreate) {
                 console.log('➕ Creating image:', image.image_url);
                 console.log('📝 Image data for existing variant:', {
                     variant_id: variantId,
                     product_id: product.id,
                     image_url: image.image_url,
                     alt_text: image.alt_text,
                     is_primary: image.is_primary || false,
                     sort_order: image.sort_order || 0
                 });
                 
                 const imageData = {
                     variant_id: variantId,
                     product_id: product.id,
                     image_url: image.image_url,
                     alt_text: image.alt_text,
                     is_primary: image.is_primary || false,
                     sort_order: image.sort_order || 0
                 };
                 
                 console.log('🚀 About to call createVariantImage in processVariantImageChanges with:', imageData);
                 
                 const savedImage = await createVariantImage(imageData);
                 
                 if (savedImage) {
                     console.log('✅ Image created:', savedImage);
                 } else {
                     console.error('❌ Failed to create image');
                 }
             }
            
            // Update existing images
            for (const image of imagesToUpdate) {
                if (!image.id) continue;
                console.log('✏️ Updating image:', image.id);
                const updatedImage = await updateVariantImage(image.id, {
                    image_url: image.image_url,
                    alt_text: image.alt_text,
                    is_primary: image.is_primary || false,
                    sort_order: image.sort_order || 0
                });
                console.log('✅ Image updated:', updatedImage);
            }
            
            console.log(`✅ Finished processing images for variant: ${variantId}`);
            
        } catch (error) {
            console.error(`❌ Error processing variant image changes for variant ${variantId}:`, error);
            toast.error('Failed to process variant image changes');
        }
    };

    // Helper function to check if a variant has changes
    const hasVariantChanges = (original: ProductVariant, current: Partial<ProductVariant>): boolean => {
        // Check basic variant properties
        const basicChanges = (
            original.name !== current.name ||
            original.description !== current.description ||
            original.price !== current.price ||
            original.price_ngn !== current.price_ngn ||
            original.price_ghs !== current.price_ghs ||
            original.stock !== current.stock ||
            original.sku !== current.sku ||
            original.is_active !== current.is_active ||
            original.sort_order !== current.sort_order
        );
        
        // Check if images have changed
        const originalImages = original.images || [];
        const currentImages = current.images || [];
        
        if (originalImages.length !== currentImages.length) {
            return true;
        }
        
        // Check if any image properties have changed
        for (let i = 0; i < originalImages.length; i++) {
            const origImg = originalImages[i];
            const currImg = currentImages[i];
            
            if (!currImg || 
                origImg.image_url !== currImg.image_url ||
                origImg.alt_text !== currImg.alt_text ||
                origImg.is_primary !== currImg.is_primary ||
                origImg.sort_order !== currImg.sort_order) {
                return true;
            }
        }
        
        return basicChanges;
    };

    const handleView = () => {
        setIsViewDrawerOpen(true);
    };

    // Load variants and subcategories when editing
    React.useEffect(() => {
        const loadEditData = async () => {
            if (isEditModalOpen) {

                setIsLoadingVariants(true);
                
                try {
                    // Load variants
                    const productVariants = await getProductVariants(product.id);
                    
                    if (Array.isArray(productVariants)) {
                        setVariants(productVariants);
                    } else {
                        console.error('Product variants is not an array:', productVariants);
                        setVariants([]);
                    }
                    
                                               // Load subcategories if category is set
                           if (formData.category) {
                               const subcats = await getSubcategoriesByCategory(formData.category);
                               setSubcategories(subcats);
                           }
                } catch (error) {
                    console.error('Error loading edit data:', error);
                    toast.error('Failed to load product data for editing');
                    setVariants([]);
                } finally {
                    setIsLoadingVariants(false);
                }
            }
        };

        loadEditData();
               }, [isEditModalOpen, product.id, formData.category]);

    const handleCategoryChange = async (categoryId: string) => {
        setFormData(prev => ({ ...prev, category: categoryId, subcategory_id: 'none' }));
                       if (categoryId) {
                   try {
                       const subcats = await getSubcategoriesByCategory(categoryId);
                       setSubcategories(subcats);
                   } catch (error) {
                       console.error('Error fetching subcategories:', error);
                       setSubcategories([]);
                   }
               } else {
                   setSubcategories([]);
               }
    };

    const handleVariantsChange = (newVariants: Partial<ProductVariant>[]) => {
        console.log('🔄 handleVariantsChange called with:', newVariants);
        console.log('📊 Previous variants state:', variants);
        setVariants(newVariants);
        console.log('✅ Variants state updated');
    };

    // Handle variant updates
    const handleVariantUpdate = async (variantId: string, updates: Partial<ProductVariant>) => {
        try {
            const updatedVariant = await updateProductVariant(variantId, updates);
            if (updatedVariant) {
                // Update the local variants state
                setVariants(prev => prev.map(v => 
                    v.id === variantId ? { ...v, ...updatedVariant } : v
                ));
                toast.success('Variant updated successfully');
            }
        } catch (error) {
            console.error('Error updating variant:', error);
            toast.error('Failed to update variant');
        }
    };

    // Handle variant creation
    const handleVariantCreate = async (variant: Partial<ProductVariant>) => {
        try {
            const newVariant = await createProductVariant({
                ...variant,
                product_id: product.id,
                category_id: formData.category
            });
            
            if (newVariant) {
                // Add the new variant to the local state
                setVariants(prev => [...prev, newVariant]);
                toast.success('Variant created successfully');
            }
        } catch (error) {
            console.error('Error creating variant:', error);
            toast.error('Failed to create variant');
        }
    };

    // Handle variant deletion
    const handleVariantDelete = async (variantId: string) => {
        try {
            const success = await deleteProductVariant(variantId);
            if (success) {
                // Remove the variant from local state
                setVariants(prev => prev.filter(v => v.id !== variantId));
                toast.success('Variant deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting variant:', error);
            toast.error('Failed to delete variant');
        }
    };

//         try {
//             const transformedData = transformProductInput(data);
//             await updateProduct(product.id, transformedData);
            
//             // Handle product images
//             if (productImages.length > 0) {
//                 // Get existing images to compare
//                 const existingImages = await getProductImages(product.id);
                
//                 // Find new images (those with temp IDs)
//                 const newImages = productImages.filter(img => img.id.startsWith('temp-'));
                
//                 // Find deleted images
//                 const deletedImages = existingImages.filter(existing => 
//                     !productImages.some(current => current.id === existing.id)
//                 );
                
//                 // Delete removed images
//                 for (const deletedImage of deletedImages) {
//                     await deleteProductImage(deletedImage.id);
//                 }
                
//                 // Add new images
//                 for (const newImage of newImages) {
//                     await createProductImage({
//                         product_id: product.id,
//                         image_url: newImage.image_url,
//                         alt_text: newImage.alt_text,
//                         is_primary: newImage.is_primary,
//                         sort_order: newImage.sort_order,
//                     });
//                 }
                
//                 // Update existing images (for primary status and order changes)
//                 const existingImagesToUpdate = productImages.filter(img => 
//                     !img.id.startsWith('temp-') && existingImages.some(existing => existing.id === img.id)
//                 );
                
//                 for (const imageToUpdate of existingImagesToUpdate) {
//                     const existingImage = existingImages.find(existing => existing.id === imageToUpdate.id);
//                     if (existingImage && (
//                         existingImage.is_primary !== imageToUpdate.is_primary ||
//                         existingImage.sort_order !== imageToUpdate.sort_order
//                     )) {
//                         await updateProductImage(imageToUpdate.id, {
//                             is_primary: imageToUpdate.is_primary,
//                             sort_order: imageToUpdate.sort_order,
//                         });
//                     }
//                 }
//             }
            
//             setIsEditDrawerOpen(false);
//             toast.success("Product updated successfully");
//         }
//         catch (error) {
//             console.error(error);
//             toast.error("Failed to update product");
//         }
//     };

//     const handleView = () => {
//         setIsViewDrawerOpen(true);
//     }

//     const handleImagesChange = (images: ProductImage[]) => {
//         setProductImages(images);
//         // Update the main image field with the primary image
//         const primaryImage = images.find(img => img.is_primary);
//         if (primaryImage) {
//             formData.setValue('image', primaryImage.image_url);
//         }
//     };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem className="cursor-pointer" onClick={handleView}>
                        <IconEye className="mr-2 size-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
                        <IconEdit className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsCreateVariantModalOpen(true)}>
                        <IconPlus className="mr-2 size-4" />
                        Create Variant
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <IconTrash className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            {/* View Drawer */}
            <Drawer open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Product Details</DrawerTitle>
                        <DrawerDescription>
                            View detailed information about this product.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="view-name">Name</Label>
                                <Input id="view-name" value={product.name} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="view-description">Description</Label>
                                <Input id="view-description" value={product.description || ''} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="view-price">Price</Label>
                                <Input id="view-price" value={`$${product.price?.toFixed(2) || '0.00'}`} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="view-stock">Stock</Label>
                                <Input id="view-stock" value={product.stock?.toString() || '0'} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="view-category">Category</Label>
                                <Input id="view-category" value={product.category_data?.name || product.category} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="view-created-at">Created At</Label>
                                <Input id="view-created-at" value={new Date(product.created_at).toLocaleDateString()} disabled />
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Edit Drawer */}
            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Product: {product.name}</DialogTitle>
                        <DialogDescription>
                            Update product information, variants, and images.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                                <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="basic" className="space-y-6">
                                {/* Basic Product Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Product Name</Label>
                                    <Input 
                                        id="edit-name" 
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category: Category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-subcategory">Subcategory (Optional)</Label>
                                    <Select 
                                        value={formData.subcategory_id} 
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                                        disabled={!formData.category || subcategories.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={!formData.category ? "Select category first" : subcategories.length === 0 ? "No subcategories" : "Select subcategory"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {subcategories.map((subcategory) => (
                                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                                    {subcategory.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-subcategory">Stock</Label>
                                    <Input
                                        id="edit-stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea 
                                    id="edit-description" 
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    placeholder="Enter product description"
                                />
                            </div>
                        </div>

                        {/* Pricing Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Pricing</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-price">Fallback Price ($)</Label>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                    <p className="text-xs text-muted-foreground">Used as fallback for other countries</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-price-ngn">Nigerian Price (₦)</Label>
                                    <Input
                                        id="edit-price-ngn"
                                        type="number"
                                        step="0.01"
                                        value={formData.price_ngn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price_ngn: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-price-ghs">Ghanaian Price (₵)</Label>
                                    <Input
                                        id="edit-price-ghs"
                                        type="number"
                                        step="0.01"
                                        value={formData.price_ghs}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price_ghs: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                            </TabsContent>
                            
                            <TabsContent value="variants" className="space-y-6">
                                {/* Product Variants */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Product Variants</h3>
                                        <Badge variant="secondary">
                                            {variants.length} variant{variants.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Manage variants of this product. Each variant can have its own pricing, stock, and images.
                                    </p>
                                    
                                    {isLoadingVariants ? (
                                        <div className="flex items-center justify-center py-8">
                                            <IconLoader2 className="animate-spin mr-2" />
                                            Loading variants...
                                        </div>
                                    ) : (
                                        <ProductVariantManager
                                            variants={variants}
                                            onVariantsChange={handleVariantsChange}
                                            maxVariants={10}
                                            categoryId={formData.category}
                                            onVariantUpdate={handleVariantUpdate}
                                            onVariantCreate={handleVariantCreate}
                                            onVariantDelete={handleVariantDelete}
                                            productId={product.id}
                                        />
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Variant Modal */}
            <Dialog open={isCreateVariantModalOpen} onOpenChange={setIsCreateVariantModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Create Variant for: {product.name}</DialogTitle>
                        <DialogDescription>
                            Add a new variant to this product with its own pricing, stock, and images.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <CreateVariantForm 
                            productId={product.id}
                            productName={product.name}
                            categoryId={product.category}
                            onClose={() => setIsCreateVariantModalOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <DialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </DialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


function ProductCellViewer({ product }: { product: Product }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col">
                <span className="font-medium">{product.name}</span>
            </div>
        </div>
    );
}

// Product columns
const productColumns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => {
            return <ProductCellViewer product={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            const categoryName = typeof category === 'object' && category && 'name' in category 
                ? (category as { name: string }).name 
                : typeof category === 'string' ? category : '-';
            
            return (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                        {row.original.category_data?.name || categoryName}
                </Badge>
            </div>
            );
        },
    },
    {
        accessorKey: "subcategory",
        header: "Subcategory",
        cell: ({ row }) => {
            const subcategory = row.original.subcategory;
            const subcategoryName = typeof subcategory === 'object' && subcategory && 'name' in subcategory 
                ? (subcategory as { name: string }).name 
                : null;
            
            return (
            <div className="w-32">
                    {subcategoryName ? (
                    <Badge variant="outline" className="text-muted-foreground px-1.5">
                            {subcategoryName}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
            </div>
            );
        },
    },
//     {
//         accessorKey: "images",
//         header: "Images",
//         cell: ({ row }) => (
//             <div className="w-20">
//                 {row.original.images && row.original.images.length > 0 ? (
//                     <Badge variant="secondary" className="text-xs">
//                         {row.original.images.length} image{row.original.images.length !== 1 ? 's' : ''}
//                     </Badge>
//                 ) : (
//                     <span className="text-muted-foreground text-xs">1 image</span>
//                 )}
//             </div>
//         ),
//     },
    {
        accessorKey: "price",
        header: () => <div className="w-full text-right">Price</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                ${row.original.price?.toFixed(2) || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: "stock",
        header: () => <div className="w-full text-right">Stock</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <Badge
                    variant={row.original.stock > 10 ? "default" : row.original.stock > 0 ? "secondary" : "destructive"}
                >
                    {row.original.stock || 0}
                </Badge>
            </div>
        ),
    },
//     {
//         accessorKey: "rating",
//         header: "Rating",
//         cell: ({ row }) => (
//             <div className="flex items-center gap-1">
//                 <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
//                 <span className="text-sm font-medium">{row.original.rating}</span>
//                 <span className="text-xs text-muted-foreground">({row.original.reviews})</span>
//             </div>
//         ),
//     },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ProductActions product={row.original} />
        },
    },
]

// Customer columns
const customerColumns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Customer Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconUser className="size-4" />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.email}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.phone}</div>
        ),
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.address && typeof row.original.address === 'object' ? 
                    `${row.original.address.street || ''}, ${row.original.address.city || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || '-'
                    : '-'
                }
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toLocaleDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>
                        <IconEye className="mr-2 size-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconEdit className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        <IconTrash className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Subcategory columns
const subcategoryColumns: ColumnDef<Subcategory>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "subcategory",
        header: "Subcategory Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconCategory className="size-4" />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Parent Category",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.category?.name || '-'}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <IconDotsVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

// Variant columns
const variantColumns: ColumnDef<ProductVariant>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Variant Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => {
            // This would need to be populated with product data
            return (
                <div className="text-sm text-muted-foreground">
                    {row.original.product_id || '-'}
                </div>
            );
        },
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <div className="text-sm font-mono">
                {row.original.sku || '-'}
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: () => <div className="w-full text-right">Price ($)</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                ${row.original.price?.toFixed(2) || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: "stock",
        header: () => <div className="w-full text-right">Stock</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <Badge
                    variant={row.original.stock > 10 ? "default" : row.original.stock > 0 ? "secondary" : "destructive"}
                >
                    {row.original.stock || 0}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? "default" : "secondary"}>
                {row.original.is_active ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        size="icon"
                    >
                        <IconDotsVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <IconEye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

// Category columns
const categoryColumns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconCategory className="size-4" />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <CategoryActions category={row.original} />
        ),
    },
]

// Generic table component
function DataTable<T extends { id: string }>({
    data,
    columns,
    pagination,
    onPaginationChange,
}: {
    data: T[];
    columns: ColumnDef<T>[];
    pagination: PaginationState;
    onPaginationChange: (updaterOrValue: Updater<PaginationState> | PaginationState) => void;
}) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row: T) => row.id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
    })

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No data found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

// Product creation form
function CreateProductForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = React.useState({
        name: '',
        category: '',
        subcategory_id: 'none',
        price: 0,
        stock: 0
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [subcategories, setSubcategories] = React.useState<Subcategory[]>([])
    const { addProduct, getSubcategoriesByCategory, categories, getCategories } = useProductsStore();

    // Debug: Log categories when they change
    React.useEffect(() => {
        const fetchCategories = async () => {
            await getCategories();
        }
        fetchCategories();
    }, [getCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate required fields
            if (!formData.name.trim()) {
                toast.error('Product name is required');
                setIsSubmitting(false);
                return;
            }

            if (!formData.category) {
                toast.error('Please select a category');
                setIsSubmitting(false);
                return;
            }

            if (!formData.price || formData.price <= 0) {
                toast.error('Please enter a valid fallback price');
                setIsSubmitting(false);
                return;
            }

            // Debug: Log the category data being sent
            console.log('Category data being sent:', {
                category: formData.category,
                categoryType: typeof formData.category,
                categories: categories.map(c => ({ id: c.id, name: c.name, idType: typeof c.id }))
            });

            // Validate that category is a valid UUID
            if (!formData.category || formData.category === '') {
                throw new Error('Category is required');
            }

            // Check if the category ID is a valid UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(formData.category)) {
                throw new Error(`Invalid category ID format: ${formData.category}. Expected UUID format.`);
            }

            // Create the main product (basic info only)
            const productData = {
                name: formData.name,
                category: formData.category, // Database expects 'category' column (UUID)
                subcategory_id: formData.subcategory_id && formData.subcategory_id !== '' && formData.subcategory_id !== 'none' ? formData.subcategory_id : undefined,
                description: formData.name, // Use product name as description
                price: formData.price || 0, // Use fallback price
                stock: formData.stock || 0, // Use fallback stock
                rating: 0,
            };
            
            console.log('Product data being sent to database:', productData);
            const product = await addProduct(productData);

            if (!product || typeof product !== 'object' || !('id' in product)) {
                throw new Error('Failed to create product');
            }

            toast.success(`Product "${formData.name}" created successfully! You can now add variants to this product.`);
            // Reset form data
            setFormData({
                name: '',
                category: '',
                subcategory_id: 'none',
                price: 0,
                stock: 0
            });
            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
            
            // Show more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('Invalid category ID format')) {
                    toast.error(error.message);
                } else if (error.message.includes('Failed to create product')) {
                    toast.error('Database error occurred. Please check the console for details.');
                } else {
                    toast.error(`Error: ${error.message}`);
                }
            } else {
                toast.error('An unexpected error occurred while creating the product');
            }
        } finally {
            setIsSubmitting(false)
        }
    }



    // Load categories when component mounts
    React.useEffect(() => {
        const fetchCategories = async () => {
            await getCategories();
        };
        fetchCategories();
    }, [getCategories]);

    const handleCategoryChange = async (categoryId: string) => {
        console.log('Category selected:', { categoryId, type: typeof categoryId });
        
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (categoryId && !uuidRegex.test(categoryId)) {
            console.warn('Selected category ID is not a valid UUID:', categoryId);
            toast.error('Invalid category selected. Please try again.');
            return;
        }
        
        setFormData(prev => ({ ...prev, category: categoryId, subcategory_id: 'none' }));
        if (categoryId) {
            try {
                const subcats = await getSubcategoriesByCategory(categoryId);
                setSubcategories(subcats);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category: Category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                    <Select 
                        value={formData.subcategory_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                        disabled={!formData.category || subcategories.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={!formData.category ? "Select category first" : subcategories.length === 0 ? "No subcategories" : "Select subcategory"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Fallback Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        required
                    />
                    <p className="text-xs text-muted-foreground">Base price for this product</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        required
                    />
                    <p className="text-xs text-muted-foreground">Initial stock level</p>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                    // Reset form data
                    setFormData({
                        name: '',
                        category: '',
                        subcategory_id: 'none',
                        price: 0,
                        stock: 0
                    });
                    onClose();
                }}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </form>
    )
}

// Variant creation form
function CreateVariantForm({ 
    productId, 
    productName, 
    categoryId, 
    onClose 
}: { 
    productId: string; 
    productName: string; 
    categoryId: string; 
    onClose: () => void; 
}) {
    const [formData, setFormData] = React.useState({
        name: '',
        sku: '',
        price_ngn: 0,
        price_ghs: 0,
        stock: 0,
        description: '',
        is_active: true
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [uploadedImageUrls, setUploadedImageUrls] = React.useState<string[]>([]);
    const { createProductVariant } = useProductsStore();

    // Initialize Cloudinary for image uploads
    const { uploadFiles, uploadProgress } = useCloudinaryUpload({ 
        folder: 'variants',
        callbacks: {
            onStart: () => toast.info('Starting image upload...'),
            onSuccess: (files) => {
                // Extract URLs from the uploaded files
                const urls = files.map((file: { secure_url: string }) => file.secure_url).filter(Boolean);
                setUploadedImageUrls(urls);
                toast.success(`${urls.length} image(s) uploaded successfully`);
            },
            onError: (error) => toast.error(`Upload failed: ${error.message}`),
        }
    });

    // No need for Uppy cleanup since files are uploaded immediately

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check if images were uploaded
        if (uploadedImageUrls.length === 0) {
            toast.warning('Please upload at least one image for the variant.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Create the variant
            const variant = await createProductVariant({
                product_id: productId,
                category_id: categoryId,
                name: formData.name,
                sku: formData.sku || `${productName}-${formData.name}`.toLowerCase().replace(/\s+/g, '-'),
                price: 0, // Use 0 as fallback since no general price field
                price_ngn: formData.price_ngn || undefined,
                price_ghs: formData.price_ghs || undefined,
                stock: formData.stock,
                description: formData.description || formData.name,
                is_active: formData.is_active,
                sort_order: 0
            });

            if (variant) {
                // Handle image uploads if any images were uploaded
                if (uploadedImageUrls.length > 0) {
                    try {
                        // Create variant image records for each uploaded image
                        for (const imageUrl of uploadedImageUrls) {
                            await createVariantImage({
                                variant_id: variant.id,
                                image_url: imageUrl,
                                alt_text: `${formData.name} variant image`,
                                is_primary: uploadedImageUrls.indexOf(imageUrl) === 0, // First image is primary
                                sort_order: uploadedImageUrls.indexOf(imageUrl)
                            });
                        }
                        toast.success(`${uploadedImageUrls.length} image${uploadedImageUrls.length !== 1 ? 's' : ''} linked to variant successfully!`);
                    } catch (imageError) {
                        console.error('Error linking images to variant:', imageError);
                        toast.warning('Variant created but there was an issue linking images');
                    }
                }
                
                toast.success(`Variant "${formData.name}" created successfully!`);
                // Clear uploaded URLs after successful submission
                setUploadedImageUrls([]);
                onClose();
            } else {
                throw new Error('Failed to create variant');
            }
        } catch (error) {
            console.error('Error creating variant:', error);
            toast.error('Failed to create variant. Please try again.');
            // Clear uploaded URLs on error too
            setUploadedImageUrls([]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                                console.log('Files selected:', files);
                                
                                // Upload files to Cloudinary
                                try {
                                    console.log('Starting upload of', files.length, 'files');
                                    toast.info(`Uploading ${files.length} image(s)...`);
                                    
                                    const uploadResult = await uploadFiles(files);
                                    console.log('Upload completed, result:', uploadResult);
                                    
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
                 <UploadProgressInline progress={uploadProgress} />
                 
                 {/* Upload Status */}
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

                             {/* Debug Info (remove in production) */}
                 {process.env.NODE_ENV === 'development' && (
                     <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                         <p className="font-medium mb-2">Debug Info:</p>
                         <p>Uploaded URLs: {uploadedImageUrls.length}</p>
                         <p>Upload Progress: {uploadProgress.progress}%</p>
                         <p>Is Uploading: {uploadProgress.isUploading ? 'Yes' : 'No'}</p>
                     </div>
                 )}
                 
                 {/* Action Buttons */}
                 <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                    // Clear uploaded URLs when canceling
                    setUploadedImageUrls([]);
                    onClose();
                }}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || uploadProgress.isUploading}>
                    {isSubmitting ? 'Creating...' : 'Create Variant'}
                </Button>
            </div>
        </form>
    );
}

// Subcategory creation form
function CreateSubcategoryForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        category_id: '',
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [categories, setCategories] = React.useState<Category[]>([])
    const { addSubcategory } = useSubcategories();
    React.useEffect(() => {
        // Fetch categories for the dropdown
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await addSubcategory({
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id,
            });

            toast.success('Subcategory created successfully')
            onClose()
        } catch (error) {
            console.error('Error creating subcategory:', error)
            toast.error('Failed to create subcategory')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Subcategory Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter subcategory name"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter subcategory description"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Parent Category</Label>
                <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Subcategory'
                    )}
                </Button>
            </div>
        </form>
    )
}

export function ProductsDataTable({
    categoriesData,
    customersData,
}: {
    categoriesData: PaginatedResponse<Category>;
    customersData: PaginatedResponse<Customer>;
}) {
         const [activeTab, setActiveTab] = React.useState("variants")
    const [isCreateSubcategoryDialogOpen, setIsCreateSubcategoryDialogOpen] = React.useState(false)
    const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] = React.useState(false)
    const [currentCustomersData, setCurrentCustomersData] = React.useState(customersData)
    const [currentCategoriesData, setCurrentCategoriesData] = React.useState(categoriesData)
    const [subcategoriesData, setSubcategoriesData] = React.useState<PaginatedResponse<Subcategory>>({
        documents: [],
        total: 0,
        meta: {
            page: 1,
            limit: 10,
            totalPages: 0,
            previousPage: null,
            nextPage: null,
        }
    })

         const [productsData, setProductsData] = React.useState<PaginatedResponse<Product>>({
         documents: [],
         total: 0,
         meta: {
             page: 1,
             limit: 10,
             totalPages: 0,
             previousPage: null,
             nextPage: null,
         }
     })

     const [variantsData, setVariantsData] = React.useState<PaginatedResponse<ProductVariant>>({
         documents: [],
         total: 0,
         meta: {
             page: 1,
             limit: 10,
             totalPages: 0,
             previousPage: null,
             nextPage: null,
         }
     })

    // Update state when prop changes
    React.useEffect(() => {
        setCurrentCustomersData(customersData)
        setCurrentCategoriesData(categoriesData)
    }, [customersData, categoriesData])

         // Fetch products when component mounts
     React.useEffect(() => {
         const fetchProducts = async () => {
             try {
                 const products = await getProducts();
                 setProductsData({
                     documents: products,
                     total: products.length,
                     meta: {
                         page: 1,
                         limit: 10,
                         totalPages: Math.ceil(products.length / 10),
                         previousPage: null,
                         nextPage: products.length > 10 ? 2 : null,
                     }
                 });
             } catch (error) {
                 console.error('Error fetching products:', error);
             }
         };
         fetchProducts();
     }, []);

     // Fetch variants when component mounts
     React.useEffect(() => {
         const fetchVariants = async () => {
             try {
                 // Get all variants from all products
                 const allVariants: ProductVariant[] = [];
                 const products = await getProducts();
                 
                 for (const product of products) {
                     const productVariants = await getProductVariants(product.id);
                     if (Array.isArray(productVariants)) {
                         allVariants.push(...productVariants);
                     }
                 }
                 
                 setVariantsData({
                     documents: allVariants,
                     total: allVariants.length,
                     meta: {
                         page: 1,
                         limit: 10,
                         totalPages: Math.ceil(allVariants.length / 10),
                         previousPage: null,
                         nextPage: allVariants.length > 10 ? 2 : null,
                     }
                 });
             } catch (error) {
                 console.error('Error fetching variants:', error);
             }
         };
         fetchVariants();
     }, []);

    // Internal pagination handlers
    const handleCustomersPageChange = React.useCallback(async (updaterOrValue: Updater<PaginationState> | PaginationState) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue({ pageIndex: 0, pageSize: 10 }) : updaterOrValue
        console.log('Customers page change:', pagination)
        // Call the server action directly
        const nextPage = await getPaginatedCustomers({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize
        })
        if (nextPage) {
            setCurrentCustomersData(nextPage)
        }
    }, [])

    const handleCategoriesPageChange = React.useCallback(async (updaterOrValue: Updater<PaginationState> | PaginationState) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue({ pageIndex: 0, pageSize: 10 }) : updaterOrValue
        console.log('Categories page change:', pagination)
        // Call the server action directly
        const nextPage = await getPaginatedCategories({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize
        })
        if (nextPage) {
            setCurrentCategoriesData(nextPage)
        }
    }, [])

    const handleSubcategoriesPageChange = React.useCallback(async (updaterOrValue: Updater<PaginationState> | PaginationState) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue({ pageIndex: 0, pageSize: 10 }) : updaterOrValue
        console.log('Subcategories page change:', pagination)
        // Call the server action directly
        const nextPage = await getPaginatedSubcategories({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize
        })
        if (nextPage) {
            setSubcategoriesData(nextPage)
        }
    }, [])

    return (
        <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                                     <SelectContent>
                     <SelectItem value="categories">Categories</SelectItem>
                     <SelectItem value="products">Products</SelectItem>
                     <SelectItem value="variants">Variants</SelectItem>
                     <SelectItem value="subcategories">Subcategories</SelectItem>
                     <SelectItem value="customers">Customers</SelectItem>
                 </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">

                                         <TabsTrigger value="categories">
                          Categories <Badge variant="secondary">{categoriesData.total}</Badge>
                     </TabsTrigger>
                     <TabsTrigger value="products">
                         Products <Badge variant="secondary">{productsData.total}</Badge>
                     </TabsTrigger>
                     <TabsTrigger value="variants">
                         Variants <Badge variant="secondary">{variantsData.total}</Badge>
                     </TabsTrigger>
                     <TabsTrigger value="subcategories">
                         Subcategories <Badge variant="secondary">{subcategoriesData.total}</Badge>
                     </TabsTrigger>
                     <TabsTrigger value="customers">
                         Customers <Badge variant="secondary">{customersData.total}</Badge>
                     </TabsTrigger>
                </TabsList>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconLayoutColumns />
                            <span className="hidden lg:inline">Customize Columns</span>
                            <span className="lg:hidden">Columns</span>
                            <IconChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {/* Column visibility options would go here */}
                    </DropdownMenuContent>
                </DropdownMenu>



                {activeTab === "categories" && (
                    <Dialog open={isCreateProductDialogOpen} onOpenChange={setIsCreateProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconPlus />
                                <span className="hidden lg:inline">Add Product</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Create New Product</DialogTitle>
                                <DialogDescription>
                                    Add a new product to your inventory. Fill in all the required fields.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <CreateProductForm onClose={() => setIsCreateProductDialogOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {activeTab === "subcategories" && (
                    <Dialog open={isCreateSubcategoryDialogOpen} onOpenChange={setIsCreateSubcategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconPlus />
                                <span className="hidden lg:inline">Add Subcategory</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Create New Subcategory</DialogTitle>
                                <DialogDescription>
                                    Add a new subcategory to further organize your products.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <CreateSubcategoryForm onClose={() => setIsCreateSubcategoryDialogOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {activeTab === "products" && (
                    <Dialog open={isCreateProductDialogOpen} onOpenChange={setIsCreateProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconPlus />
                                <span className="hidden lg:inline">Add Product</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Create New Product</DialogTitle>
                                <DialogDescription>
                                    Add a new product to your inventory. Fill in all the required fields.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <CreateProductForm onClose={() => setIsCreateProductDialogOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div><TabsContent
            value="customers"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
                <DataTable
                    data={currentCustomersData.documents}
                    columns={customerColumns}
                    pagination={{
                        pageIndex: currentCustomersData.meta.page - 1,
                        pageSize: currentCustomersData.meta.limit,
                    }}
                    onPaginationChange={handleCustomersPageChange} />
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        Showing {currentCustomersData.documents.length} of {currentCustomersData.total} customers
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {currentCustomersData.meta.page} of {currentCustomersData.meta.totalPages}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handleCustomersPageChange({ pageIndex: 0, pageSize: currentCustomersData.meta.limit })}
                                disabled={!currentCustomersData.meta.previousPage}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleCustomersPageChange({
                                    pageIndex: (currentCustomersData.meta.previousPage || 1) - 1,
                                    pageSize: currentCustomersData.meta.limit
                                })}
                                disabled={!currentCustomersData.meta.previousPage}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleCustomersPageChange({
                                    pageIndex: (currentCustomersData.meta.nextPage || 1) - 1,
                                    pageSize: currentCustomersData.meta.limit
                                })}
                                disabled={!currentCustomersData.meta.nextPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => handleCustomersPageChange({
                                    pageIndex: currentCustomersData.meta.totalPages - 1,
                                    pageSize: currentCustomersData.meta.limit
                                })}
                                disabled={!currentCustomersData.meta.nextPage}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
                         </TabsContent><TabsContent
                 value="products"
                 className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
             >
                 <DataTable
                     data={productsData.documents}
                     columns={productColumns}
                     pagination={{
                         pageIndex: productsData.meta.page - 1,
                         pageSize: productsData.meta.limit,
                     }}
                     onPaginationChange={() => {}} />
                 <div className="flex items-center justify-between px-4">
                     <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                         Showing {productsData.documents.length} of {productsData.total} products
                     </div>
                     <div className="flex w-full items-center gap-8 lg:w-fit">
                         <div className="flex w-fit items-center justify-center text-sm font-medium">
                             Page {productsData.meta.page} of {productsData.meta.totalPages}
                         </div>
                     </div>
                 </div>
             </TabsContent><TabsContent
                 value="variants"
                 className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
             >
                 <DataTable
                     data={variantsData.documents}
                     columns={variantColumns}
                     pagination={{
                         pageIndex: variantsData.meta.page - 1,
                         pageSize: variantsData.meta.limit,
                     }}
                     onPaginationChange={() => {}} />
                 <div className="flex items-center justify-between px-4">
                     <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                         Showing {variantsData.documents.length} of {variantsData.total} variants
                     </div>
                     <div className="flex w-full items-center gap-8 lg:w-fit">
                         <div className="flex w-fit items-center justify-center text-sm font-medium">
                             Page {variantsData.meta.page} of {variantsData.meta.totalPages}
                         </div>
                     </div>
                 </div>
             </TabsContent><TabsContent
                value="categories"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <DataTable
                    data={currentCategoriesData.documents}
                    columns={categoryColumns}
                    pagination={{
                        pageIndex: currentCategoriesData.meta.page - 1,
                        pageSize: currentCategoriesData.meta.limit,
                    }}
                    onPaginationChange={handleCategoriesPageChange} />
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        Showing {currentCategoriesData.documents.length} of {currentCategoriesData.total} categories
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {currentCategoriesData.meta.page} of {currentCategoriesData.meta.totalPages}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handleCategoriesPageChange({ pageIndex: 0, pageSize: currentCategoriesData.meta.limit })}
                                disabled={!currentCategoriesData.meta.previousPage}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleCategoriesPageChange({
                                    pageIndex: (currentCategoriesData.meta.previousPage || 1) - 1,
                                    pageSize: currentCategoriesData.meta.limit
                                })}
                                disabled={!currentCategoriesData.meta.previousPage}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleCategoriesPageChange({
                                    pageIndex: (currentCategoriesData.meta.nextPage || 1) - 1,
                                    pageSize: currentCategoriesData.meta.limit
                                })}
                                disabled={!currentCategoriesData.meta.nextPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => handleCategoriesPageChange({
                                    pageIndex: currentCategoriesData.meta.totalPages - 1,
                                    pageSize: currentCategoriesData.meta.limit
                                })}
                                disabled={!currentCategoriesData.meta.nextPage}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent><TabsContent
                value="subcategories"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <DataTable
                    data={subcategoriesData.documents}
                    columns={subcategoryColumns}
                    pagination={{
                        pageIndex: subcategoriesData.meta.page - 1,
                        pageSize: subcategoriesData.meta.limit,
                    }}
                    onPaginationChange={handleSubcategoriesPageChange} />
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        Showing {subcategoriesData.documents.length} of {subcategoriesData.total} subcategories
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {subcategoriesData.meta.page} of {subcategoriesData.meta.totalPages}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handleSubcategoriesPageChange({ pageIndex: 0, pageSize: subcategoriesData.meta.limit })}
                                disabled={!subcategoriesData.meta.previousPage}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleSubcategoriesPageChange({
                                    pageIndex: (subcategoriesData.meta.previousPage || 1) - 1,
                                    pageSize: subcategoriesData.meta.limit
                                })}
                                disabled={!subcategoriesData.meta.previousPage}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleSubcategoriesPageChange({
                                    pageIndex: (subcategoriesData.meta.nextPage || 1) - 1,
                                    pageSize: subcategoriesData.meta.limit
                                })}
                                disabled={!subcategoriesData.meta.nextPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => handleSubcategoriesPageChange({
                                    pageIndex: subcategoriesData.meta.totalPages - 1,
                                    pageSize: subcategoriesData.meta.limit
                                })}
                                disabled={!subcategoriesData.meta.nextPage}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

// Chart data and config temporarily disabled - requires chart library imports
// const chartData = [
//     { month: "January", sales: 186, revenue: 80 },
//     { month: "February", sales: 305, revenue: 200 },
//     { month: "March", sales: 237, revenue: 120 },
//     { month: "April", sales: 73, revenue: 190 },
//     { month: "May", sales: 209, revenue: 130 },
//     { month: "June", sales: 214, revenue: 140 },
// ]
// const chartConfig = {
//     sales: {
//         label: "Sales",
//         color: "var(--primary)",
//     },
//     revenue: {
//         label: "Revenue",
//         color: "var(--primary)",
//     },
// } // satisfies ChartConfig - temporarily disabled

// function ProductCellViewer({ product }: { product: Product }) {
//     const isMobile = useIsMobile()
//     const { categories } = useProductsStore();
//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <Drawer open={isOpen} onOpenChange={setIsOpen}>
//             <DrawerTrigger asChild>
//                 <Button
//                     variant="link"
//                     className="text-foreground w-fit px-0 text-left"
//                     onClick={() => setIsOpen(true)}
//                 >
//                     {product.name}
//                 </Button>
//             </DrawerTrigger>
//             <DrawerContent>
//                 <DrawerHeader className="gap-1">
//                     <DrawerTitle>{product.name}</DrawerTitle>
//                     <DrawerDescription>
//                         Product details and analytics
//                     </DrawerDescription>
//                 </DrawerHeader>
//                 <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//                     {!isMobile && (
//                         <>
//                             <div className="relative aspect-video w-full rounded-lg border">
//                                 <Image
//                                     src={getProductImage(product)}
//                                     alt={product.name}
//                                     fill
//                                     className="h-full w-full object-cover rounded-lg"
//                                 />
//                             </div>
//                             {/* Chart component temporarily disabled - requires chart library imports */}
//                             <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
//                                 <p className="text-gray-500">Chart component not available</p>
//                             </div>
//                             <Separator />
//                             <div className="grid gap-2">
//                                 <div className="flex gap-2 leading-none font-medium">
//                                     Trending up by 5.2% this month{" "}
//                                     <IconTrendingUp className="size-4" />
//                                 </div>
//                                 <div className="text-muted-foreground">
//                                     Product performance over the last 6 months. Sales and revenue metrics show consistent growth.
//                                 </div>
//                             </div>
//                             <Separator />
//                         </>
//                     )}
//                     <form className="flex flex-col gap-4">
//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="name">Product Name</Label>
//                             <Input id="name" defaultValue={product.name} />
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="description">Description</Label>
//                             <Input id="description" defaultValue={product.description} />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="category">Category</Label>
//                                 <Select defaultValue={product.category_data?.name || product.category}>
//                                     <SelectTrigger id="category" className="w-full">
//                                         <SelectValue placeholder="Select a category" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {
//                                             categories?.map((category) => (
//                                                 <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
//                                             ))
//                                         }
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="price">Fallback Price</Label>
//                                 <Input id="price" type="number" step="0.01" defaultValue={product.price} />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="price-ngn">Nigerian Price (₦)</Label>
//                                 <Input id="price-ngn" type="number" step="0.01" defaultValue={product.price_ngn || ''} />
//                             </div>
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="price-ghs">Ghanaian Price (₵)</Label>
//                                 <Input id="price-ghs" type="number" step="0.01" defaultValue={product.price_ghs || ''} />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="stock">Stock</Label>
//                                 <Input id="stock" type="number" defaultValue={product.stock} />
//                             </div>
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="image">Image URL</Label>
//                                 <Input id="image" defaultValue={product.image} />
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//                 <DrawerFooter>
//                     <Button>Save Changes</Button>
//                     <DrawerClose asChild>
//                         <Button variant="outline">Cancel</Button>
//                     </DrawerClose>
//                 </DrawerFooter>
//             </DrawerContent>
//         </Drawer>
//     )
// }