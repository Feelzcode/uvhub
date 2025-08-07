import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Category, Product, Subcategory, ProductImage, ProductsState } from '../types';
import { 
    createProduct, 
    deleteProduct, 
    getAllCategories, 
    getAllProducts, 
    getPaginatedProducts, 
    updateProduct,
    getPaginatedSubcategories,
    getAllSubcategories,
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getProductImages,
    createProductImage,
    updateProductImage,
    deleteProductImage,
    setPrimaryProductImage,
} from '@/app/admin/dashboard/products/actions';
import { toast } from 'sonner';
import { deleteFileFromStorage } from '@/lib/utils';

interface ProductsActions {
    // Actions
    setProducts: (products: Product[]) => void;
    addProduct: (product: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    setSelectedProduct: (product: Product | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFilters: (filters: Partial<ProductsState['filters']>) => void;
    clearFilters: () => void;
    setCategories: (categories: Category[]) => void;
    setSubcategories: (subcategories: Subcategory[]) => void;
    getPaginatedProducts: (page: number, limit: number, search?: string) => Promise<void>;
    getProducts: () => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    // Subcategory actions
    getPaginatedSubcategories: (page: number, limit: number, search?: string) => Promise<void>;
    getAllSubcategories: () => Promise<void>;
    getSubcategoriesByCategory: (categoryId: string) => Promise<Subcategory[]>;
    createSubcategory: (subcategory: Partial<Subcategory>) => Promise<void>;
    updateSubcategory: (id: string, updates: Partial<Subcategory>) => Promise<void>;
    deleteSubcategory: (id: string) => Promise<void>;

    // Product images actions
    getProductImages: (productId: string) => Promise<ProductImage[]>;
    createProductImage: (productImage: Partial<ProductImage>) => Promise<void>;
    updateProductImage: (id: string, updates: Partial<ProductImage>) => Promise<void>;
    deleteProductImage: (id: string) => Promise<void>;
    setPrimaryProductImage: (productId: string, imageId: string) => Promise<void>;

    // Computed selectors
    getFilteredProducts: () => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];
    getProductsBySubcategory: (subcategory: string) => Product[];
    getCategories: () => Promise<void>;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
    filters: {
        category: '',
        subcategory: '',
        minPrice: 0,
        maxPrice: Infinity,
        search: '',
    },
    categories: [],
    subcategories: [],
};

export const useProductsStore = create<ProductsState & ProductsActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Actions
                setProducts: (products) => set({ products, loading: false, error: null }),

                addProduct: async (product) => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await createProduct(product);

