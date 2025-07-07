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
import { Product, Category, Customer } from "@/store/types"
import Image from "next/image"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { createCategory } from "@/app/admin/dashboard/products/actions"
import { toast } from "sonner"
import { useUppyWithSupabase } from "@/hooks/use-uppy-with-supabase"
import { getPublicUrlOfUploadedFile } from "@/lib/utils"
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
import { productSchema, ProductSchemaType } from "@/utils/schema"


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
    const { deleteProduct, updateProduct, loading } = useProductsStore();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const formData = useForm<ProductSchemaType>({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
        },
        resolver: zodResolver(productSchema),
    });

    const handleDelete = async () => {
        await deleteProduct(product.id);
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        setIsEditDrawerOpen(true);
    };

    const handleSave = async (data: ProductSchemaType) => {
        try {
            await updateProduct(product.id, data);
            setIsEditDrawerOpen(false);
            toast.success("Product updated successfully");
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update product");
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
                    <DropdownMenuItem>
                        <IconEye className="mr-2 size-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        <IconEdit className="mr-2 size-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
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
                                <Input id="edit-name" {...formData.register('name')} defaultValue={product.name} />
                                {formData.formState.errors.name && <p className="text-red-500">{formData.formState.errors.name.message}</p>}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input id="edit-description" {...formData.register('description')} defaultValue={product.description} />
                                {formData.formState.errors.description && <p className="text-red-500">{formData.formState.errors.description.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="edit-price">Price</Label>
                                    <Input id="edit-price" type="number" step="0.01" {...formData.register('price')} defaultValue={product.price} />
                                    {formData.formState.errors.price && <p className="text-red-500">{formData.formState.errors.price.message}</p>}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input id="edit-stock" type="number" {...formData.register('stock')} defaultValue={product.stock} />
                                    {formData.formState.errors.stock && <p className="text-red-500">{formData.formState.errors.stock.message}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-image">Image URL</Label>
                                <Input id="edit-image" {...formData.register('image')} defaultValue={product.image} />
                                {formData.formState.errors.image && <p className="text-red-500">{formData.formState.errors.image.message}</p>}
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
        image: '',
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const uppy = useUppyWithSupabase({ bucketName: 'file-bucket', folderName: 'products' });
    const { categories, addProduct } = useProductsStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Here you would call your API to create the product
            await addProduct({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category as unknown as Category,
                image: formData.image,
                rating: 0,
            });

            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = async (files: FileList | null) => {
        if (files) {
            uppy.addFile(files[0])
            const response = await uppy.upload();
            const uploadedFile = response?.successful?.map((file) => getPublicUrlOfUploadedFile(file.meta.objectName as string))[0];
            setFormData(prev => ({ ...prev, image: uploadedFile ?? '' }))
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
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label>Product Image</Label>
                <FileInput
                    onFileChange={handleFileChange}
                    accept="image/*"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                >
                    <p className="text-xs text-muted-foreground">
                        Upload product image (PNG, JPG, GIF up to 5MB)
                    </p>
                </FileInput>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image URL (Alternative)</Label>
                <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </DialogFooter>
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

            <DialogFooter>
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
            </DialogFooter>
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
    const [currentProductsData, setCurrentProductsData] = React.useState(productsData)
    const [currentCustomersData, setCurrentCustomersData] = React.useState(customersData)
    const [currentCategoriesData, setCurrentCategoriesData] = React.useState(categoriesData)

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
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Product</DialogTitle>
                                    <DialogDescription>
                                        Add a new product to your inventory. Fill in all the required fields.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateProductForm onClose={() => setIsCreateProductDialogOpen(false)} />
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
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Category</DialogTitle>
                                    <DialogDescription>
                                        Add a new category to organize your products.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateCategoryForm onClose={() => setIsCreateCategoryDialogOpen(false)} />
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