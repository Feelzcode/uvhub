'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product, ProductVariant, Category } from '@/store/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { useProductsStore } from '@/store';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { 
  getPaginatedProducts, 
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  createVariantImage
} from '@/app/admin/dashboard/products/actions';

interface VariantWithProduct extends ProductVariant {
  product?: Product;
  category?: Category;
}

export default function VariantsOverview() {
  const [variants, setVariants] = useState<VariantWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedVariant, setSelectedVariant] = useState<VariantWithProduct | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<VariantWithProduct | null>(null);

  const { categories: storeCategories } = useProductsStore();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load products with variants
      const productsResponse = await getPaginatedProducts({ page: 1, limit: 1000 });
      const productsWithVariants = productsResponse.documents;
      
      // Load variants for each product
      const allVariants: VariantWithProduct[] = [];
      for (const product of productsWithVariants) {
        const productVariants = await getProductVariants(product.id);
        const variantsWithProduct = productVariants.map(variant => ({
          ...variant,
          product,
          category: product.category_data
        }));
        allVariants.push(...variantsWithProduct);
      }
      
      setVariants(allVariants);
      setProducts(productsWithVariants);
      setCategories(storeCategories);
    } catch (error) {
      console.error('Error loading variants data:', error);
      toast.error('Failed to load variants data');
    } finally {
      setLoading(false);
    }
  }, [storeCategories]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter variants based on search and filters
  const filteredVariants = variants.filter(variant => {
    const matchesSearch = 
      variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || variant.category?.id === selectedCategory;
    const matchesProduct = selectedProduct === 'all' || variant.product?.id === selectedProduct;
    
    return matchesSearch && matchesCategory && matchesProduct;
  });

  // Get variant status
  const getVariantStatus = (variant: ProductVariant) => {
    if (!variant.is_active) return { label: 'Inactive', variant: 'destructive' as const };
    if (variant.stock <= 0) return { label: 'Out of Stock', variant: 'secondary' as const };
    if (variant.stock < 10) return { label: 'Low Stock', variant: 'outline' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  // Get variant price display
  const getVariantPrice = (variant: ProductVariant) => {
    if (variant.price_ngn) return `₦${variant.price_ngn.toFixed(2)}`;
    if (variant.price_ghs) return `₵${variant.price_ghs.toFixed(2)}`;
    if (variant.price) return `$${variant.price.toFixed(2)}`;
    return 'No price set';
  };

  // Handle variant actions
  const handleViewVariant = (variant: VariantWithProduct) => {
    setSelectedVariant(variant);
    setIsViewModalOpen(true);
  };

  const handleEditVariant = (variant: VariantWithProduct) => {
    setSelectedVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleDeleteVariant = async () => {
    if (!variantToDelete) return;

    try {
      await deleteProductVariant(variantToDelete.id);
      setVariants(prev => prev.filter(v => v.id !== variantToDelete.id));
      toast.success('Variant deleted successfully');
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    } finally {
      setIsDeleteDialogOpen(false);
      setVariantToDelete(null);
    }
  };

  const openDeleteDialog = (variant: VariantWithProduct) => {
    setVariantToDelete(variant);
    setIsDeleteDialogOpen(true);
  };

  // Calculate summary statistics
  const totalVariants = variants.length;
  const activeVariants = variants.filter(v => v.is_active).length;
  const outOfStockVariants = variants.filter(v => v.stock <= 0).length;
  const lowStockVariants = variants.filter(v => v.stock > 0 && v.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Variants Management</h1>
          <p className="text-muted-foreground">
            Manage product variants, pricing, and inventory across all products
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVariants}</div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Variants</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVariants}</div>
            <p className="text-xs text-muted-foreground">
              Available for purchase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockVariants}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockVariants}</div>
            <p className="text-xs text-muted-foreground">
              Below 10 units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Variants</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={loadData} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

             {/* Variants Table */}
       <Card>
         <CardHeader>
           <div className="flex items-center justify-between">
             <CardTitle>Product Variants</CardTitle>
             <Button onClick={() => setIsCreateModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Variant
             </Button>
           </div>
         </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading variants...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchTerm || selectedCategory !== 'all' || selectedProduct !== 'all' 
                            ? 'No variants match your filters' 
                            : 'No variants found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVariants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{variant.name}</div>
                            {variant.description && (
                              <div className="text-sm text-muted-foreground">
                                {variant.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {variant.product?.name || 'Unknown Product'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {variant.category?.name || 'Unknown Category'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Variant Images */}
                            {variant.images && variant.images.length > 0 ? (
                              <div className="flex items-center gap-1">
                                {variant.images.slice(0, 3).map((image, index) => (
                                  <div key={index} className="relative w-8 h-8 overflow-hidden rounded border">
                                    <Image
                                      src={image.image_url}
                                      alt={image.alt_text || `Variant ${index + 1}`}
                                      fill
                                      className="object-cover"
                                      sizes="32px"
                                    />
                                    {image.is_primary && (
                                      <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tl">
                                        ★
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {variant.images.length > 3 && (
                                  <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                    <span className="text-xs text-gray-500">
                                      +{variant.images.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : variant.image_url ? (
                              <div className="relative w-8 h-8 overflow-hidden rounded border">
                                <Image
                                  src={variant.image_url}
                                  alt={variant.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                <span className="text-xs text-gray-500">No</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">
                            {variant.sku || 'No SKU'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {getVariantPrice(variant)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {variant.stock}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getVariantStatus(variant).variant}>
                            {getVariantStatus(variant).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewVariant(variant)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVariant(variant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(variant)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Variant Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>View Variant: {selectedVariant?.name}</DialogTitle>
            <DialogDescription>
              Detailed information about this variant
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            {selectedVariant && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Variant Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{selectedVariant.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">SKU:</span>
                        <span className="text-sm font-medium">{selectedVariant.sku || 'No SKU'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Stock:</span>
                        <span className="text-sm font-medium">{selectedVariant.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={getVariantStatus(selectedVariant).variant}>
                          {getVariantStatus(selectedVariant).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Nigeria (₦):</span>
                        <span className="text-sm font-medium">
                          {selectedVariant.price_ngn ? `₦${selectedVariant.price_ngn.toFixed(2)}` : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ghana (₵):</span>
                        <span className="text-sm font-medium">
                          {selectedVariant.price_ghs ? `₵${selectedVariant.price_ghs.toFixed(2)}` : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fallback ($):</span>
                        <span className="text-sm font-medium">
                          {selectedVariant.price ? `$${selectedVariant.price.toFixed(2)}` : 'Not set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variant Images */}
                {(selectedVariant.images && selectedVariant.images.length > 0) || selectedVariant.image_url ? (
                  <div>
                    <h3 className="font-medium mb-2">Variant Images</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {selectedVariant.images && selectedVariant.images.length > 0 ? (
                        selectedVariant.images.map((image, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                              src={image.image_url}
                              alt={image.alt_text || `Variant image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 25vw, 20vw"
                            />
                            {image.is_primary && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={selectedVariant.image_url!}
                            alt={selectedVariant.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vw, 20vw"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium mb-2">Variant Images</h3>
                    <p className="text-sm text-muted-foreground">No images available for this variant</p>
                  </div>
                )}

                {selectedVariant.description && (
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedVariant.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Product:</span>
                      <span className="text-sm font-medium">{selectedVariant.product?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <span className="text-sm font-medium">{selectedVariant.category?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

             {/* Edit Variant Modal */}
       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
           <DialogHeader>
             <DialogTitle>Edit Variant: {selectedVariant?.name}</DialogTitle>
             <DialogDescription>
               Update variant information and settings
             </DialogDescription>
           </DialogHeader>
           
           <div className="flex-1 overflow-y-auto p-6">
             {selectedVariant && (
               <EditVariantForm
                 variant={selectedVariant}
                 onClose={() => setIsEditModalOpen(false)}
                 onSuccess={(updatedVariant) => {
                   // Update the local variants state
                   setVariants(prev => prev.map(v => 
                     v.id === updatedVariant.id ? updatedVariant : v
                   ));
                   setSelectedVariant(updatedVariant);
                   setIsEditModalOpen(false);
                   toast.success('Variant updated successfully');
                 }}







               />
             )}
           </div>
         </DialogContent>
       </Dialog>

       {/* Create Variant Modal */}
       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
           <DialogHeader>
             <DialogTitle>Create New Variant</DialogTitle>
             <DialogDescription>
               Add a new variant to an existing product
             </DialogDescription>
           </DialogHeader>
           
           <div className="flex-1 overflow-y-auto p-6">
             <CreateVariantForm
               onClose={() => setIsCreateModalOpen(false)}
               onSuccess={(newVariant) => {
                 // Add the new variant to the local state
                 setVariants(prev => [...prev, newVariant]);
                 setIsCreateModalOpen(false);
                 toast.success('Variant created successfully');
               }}
               products={products}
               categories={categories}
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
  onClose: () => void;
  onSuccess: (variant: VariantWithProduct) => void;
  products: Product[];
  categories: Category[];
}

function CreateVariantForm({ 
  onClose, 
  onSuccess, 
  products, 
  categories 
}: CreateVariantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price_ngn: 0,
    price_ghs: 0,
    stock: 0,
    description: '',
    is_active: true,
    product_id: '',
    category_id: ''
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
    if (!formData.product_id) {
      console.error('❌ Product ID is missing in form submission');
      toast.error('Please select a product before creating a variant');
      return;
    }
    
    if (!formData.category_id) {
      console.error('❌ Category ID is missing in form submission');
      toast.error('Please select a category before creating a variant');
      return;
    }
    
    setIsSubmitting(true);

    // Debug logging
    console.log('🔍 Form data before variant creation:', formData);
    console.log('🔍 Product ID from form:', formData.product_id);
    console.log('🔍 Category ID from form:', formData.category_id);

    try {
      // Create the variant
      const variant = await createProductVariant({
        product_id: formData.product_id,
        category_id: formData.category_id,
        name: formData.name,
        sku: formData.sku || `${formData.name}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-'),
        price: 0,
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
            for (const imageUrl of uploadedImageUrls) {
              const imageData = {
                variant_id: variant.id,
                product_id: formData.product_id,
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
        
        // Find the product and category for the new variant
        const product = products.find(p => p.id === formData.product_id);
        const category = categories.find(c => c.id === formData.category_id);
        
        const newVariantWithProduct: VariantWithProduct = {
          ...variant,
          product,
          category
        };
        
        toast.success(`Variant "${formData.name}" created successfully!`);
        onSuccess(newVariantWithProduct);
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

  const handleProductChange = (productId: string) => {
    console.log('🔍 handleProductChange called with productId:', productId);
    const product = products.find(p => p.id === productId);
    console.log('🔍 Found product:', product);
    setFormData(prev => ({ 
      ...prev, 
      product_id: productId,
      category_id: product?.category || ''
    }));
    console.log('🔍 Form data updated with product_id:', productId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Selection */}
      <div className="space-y-2">
        <Label htmlFor="product-select">Product *</Label>
        <Select value={formData.product_id} onValueChange={handleProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category-select">Category *</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
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
        <Button type="submit" disabled={isSubmitting || uploadProgress.isUploading || !formData.product_id || !formData.category_id}>
          {isSubmitting ? 'Creating...' : 'Create Variant'}
        </Button>
      </div>
         </form>
   );
 }

// Edit Variant Form Component
interface EditVariantFormProps {
  variant: VariantWithProduct;
  onClose: () => void;
  onSuccess: (variant: VariantWithProduct) => void;
}

function EditVariantForm({ 
  variant, 
  onClose, 
  onSuccess 
}: EditVariantFormProps) {
  const [formData, setFormData] = useState({
    name: variant.name,
    sku: variant.sku || '',
    price_ngn: variant.price_ngn || 0,
    price_ghs: variant.price_ghs || 0,
    stock: variant.stock,
    description: variant.description || '',
    is_active: variant.is_active
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(variant.images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImagePrimary, setNewImagePrimary] = useState<string | null>(null);
  
  // Initialize Cloudinary for image uploads
  const { uploadFiles, uploadProgress } = useCloudinaryUpload({ 
    folder: 'variants',
    callbacks: {
      onStart: () => toast.info('Starting image upload...'),
      onSuccess: (files) => {
        const urls = files.map((file: { secure_url: string }) => file.secure_url).filter(Boolean);
        setUploadedImageUrls(prev => [...prev, ...urls]);
        toast.success(`${urls.length} image(s) uploaded successfully`);
      },
      onError: (error) => toast.error(`Upload failed: ${error.message}`),
    }
  });

  // Helper functions for image management
  const handleImageUpload = async (files: FileList) => {
    try {
      toast.info(`Uploading ${files.length} image(s)...`);
      await uploadFiles(Array.from(files));
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleRemoveNewImage = (imageUrl: string) => {
    setUploadedImageUrls(prev => prev.filter(url => url !== imageUrl));
  };

  const handleSetPrimaryImage = (imageId: string) => {
    setExistingImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
  };

  const handleSetNewPrimaryImage = (imageUrl: string) => {
    setNewImagePrimary(imageUrl);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const reorderedImages = [...existingImages];
    const [movedImage] = reorderedImages.splice(fromIndex, 1);
    reorderedImages.splice(toIndex, 0, movedImage);
    
    // Update sort order
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      sort_order: index
    }));
    
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update the variant basic information
      const updatedVariant = await updateProductVariant(variant.id, formData);
      if (!updatedVariant) {
        throw new Error('Failed to update variant');
      }

      // Handle image management
      try {
        // Delete images marked for deletion
        if (imagesToDelete.length > 0) {
          // Note: You'll need to implement deleteVariantImage function in actions
          // For now, we'll just log this
          console.log('Images to delete:', imagesToDelete);
          toast.info(`${imagesToDelete.length} image(s) marked for deletion`);
        }

                 // Add new uploaded images
         if (uploadedImageUrls.length > 0) {
           for (const imageUrl of uploadedImageUrls) {
             const imageData = {
               variant_id: variant.id,
               product_id: variant.product_id,
               image_url: imageUrl,
               alt_text: `${formData.name} variant image`,
               is_primary: existingImages.length === 0 && imageUrl === newImagePrimary,
               sort_order: existingImages.length + uploadedImageUrls.indexOf(imageUrl)
             };
             
             await createVariantImage(imageData);
           }
           toast.success(`${uploadedImageUrls.length} new image(s) added successfully!`);
         }

        // Update existing images (reorder, change primary, etc.)
        // This would require additional functions to update image metadata
        // For now, we'll just log this
        if (existingImages.length > 0) {
          console.log('Existing images updated:', existingImages);
        }

      } catch (imageError) {
        console.error('Error managing variant images:', imageError);
        toast.warning('Variant updated but there was an issue managing images');
      }

             // Create the updated variant object with new images
       const updatedVariantWithProduct: VariantWithProduct = {
         ...updatedVariant,
         product: variant.product,
         category: variant.category,
         images: [
           ...existingImages.filter(img => !imagesToDelete.includes(img.id)),
           ...uploadedImageUrls.map((url, index) => ({
             id: `temp-${Date.now()}-${index}`,
             variant_id: variant.id,
             product_id: variant.product_id,
             image_url: url,
             alt_text: `${formData.name} variant image`,
             is_primary: existingImages.length === 0 && url === newImagePrimary,
             sort_order: existingImages.length + index,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           }))
         ]
       };

      onSuccess(updatedVariantWithProduct);
      toast.success('Variant updated successfully!');
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Variant Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Variant Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Small, Red, Premium"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-sku">SKU</Label>
          <Input
            id="edit-sku"
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            placeholder="Stock keeping unit"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-price-ngn">Nigeria Price (₦)</Label>
          <Input
            id="edit-price-ngn"
            type="number"
            step="0.01"
            value={formData.price_ngn}
            onChange={(e) => setFormData(prev => ({ ...prev, price_ngn: parseFloat(e.target.value) || 0 }))}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-price-ghs">Ghana Price (₵)</Label>
          <Input
            id="edit-price-ghs"
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
          <Label htmlFor="edit-stock">Stock *</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-active">Active</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="edit-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="edit-active" className="text-sm">Available for purchase</Label>
          </div>
        </div>
      </div>

             <div className="space-y-2">
         <Label htmlFor="edit-description">Description</Label>
         <Textarea
           id="edit-description"
           value={formData.description}
           onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
           placeholder="Optional description for this variant"
           rows={3}
         />
       </div>

       {/* Image Management */}
       <div className="space-y-4">
         <Label>Variant Images</Label>
         
         {/* Image Summary */}
         <div className="bg-gray-50 p-3 rounded-lg">
           <div className="flex items-center justify-between text-sm">
             <span className="text-gray-600">
               Total Images: {existingImages.length + uploadedImageUrls.length}
             </span>
             <span className="text-gray-600">
               {existingImages.filter(img => img.is_primary).length + (newImagePrimary ? 1 : 0)} Primary
             </span>
           </div>
           {imagesToDelete.length > 0 && (
             <div className="mt-2 text-sm text-red-600">
               {imagesToDelete.length} image(s) marked for deletion
             </div>
           )}
         </div>
         
         {/* Existing Images */}
         {existingImages.length > 0 && (
           <div className="space-y-3">
             <h4 className="text-sm font-medium text-gray-700">Current Images</h4>
             <div className="grid grid-cols-3 gap-3">
               {existingImages.map((image, index) => (
                 <div key={image.id} className="relative group">
                   <div className="aspect-square overflow-hidden rounded-lg border">
                     <Image
                       src={image.image_url}
                       alt={image.alt_text || `Variant image ${index + 1}`}
                       fill
                       className="object-cover"
                       sizes="(max-width: 768px) 25vw, 20vw"
                     />
                   </div>
                   
                                        {/* Image Controls */}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                       <div className="flex gap-1 flex-col">
                         <div className="flex gap-1">
                           <Button
                             type="button"
                             size="sm"
                             variant="secondary"
                             onClick={() => handleSetPrimaryImage(image.id)}
                             disabled={image.is_primary}
                             className="h-6 w-6 p-0 text-xs"
                           >
                             {image.is_primary ? '★' : '☆'}
                           </Button>
                           <Button
                             type="button"
                             size="sm"
                             variant="destructive"
                             onClick={() => handleRemoveExistingImage(image.id)}
                             className="h-6 w-6 p-0 text-xs"
                           >
                             ×
                           </Button>
                         </div>
                         <div className="flex gap-1">
                           <Button
                             type="button"
                             size="sm"
                             variant="outline"
                             onClick={() => handleReorderImages(index, Math.max(0, index - 1))}
                             disabled={index === 0}
                             className="h-6 w-6 p-0 text-xs"
                           >
                             ↑
                           </Button>
                           <Button
                             type="button"
                             size="sm"
                             variant="outline"
                             onClick={() => handleReorderImages(index, Math.min(existingImages.length - 1, index + 1))}
                             disabled={index === existingImages.length - 1}
                             className="h-6 w-6 p-0 text-xs"
                           >
                             ↓
                           </Button>
                         </div>
                       </div>
                     </div>
                   
                   {/* Primary Badge */}
                   {image.is_primary && (
                     <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                       Primary
                     </div>
                   )}
                   
                   {/* Order Badge */}
                   <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                     {index + 1}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* New Image Upload */}
         <div className="space-y-3">
           <h4 className="text-sm font-medium text-gray-700">Add New Images</h4>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
             <input
               type="file"
               multiple
               accept="image/*"
               onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
               className="hidden"
               id="edit-variant-images"
               disabled={uploadProgress.isUploading}
             />
             <label 
               htmlFor="edit-variant-images"
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
                 {uploadProgress.isUploading ? 'Uploading...' : 'Click to upload new images'}
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
           
           {/* New Uploaded Images Preview */}
           {uploadedImageUrls.length > 0 && (
             <div className="mt-4">
               <p className="text-sm font-medium mb-2">
                 New Images ({uploadedImageUrls.length})
               </p>
               <div className="grid grid-cols-3 gap-3">
                 {uploadedImageUrls.map((url, index) => (
                   <div key={index} className="relative group">
                     <div className="aspect-square overflow-hidden rounded-lg border">
                       <Image
                         src={url}
                         alt={`New variant image ${index + 1}`}
                         fill
                         className="object-cover"
                         sizes="(max-width: 768px) 25vw, 20vw"
                       />
                     </div>
                     
                     {/* Image Controls */}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                       <div className="flex gap-2">
                         <Button
                           type="button"
                           size="sm"
                           variant="secondary"
                           onClick={() => handleSetNewPrimaryImage(url)}
                           className="h-8 w-8 p-0"
                         >
                           {newImagePrimary === url ? '★' : '☆'}
                         </Button>
                         <Button
                           type="button"
                           size="sm"
                           variant="destructive"
                           onClick={() => handleRemoveNewImage(url)}
                           className="h-8 w-8 p-0"
                         >
                           ×
                         </Button>
                       </div>
                     </div>
                     
                     {/* Primary Badge */}
                     {newImagePrimary === url && (
                       <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                         Primary
                       </div>
                     )}
                     
                     {/* Order Badge */}
                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                       {existingImages.length + index + 1}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>
       </div>

       {/* Action Buttons */}
       <div className="flex justify-end space-x-2 pt-4">
         <Button type="button" variant="outline" onClick={onClose}>
           Cancel
         </Button>
         <Button type="submit" disabled={isSubmitting || uploadProgress.isUploading}>
           {isSubmitting ? 'Updating...' : 'Update Variant'}
         </Button>
       </div>
    </form>
  );
}
