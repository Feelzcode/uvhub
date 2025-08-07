'use client'

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import {
    IconDotsVertical,
    IconGripVertical,
    IconStar,
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
    IconTrendingUp,
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileInput } from "@/components/ui/file-input"
import { Product, Category, Customer, Subcategory } from "@/store/types"
import Image from "next/image"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { createCategory, createSubcategory, getPaginatedSubcategories } from "@/app/admin/dashboard/products/actions"
import { toast } from "sonner"
import { useUppyWithSupabase } from "@/hooks/use-uppy-with-supabase"
import { getPublicUrlOfUploadedFile } from "@/lib/utils"
import ProductImageManager from "@/components/ProductImageManager"
import { PaginatedResponse } from "@/store/types"
import { useProductsStore } from "@/store"
import { getPaginatedProducts, getPaginatedCustomers, getPaginatedCategories } from "@/app/admin/dashboard/products/actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productInputSchema, ProductInputType, transformProductInput } from "@/utils/schema"


// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({
        id,
    })
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

// Create a separate component for product actions
function ProductActions({ product }: { product: Product }) {
    const { deleteProduct, updateProduct, loading, getProductImages, createProductImage, updateProductImage, deleteProductImage } = useProductsStore();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);
    const [productImages, setProductImages] = React.useState<any[]>([]);
    const [isLoadingImages, setIsLoadingImages] = React.useState(false);

    const formData = useForm<ProductInputType>({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: product.image,
        },
        resolver: zodResolver(productInputSchema),
    });

    const handleDelete = async () => {
        await deleteProduct(product.id);
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = async () => {
        setIsEditDrawerOpen(true);
        // Load existing product images
        setIsLoadingImages(true);
        try {
            const images = await getProductImages(product.id);
            setProductImages(images);
        } catch (error) {
            console.error('Error loading product images:', error);
        } finally {
            setIsLoadingImages(false);
        }
    };

    const handleSave = async (data: ProductInputType) => {
        try {
            const transformedData = transformProductInput(data);
            await updateProduct(product.id, transformedData);
            
            // Handle product images
            if (productImages.length > 0) {
                // Get existing images to compare
                const existingImages = await getProductImages(product.id);
                
                // Find new images (those with temp IDs)
                const newImages = productImages.filter(img => img.id.startsWith('temp-'));
                
                // Find deleted images
                const deletedImages = existingImages.filter(existing => 
                    !productImages.some(current => current.id === existing.id)
                );
                
                // Delete removed images
                for (const deletedImage of deletedImages) {
                    await deleteProductImage(deletedImage.id);
                }
                
                // Add new images
                for (const newImage of newImages) {
                    await createProductImage({
                        product_id: product.id,
                        image_url: newImage.image_url,
                        alt_text: newImage.alt_text,
                        is_primary: newImage.is_primary,
                        sort_order: newImage.sort_order,
                    });
                }
                
                // Update existing images (for primary status and order changes)
                const existingImagesToUpdate = productImages.filter(img => 
                    !img.id.startsWith('temp-') && existingImages.some(existing => existing.id === img.id)
                );
                
                for (const imageToUpdate of existingImagesToUpdate) {
                    const existingImage = existingImages.find(existing => existing.id === imageToUpdate.id);
                    if (existingImage && (
                        existingImage.is_primary !== imageToUpdate.is_primary ||
                        existingImage.sort_order !== imageToUpdate.sort_order
                    )) {
                        await updateProductImage(imageToUpdate.id, {
                            is_primary: imageToUpdate.is_primary,
                            sort_order: imageToUpdate.sort_order,
                        });
                    }
                }
            }
            
            setIsEditDrawerOpen(false);
            toast.success("Product updated successfully");
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        }
    };

    const handleView = () => {
        setIsViewDrawerOpen(true);
    }

    const handleImagesChange = (images: any[]) => {
        setProductImages(images);
        // Update the main image field with the primary image
        const primaryImage = images.find(img => img.is_primary);
        if (primaryImage) {
            formData.setValue('image', primaryImage.image_url);
        }
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
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                variant="destructive"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <IconTrash className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product &quot;{product.name}&quot; and remove it from your database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Drawer */}
            <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>Edit Product: {product.name}</DrawerTitle>
                        <DrawerDescription>
                            Update product details
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <form className="flex flex-col gap-4" onSubmit={formData.handleSubmit(handleSave)} id="edit-product-form">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-name">Product Name</Label>
                                <Input id="edit-name" {...formData.register('name')} />
                                {formData.formState.errors.name && <p className="text-red-500">{formData.formState.errors.name.message}</p>}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input id="edit-description" {...formData.register('description')} />
                                {formData.formState.errors.description && <p className="text-red-500">{formData.formState.errors.description.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="edit-price">Price</Label>
                                    <Input id="edit-price" type="number" step="0.01" {...formData.register('price')} />
                                    {formData.formState.errors.price && <p className="text-red-500">{formData.formState.errors.price.message}</p>}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input id="edit-stock" type="number" {...formData.register('stock')} />
                                    {formData.formState.errors.stock && <p className="text-red-500">{formData.formState.errors.stock.message}</p>}
                                </div>
                            </div>
                            {isLoadingImages ? (
                                <div className="flex items-center justify-center py-4">
                                    <IconLoader2 className="animate-spin mr-2" />
                                    Loading images...
                                </div>
                            ) : (
                                <ProductImageManager
                                    images={productImages}
                                    onImagesChange={handleImagesChange}
                                    productId={product.id}
                                    maxImages={6}
                                />
                            )}
                            
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-image">Main Image URL (Fallback)</Label>
                                <Input id="edit-image" {...formData.register('image')} />
                                {formData.formState.errors.image && <p className="text-red-500">{formData.formState.errors.image.message}</p>}
                                <p className="text-xs text-muted-foreground">
                                    This will be used as a fallback if no images are uploaded above
                                </p>
                            </div>
                        </form>
                    </div>
                    <DrawerFooter>
                        <Button type="submit" className="cursor-pointer" form="edit-product-form" disabled={loading}>
                            {loading ? <IconLoader2 className="animate-spin" /> : "Save Changes"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* View Drawer */}
            <Drawer open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>View Product: {product.name}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-name">Product Name</Label>
                            <Input id="view-name" value={product.name} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-description">Description</Label>
                            <Input id="view-description" value={product.description} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-price">Price</Label>
                            <Input id="view-price" value={product.price.toString()} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-stock">Stock</Label>
                            <Input id="view-stock" value={product.stock.toString()} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-image">Main Image</Label>
                            <Image src={product.image} alt={product.name} width={100} height={100} />
                        </div>
                        {product.images && product.images.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <Label>All Images ({product.images.length})</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {product.images.map((image, index) => (
                                        <div key={image.id} className="relative">
                                            <Image 
                                                src={image.image_url} 
                                                alt={image.alt_text || `Product image ${index + 1}`} 
                                                width={80} 
                                                height={80}
                                                className="object-cover rounded"
                                            />
                                            {image.is_primary && (
                                                <div className="absolute top-1 right-1">
                                                    <Badge variant="default" className="bg-blue-500 text-xs px-1 py-0">
                                                        <Star className="h-2 w-2 mr-1" />
                                                        Primary
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-category">Category</Label>
                            <Input id="view-category" value={product.category.name} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-created-at">Created At</Label>
                            <Input id="view-created-at" value={new Date(product.created_at).toLocaleDateString()} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-updated-at">Updated At</Label>
                            <Input id="view-updated-at" value={new Date(product.updated_at).toLocaleDateString()} disabled />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

// Product columns
const productColumns: ColumnDef<Product>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
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
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.category.name}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "subcategory",
        header: "Subcategory",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.subcategory ? (
                    <Badge variant="outline" className="text-muted-foreground px-1.5">
                        {row.original.subcategory.name}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "images",
        header: "Images",
        cell: ({ row }) => (
            <div className="w-20">
                {row.original.images && row.original.images.length > 0 ? (
                    <Badge variant="secondary" className="text-xs">
                        {row.original.images.length} image{row.original.images.length !== 1 ? 's' : ''}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-xs">1 image</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: () => <div className="w-full text-right">Price</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                ${row.original.price.toFixed(2)}
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
                    {row.original.stock}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{row.original.rating}</span>
                <span className="text-xs text-muted-foreground">({row.original.reviews})</span>
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
                {row.original.address.street}, {row.original.address.city}
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
        accessorKey: "name",
        header: "Subcategory Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconCategory className="size-4" />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground max-w-xs truncate">
                {row.original.description}
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
        cell: ({ row }) => (
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground max-w-xs truncate">
                {row.original.description}
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
        description: '',
        price: '',
        stock: '',
        category: '',
        subcategory_id: '',
        image: '',
    })
    const [productImages, setProductImages] = React.useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [subcategories, setSubcategories] = React.useState<any[]>([])
    const { categories, addProduct, getSubcategoriesByCategory, createProductImage } = useProductsStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Create the product first
            const product = await addProduct({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category as unknown as Category,
                subcategory_id: formData.subcategory_id || undefined,
                image: formData.image,
                rating: 0,
            });

            // If product was created successfully and we have images, save them
            if (product && productImages.length > 0) {
                for (const image of productImages) {
                    await createProductImage({
                        product_id: product.id,
                        image_url: image.image_url,
                        alt_text: image.alt_text,
                        is_primary: image.is_primary,
                        sort_order: image.sort_order,
                    });
                }
            }

            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImagesChange = (images: any[]) => {
        setProductImages(images);
        // Set the primary image as the main product image
        const primaryImage = images.find(img => img.is_primary);
        if (primaryImage) {
            setFormData(prev => ({ ...prev, image: primaryImage.image_url }));
        }
    };

    const handleCategoryChange = async (categoryId: string) => {
        setFormData(prev => ({ ...prev, category: categoryId, subcategory_id: '' }));
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
                            {categories.map((category) => (
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
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                />
            </div>

            <ProductImageManager
                images={productImages}
                onImagesChange={handleImagesChange}
                maxImages={6}
            />

            <div className="space-y-2">
                <Label htmlFor="image">Main Image URL (Fallback)</Label>
                <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                    This will be used as a fallback if no images are uploaded above
                </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </form>
    )
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
            const subcategory = await createSubcategory({
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id,
            });

            if (subcategory) {
                toast.success('Subcategory created successfully')
                onClose()
            }
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

// Category creation form
function CreateCategoryForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const category = await createCategory({
                name: formData.name,
                description: formData.description,
            });

            if (category) {
                toast.success('Category created successfully')
                onClose()
            }
        } catch (error) {
            console.error('Error creating category:', error)
            toast.error('Failed to create category')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <IconLoader2 className="size-4 animate-spin" />
                            Creating...
                        </div>
                    ) : 'Create Category'}
                </Button>
            </div>
        </form>
    )
}

export function ProductsDataTable({
    productsData,
    customersData,
    categoriesData,
}: {
    productsData: PaginatedResponse<Product>;
    customersData: PaginatedResponse<Customer>;
    categoriesData: PaginatedResponse<Category>;
}) {
    const [activeTab, setActiveTab] = React.useState("products")
    const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] = React.useState(false)
    const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = React.useState(false)
    const [isCreateSubcategoryDialogOpen, setIsCreateSubcategoryDialogOpen] = React.useState(false)
    const [currentProductsData, setCurrentProductsData] = React.useState(productsData)
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

    // Update state when prop changes
    React.useEffect(() => {
        setCurrentProductsData(productsData)
        setCurrentCustomersData(customersData)
        setCurrentCategoriesData(categoriesData)
    }, [productsData, customersData, categoriesData])

    // Internal pagination handlers
    const handleProductsPageChange = React.useCallback(async (updaterOrValue: Updater<PaginationState> | PaginationState) => {
        const pagination = typeof updaterOrValue === 'function' ? updaterOrValue({ pageIndex: 0, pageSize: 10 }) : updaterOrValue
        console.log('Products page change:', pagination)
        // Call the server action directly
        const nextPage = await getPaginatedProducts({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize
        })
        if (nextPage) {
            setCurrentProductsData(nextPage)
        }
    }, [])

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
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="categories">Categories</SelectItem>
                        <SelectItem value="subcategories">Subcategories</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="customers">
                        Customers <Badge variant="secondary">{customersData.total}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="categories">
                        Categories <Badge variant="secondary">{categoriesData.total}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="subcategories">
                        Subcategories <Badge variant="secondary">{subcategoriesData.total}</Badge>
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

                    {activeTab === "categories" && (
                        <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <IconPlus />
                                    <span className="hidden lg:inline">Add Category</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Create New Category</DialogTitle>
                                    <DialogDescription>
                                        Add a new category to organize your products.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto pr-2">
                                    <CreateCategoryForm onClose={() => setIsCreateCategoryDialogOpen(false)} />
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
                </div>
            </div>

            <TabsContent
                value="products"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <DataTable
                    data={currentProductsData.documents}
                    columns={productColumns}
                    pagination={{
                        pageIndex: currentProductsData.meta.page - 1,
                        pageSize: currentProductsData.meta.limit,
                    }}
                    onPaginationChange={handleProductsPageChange}
                />
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        Showing {currentProductsData.documents.length} of {currentProductsData.total} products
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {currentProductsData.meta.page} of {currentProductsData.meta.totalPages}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handleProductsPageChange({ pageIndex: 0, pageSize: currentProductsData.meta.limit })}
                                disabled={!currentProductsData.meta.previousPage}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleProductsPageChange({
                                    pageIndex: (currentProductsData.meta.previousPage || 1) - 1,
                                    pageSize: currentProductsData.meta.limit
                                })}
                                disabled={!currentProductsData.meta.previousPage}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => handleProductsPageChange({
                                    pageIndex: (currentProductsData.meta.nextPage || 1) + 1,
                                    pageSize: currentProductsData.meta.limit
                                })}
                                disabled={!currentProductsData.meta.nextPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => handleProductsPageChange({
                                    pageIndex: currentProductsData.meta.totalPages - 1,
                                    pageSize: currentProductsData.meta.limit
                                })}
                                disabled={!currentProductsData.meta.nextPage}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent
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
                    onPaginationChange={handleCustomersPageChange}
                />
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
            </TabsContent>

            <TabsContent
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
                    onPaginationChange={handleCategoriesPageChange}
                />
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
            </TabsContent>

            <TabsContent
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
                    onPaginationChange={handleSubcategoriesPageChange}
                />
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

const chartData = [
    { month: "January", sales: 186, revenue: 80 },
    { month: "February", sales: 305, revenue: 200 },
    { month: "March", sales: 237, revenue: 120 },
    { month: "April", sales: 73, revenue: 190 },
    { month: "May", sales: 209, revenue: 130 },
    { month: "June", sales: 214, revenue: 140 },
]
const chartConfig = {
    sales: {
        label: "Sales",
        color: "var(--primary)",
    },
    revenue: {
        label: "Revenue",
        color: "var(--primary)",
    },
} satisfies ChartConfig

function ProductCellViewer({ product }: { product: Product }) {
    const isMobile = useIsMobile()
    const { categories } = useProductsStore();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="text-foreground w-fit px-0 text-left"
                    onClick={() => setIsOpen(true)}
                >
                    {product.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{product.name}</DrawerTitle>
                    <DrawerDescription>
                        Product details and analytics
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <div className="relative aspect-video w-full rounded-lg border">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            </div>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Area
                                        dataKey="revenue"
                                        type="natural"
                                        fill="var(--color-revenue)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-revenue)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="sales"
                                        type="natural"
                                        fill="var(--color-sales)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-sales)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month{" "}
                                    <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Product performance over the last 6 months. Sales and revenue metrics show consistent growth.
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" defaultValue={product.name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" defaultValue={product.description} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category">Category</Label>
                                <Select defaultValue={product.category.name}>
                                    <SelectTrigger id="category" className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" step="0.01" defaultValue={product.price} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="stock">Stock</Label>
                                <Input id="stock" type="number" defaultValue={product.stock} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" defaultValue={product.image} />
                            </div>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Save Changes</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}