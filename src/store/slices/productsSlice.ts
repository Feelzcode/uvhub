import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, ProductsState } from '../types';

interface ProductsActions {
    // Actions
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    setSelectedProduct: (product: Product | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFilters: (filters: Partial<ProductsState['filters']>) => void;
    clearFilters: () => void;

    // Computed selectors
    getFilteredProducts: () => Product[];
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];
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
};

export const useProductsStore = create<ProductsState & ProductsActions>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Actions
            setProducts: (products) => set({ products, loading: false, error: null }),

            addProduct: (product) =>
                set((state) => ({
                    products: [...state.products, product]
                })),

            updateProduct: (id, updates) =>
                set((state) => ({
                    products: state.products.map((product) =>
                        product.id === id ? { ...product, ...updates, updatedAt: new Date() } : product
                    ),
                })),

            deleteProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((product) => product.id !== id),
                })),

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
                return products.filter((product) => {
                    const matchesCategory = !filters.category || product.category === filters.category;
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

            getProductsByCategory: (category) => {
                const { products } = get();
                return products.filter((product) => product.category === category);
            },
        }),
        {
            name: 'products-store',
        }
    )
); 