                        if (error) throw new Error(error.message);
                        set((state) => ({
                            products: [...state.products, data],
                            loading: false,
                            error: null
                        }))
                        toast.success('Product created successfully', {
                            duration: 5000,
                        });
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to create product' });
                        toast.error('Failed to create product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                updateProduct: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await updateProduct(id, updates as Product);
                        if (error) throw new Error(error.message);
                        set((state) => ({
                            products: state.products.map((product) =>
                                product.id === id ? { ...product, ...data } : product
                            ),
                            loading: false,
                            error: null
                        }))
                        toast.success('Product updated successfully', {
                            duration: 5000,
                        });
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to update product' });
                        toast.error('Failed to update product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                deleteProduct: async (id) => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteProduct(id);
                        if (!success) throw new Error('Failed to delete product');
                        // remove the product image from the storage bucket
                        const product = get().products.find((product) => product.id === id);
                        if (product) {
                            deleteFileFromStorage(product.image);
                        }
                        set((state) => ({
                            products: state.products.filter((product) => product.id !== id),
                            loading: false,
                            error: null
                        }))
                        toast.success('Product deleted successfully', {
                            duration: 5000,
                        });
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to delete product' });
                        toast.error('Failed to delete product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                setSelectedProduct: (product) => set({ selectedProduct: product }),

                setLoading: (loading) => set({ loading }),

                setError: (error) => set({ error, loading: false }),

                setFilters: (filters) =>
                    set((state) => ({
                        filters: { ...state.filters, ...filters },
                    })),

                clearFilters: () => set({ filters: initialState.filters }),

                // Computed selectors
                getFilteredProducts: () => {
                    const { products, filters } = get();

                    if (!products || !Array.isArray(products)) return [];

                    // Only filter if any filter is set
                    const hasActiveFilters =
                        (filters.search && filters.search.trim() !== '') ||
                        (filters.category && filters.category.trim() !== '') ||
                        (filters.subcategory && filters.subcategory.trim() !== '') ||
                        filters.maxPrice !== Infinity ||
                        filters.minPrice !== 0;

                    if (!hasActiveFilters) {
                        return products;
                    }

                    return products.filter((product) => {
                        if (!product) return false;
                        const matchesCategory = !filters.category || product.category?.id === filters.category;
                        const matchesSubcategory = !filters.subcategory || product.subcategory_id === filters.subcategory;
                        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
                        const matchesSearch = !filters.search ||
                            product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                            product.description.toLowerCase().includes(filters.search.toLowerCase());
                        return matchesCategory && matchesSubcategory && matchesPrice && matchesSearch;
                    });
                },

                getProductById: (id) => {
                    const { products } = get();
                    return products.find((product) => product.id === id);
                },

                getProductsByCategory: (category: string) => {
                    const { products } = get();
                    return products.filter((product) => product.category?.id === category);
                },

                getProducts: async () => {
                    set({ loading: true, error: null });
                    try {
                        const products = await getAllProducts();

                        if (!products) {
                            set({ products: [], loading: false, error: 'No products returned from server' });
                            return;
                        }

                        set({ products, loading: false, error: null });
                    }
                    catch (e) {
                        console.error('Error in getProducts:', e);
                        set({ loading: false, error: 'Failed to get products' });
                        toast.error('Failed to get products', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                getPaginatedProducts: async (page, limit, search) => {
                    set({ loading: true, error: null });
                    try {
                        const products = await getPaginatedProducts({ page, limit, search });
                        set({ products: products.documents, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get products' });
                        toast.error('Failed to get products', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        })
                    }
                },

                getCategories: async () => {
                    set({ loading: true, error: null });
                    try {
                        const categories = await getAllCategories();
                        set({ categories, loading: false, error: null });
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to get categories' });
                        toast.error('Failed to get categories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        })
                    }
                },

                setCategories: (categories) => set({ categories }),

                setSubcategories: (subcategories) => set({ subcategories }),

                // Subcategory actions
                getPaginatedSubcategories: async (page, limit, search) => {
                    set({ loading: true, error: null });
                    try {
                        const subcategories = await getPaginatedSubcategories({ page, limit, search });
                        set({ subcategories: subcategories.documents, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get subcategories' });
                        toast.error('Failed to get subcategories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        })
                    }
                },

                getAllSubcategories: async () => {
                    set({ loading: true, error: null });
                    try {
                        const subcategories = await getAllSubcategories();
                        set({ subcategories, loading: false, error: null });
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to get subcategories' });
                        toast.error('Failed to get subcategories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        })
                    }
                },

                getSubcategoriesByCategory: async (categoryId: string) => {
                    try {
                        const subcategories = await getSubcategoriesByCategory(categoryId);
                        return subcategories;
                    }
                    catch (e) {
                        console.error('Failed to get subcategories by category:', e);
                        return [];
                    }
                },

                createSubcategory: async (subcategory) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await createSubcategory(subcategory);
                        if (data) {
                            set((state) => ({
                                subcategories: [...state.subcategories, data],
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory created successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to create subcategory' });
                        toast.error('Failed to create subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                updateSubcategory: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await updateSubcategory(id, updates);
                        if (data) {
                            set((state) => ({
                                subcategories: state.subcategories.map((subcategory) =>
                                    subcategory.id === id ? { ...subcategory, ...data } : subcategory
                                ),
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory updated successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to update subcategory' });
                        toast.error('Failed to update subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                deleteSubcategory: async (id) => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteSubcategory(id);
                        if (success) {
                            set((state) => ({
                                subcategories: state.subcategories.filter((subcategory) => subcategory.id !== id),
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory deleted successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to delete subcategory' });
                        toast.error('Failed to delete subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                // Product images actions
                getProductImages: async (productId: string) => {
                    try {
                        const images = await getProductImages(productId);
                        return images;
                    }
                    catch (e) {
                        console.error('Failed to get product images:', e);
                        return [];
                    }
                },

                createProductImage: async (productImage) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await createProductImage(productImage);
                        if (data) {
                            toast.success('Product image added successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to add product image' });
                        toast.error('Failed to add product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                updateProductImage: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await updateProductImage(id, updates);
                        if (data) {
                            toast.success('Product image updated successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to update product image' });
                        toast.error('Failed to update product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                deleteProductImage: async (id) => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteProductImage(id);
                        if (success) {
                            toast.success('Product image deleted successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to delete product image' });
                        toast.error('Failed to delete product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                setPrimaryProductImage: async (productId, imageId) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await setPrimaryProductImage(productId, imageId);
                        if (data) {
                            toast.success('Primary image updated successfully', {
                                duration: 5000,
                            });
                        }
                    }
                    catch (e) {
                        set({ loading: false, error: 'Failed to set primary image' });
                        toast.error('Failed to set primary image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000,
                        });
                    }
                },

                getProductsBySubcategory: (subcategory: string) => {
                    const { products } = get();
                    return products.filter((product) => product.subcategory_id === subcategory);
                },

                getProduct: (id) => {
                    const { products } = get();
                    return products.find((product) => product.id === id);
                }
            }),
            {
                name: 'products-store',
                storage: createJSONStorage(() => localStorage)
            }
        ),
        {
            name: 'products-store'
        }
    )
); 