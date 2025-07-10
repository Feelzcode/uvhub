import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Category, Product, ProductsState } from '../types';
import { createProduct, deleteProduct, getAllCategories, getAllProducts, getPaginatedProducts, updateProduct } from '@/app/admin/dashboard/products/actions';
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
    getPaginatedProducts: (page: number, limit: number, search?: string) => Promise<void>;
    getProducts: () => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    // Computed selectors
    getFilteredProducts: () => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];
    getCategories: () => Promise<void>;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
    filters: {
        category: '',
        minPrice: 0,
        maxPrice: Infinity,
        search: '',
    },
    categories: [],
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
                        filters.maxPrice !== Infinity ||
                        filters.minPrice !== 0;

                    if (!hasActiveFilters) {
                        return products;
                    }

                    return products.filter((product) => {
                        if (!product) return false;
                        const matchesCategory = !filters.category || product.category === filters.category as unknown as Category;
                        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
                        const matchesSearch = !filters.search ||
                            product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                            product.description.toLowerCase().includes(filters.search.toLowerCase());
                        return matchesCategory && matchesPrice && matchesSearch;
                    });
                },

                getProductById: (id) => {
                    const { products } = get();
                    return products.find((product) => product.id === id);
                },

                getProductsByCategory: (category: string) => {
                    const { products } = get();
                    return products.filter((product) => product.category === category as unknown as Category);
                },

                getProducts: async () => {
                    set({ loading: true, error: null });
                    try {
                        const products = await getAllProducts();
                        console.log('Products fetched:', products);
                        console.log('Products type:', typeof products);
                        console.log('Products length:', products?.length);

                        if (!products) {
                            console.error('getAllProducts returned null/undefined');
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