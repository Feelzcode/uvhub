'use client'

import * as React from 'react'
import { useSortable } from "@dnd-kit/sortable"
import {
    IconDotsVertical,
    IconGripVertical,
    IconEye,
    IconEdit,
    IconTrash,
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
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Order, OrderItem, useOrdersStore } from "@/store"
import { toast } from "sonner"
import { orderInputSchema, OrderInputType, transformOrderInput } from '@/utils/schema/order'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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

function OrderActions({ order }: { order: Order }) {
    const { deleteOrder, updateOrder, loading } = useOrdersStore();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = React.useState(false);

    const formData = useForm<OrderInputType>({
        defaultValues: {
            status: order.status,
            total: order.total.toString(),
            customer_id: order.customer?.id,
            order_items: order.items?.map((item: OrderItem) => ({
                product_id: item.product?.id,
                quantity: item.quantity.toString(),
                price: item.price.toString(),
            })),
        },
        resolver: zodResolver(orderInputSchema),
    });

    const handleDelete = async () => {
        await deleteOrder(order.id);
        setIsDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        setIsEditDrawerOpen(true);
    };

    const handleSave = async (data: OrderInputType) => {
        try {
            const transformedData = transformOrderInput(data);
            await updateOrder(order.id, transformedData);
            setIsEditDrawerOpen(false);
            toast.success("Order updated successfully");
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to update order");
        }
    };

    const handleView = () => {
        setIsViewDrawerOpen(true);
    }
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
                        Update Order Status
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
                                    This action cannot be undone. This will permanently delete the order with this order id &quot;{order.id}&quot; and remove it from your database.
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
                        <DrawerTitle>Edit Order: {order.id}</DrawerTitle>
                        <DrawerDescription>
                            Update order status
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <form className="flex flex-col gap-4" onSubmit={formData.handleSubmit(handleSave)} id="edit-order-form">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-status">Order Status</Label>
                                <Select {...formData.register('status')}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Order Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formData.formState.errors.status && <p className="text-red-500">{formData.formState.errors.status.message}</p>}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="edit-total">Total</Label>
                                <Input id="edit-total" {...formData.register('total')} />
                                {formData.formState.errors.total && <p className="text-red-500">{formData.formState.errors.total.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="edit-customer-id">Customer ID</Label>
                                    <Input id="edit-customer-id" {...formData.register('customer_id')} />
                                    {formData.formState.errors.customer_id && <p className="text-red-500">{formData.formState.errors.customer_id.message}</p>}
                                </div>
                            </div>
                        </form>
                    </div>
                    <DrawerFooter>
                        <Button type="submit" className="cursor-pointer" form="edit-order-form" disabled={loading}>
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
                        <DrawerTitle>View Order: {order.id}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-status">Order Status</Label>
                            <Input id="view-status" value={order.status} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-total">Total</Label>
                            <Input id="view-total" value={order.total.toString()} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-customer-id">Customer ID</Label>
                            <Input id="view-customer-id" value={order.customer?.id} disabled />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-order-items">Order Items</Label>
                            <div className="space-y-2">
                                {order.items?.map((item: OrderItem, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.product?.name}</p>
                                            <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">₦{item.price.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="view-created-at">Created At</Label>
                            <Input id="view-created-at" value={new Date(order.created_at).toLocaleDateString()} disabled />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

// Product columns
const orderColumns: ColumnDef<Order>[] = [
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
        accessorKey: "status",
        header: "Order Status",
        cell: ({ row }) => {
            return <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.status}
            </Badge>
        },
        enableHiding: false,
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.total.toLocaleString()}
                </Badge>
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
            return <OrderActions order={row.original} />
        },
    },
]

function DataTable<T extends { id: string }>({
    data,
    columns,
    pagination,
    onPaginationChange,
}: {
    data: {
        documents: T[];
        total: number;
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            previousPage: number | null;
            nextPage: number | null;
        };
    };
    columns: ColumnDef<T>[];
    pagination: PaginationState;
    onPaginationChange: (updaterOrValue: Updater<PaginationState> | PaginationState) => void;
}) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data: data.documents,
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

export function OrdersDatatable() {
    const { orders, loading } = useOrdersStore()
    
    // pagination will be done manually here
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    
    const handlePaginationChange = (updaterOrValue: Updater<PaginationState> | PaginationState) => {
        setPagination(updaterOrValue)
    }

    // Create the orders data here
    const ordersData = {
        documents: orders,
        total: orders.length,
        meta: {
            page: pagination.pageIndex,
            limit: pagination.pageSize,
            totalPages: Math.ceil(orders.length / pagination.pageSize),
            previousPage: pagination.pageIndex > 0 ? pagination.pageIndex - 1 : null,
            nextPage: pagination.pageIndex < Math.ceil(orders.length / pagination.pageSize) - 1 ? pagination.pageIndex + 1 : null,
        },
    }

    // if the table is loading show the loading spinner
    if (loading) {
        return <div className="flex items-center justify-center h-full">
            <IconLoader2 className="animate-spin" />
        </div>
    }

    return (
        <DataTable data={ordersData} columns={orderColumns} pagination={pagination} onPaginationChange={handlePaginationChange} />
    )
}