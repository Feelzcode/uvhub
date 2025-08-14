import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Category, ProductType, Subcategory, ProductImage, ProductsState, Product, ProductVariant } from '../types';
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories, 
    getAllProducts, 
    getPaginatedProducts, 
    updateCategory,
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
    createProduct,
    updateProduct,
    deleteProduct,
    createProductType,
    updateProductType,
    deleteProductType,
    getProductVariants,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    getVariantImages,
    createVariantImage,
} from '@/app/admin/dashboard/products/actions';
import { toast } from 'sonner';
import { deleteFileFromStorage } from '@/lib/utils';

interface ProductsActions {
    // Actions
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Partial<Category>) => Promise<void>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    setSelectedCategory: (category: Category | null) => void;
    setSelectedType: (type: ProductType | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFilters: (filters: Partial<ProductsState['filters']>) => void;
    clearFilters: () => void;
    setSubcategories: (subcategories: Subcategory[]) => void;
    getCategoryById: (id: string) => Promise<Category | undefined>;
    getCategories: () => Promise<void>;

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
    getFilteredCategories: () => Category[];
    getCategoriesByFilter: (filter: string) => Category[];
    getSubcategories: () => Promise<void>;

    // Product actions
    getProducts: () => Promise<void>;
    addProduct: (product: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Product type actions
    createProductType: (productType: Partial<ProductType>) => Promise<void>;
    updateProductType: (id: string, updates: Partial<ProductType>) => Promise<void>;
    deleteProductType: (id: string) => Promise<void>;

    // Product variant actions
    getProductVariants: (productId: string) => Promise<ProductVariant[]>;
    createProductVariant: (variant: Partial<ProductVariant>) => Promise<ProductVariant | null>;
    updateProductVariant: (id: string, updates: Partial<ProductVariant>) => Promise<ProductVariant | null>;
    deleteProductVariant: (id: string) => Promise<boolean>;

    // Variant image actions
    getVariantImages: (variantId: string) => Promise<ProductImage[]>;
    createVariantImage: (variantImage: Partial<ProductImage>) => Promise<ProductImage | null>;
}

const initialState: ProductsState = {
    products: [],
    categories: [],
    loading: false,
    error: null,
    selectedCategory: null,
    selectedType: null,
    filters: {
        category: '',
        subcategory: '',
        minPrice: 0,
        maxPrice: Infinity,
        search: '',
    },
    subcategories: [],
};

export const useProductsStore = create<ProductsState & ProductsActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setCategories: categories => set({ categories, loading: false, error: null }),

                addCategory: async category => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await createCategory(category);
                        if (error) throw new Error(error.message);
                        set(state => ({
                            categories: [...state.categories, data],
                            loading: false,
                            error: null
                        }));
                        toast.success('Category created successfully', { duration: 5000 });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to create category' });
                        toast.error('Failed to create category', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                updateCategory: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await updateCategory(id, updates as Category);
                        if (error) throw new Error(error.message);
                        set(state => ({
                            categories: state.categories.map(category =>
                                category.id === id ? { ...category, ...data } : category
                            ),
                            loading: false,
                            error: null
                        }));
                        toast.success('Category updated successfully', { duration: 5000 });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to update category' });
                        toast.error('Failed to update category', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                deleteCategory: async id => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteCategory(id);
                        if (!success) throw new Error('Failed to delete category');
                        set(state => ({
                            categories: state.categories.filter(category => category.id !== id),
                            loading: false,
                            error: null
                        }));
                        toast.success('Category deleted successfully', { duration: 5000 });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to delete category' });
                        toast.error('Failed to delete category', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                setSelectedCategory: category => set({ selectedCategory: category }),
                setSelectedType: type => set({ selectedType: type }),
                setLoading: loading => set({ loading }),
                setError: error => set({ error, loading: false }),
                setFilters: filters => set(state => ({
                    filters: { ...state.filters, ...filters }
                })),
                clearFilters: () => set({ filters: initialState.filters }),

                getFilteredCategories: () => {
                    const { categories, filters } = get();
                    if (!categories || !Array.isArray(categories)) return [];
                    const hasActiveFilters =
                        (filters.search && filters.search.trim() !== '') ||
                        (filters.category && filters.category.trim() !== '') ||
                        (filters.subcategory && filters.subcategory.trim() !== '') ||
                        filters.maxPrice !== Infinity ||
                        filters.minPrice !== 0;
                    if (!hasActiveFilters) return categories;
                    return categories.filter(category => {
                        if (!category) return false;
                        const matchesCategory = !filters.category || category.name.toLowerCase().includes(filters.category.toLowerCase());
                        const matchesSubcategory = !filters.subcategory || category.subcategories.some((sub: { name: string }) => sub.name.toLowerCase().includes(filters.subcategory.toLowerCase()));
                        const matchesSearch = !filters.search || category.name.toLowerCase().includes(filters.search.toLowerCase());
                        return matchesCategory && matchesSubcategory && matchesSearch;
                    });
                },

                getCategoryById: async id => {
                    const { categories } = get();
                    return categories.find(category => category.id === id) || undefined;
                },

                getCategoriesByFilter: filter => {
                    const { categories } = get();
                    return categories.filter(category => category.name.toLowerCase().includes(filter.toLowerCase()));
                },

                getSubcategories: async () => {
                    set({ loading: true, error: null });
                    try {
                        const subcategories = await getAllSubcategories();
                        set({ subcategories, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get subcategories' });
                        toast.error('Failed to get subcategories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                setSubcategories: subcategories => set({ subcategories }),

                getPaginatedSubcategories: async (page, limit, search) => {
                    set({ loading: true, error: null });
                    try {
                        const subcategories = await getPaginatedSubcategories({ page, limit, search });
                        set({ subcategories: subcategories.documents, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get subcategories' });
                        toast.error('Failed to get subcategories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                getAllSubcategories: async () => {
                    set({ loading: true, error: null });
                    try {
                        const subcategories = await getAllSubcategories();
                        set({ subcategories, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get subcategories' });
                        toast.error('Failed to get subcategories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                getSubcategoriesByCategory: async (categoryId: string) => {
                    try {
                        return await getSubcategoriesByCategory(categoryId);
                    } catch (e) {
                        console.error('Failed to get subcategories by category:', e);
                        return [];
                    }
                },

                createSubcategory: async subcategory => {
                    set({ loading: true, error: null });
                    try {
                        const data = await createSubcategory(subcategory);
                        if (data) {
                            set(state => ({
                                subcategories: [...state.subcategories, data],
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory created successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to create subcategory' });
                        toast.error('Failed to create subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                updateSubcategory: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await updateSubcategory(id, updates);
                        if (data) {
                            set(state => ({
                                subcategories: state.subcategories.map(subcategory =>
                                    subcategory.id === id ? { ...subcategory, ...data } : subcategory
                                ),
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory updated successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to update subcategory' });
                        toast.error('Failed to update subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                deleteSubcategory: async id => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteSubcategory(id);
                        if (success) {
                            set(state => ({
                                subcategories: state.subcategories.filter(subcategory => subcategory.id !== id),
                                loading: false,
                                error: null
                            }));
                            toast.success('Subcategory deleted successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to delete subcategory' });
                        toast.error('Failed to delete subcategory', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                getProductImages: async (productId: string) => {
                    try {
                        return await getProductImages(productId);
                    } catch (e) {
                        console.error('Failed to get product images:', e);
                        return [];
                    }
                },

                createProductImage: async productImage => {
                    set({ loading: true, error: null });
                    try {
                        const data = await createProductImage(productImage);
                        if (data) {
                            toast.success('Product image added successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to add product image' });
                        toast.error('Failed to add product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                updateProductImage: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await updateProductImage(id, updates);
                        if (data) {
                            toast.success('Product image updated successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to update product image' });
                        toast.error('Failed to update product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                deleteProductImage: async id => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteProductImage(id);
                        if (success) {
                            toast.success('Product image deleted successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to delete product image' });
                        toast.error('Failed to delete product image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                setPrimaryProductImage: async (productId, imageId) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await setPrimaryProductImage(productId, imageId);
                        if (data) {
                            toast.success('Primary image updated successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to set primary image' });
                        toast.error('Failed to set primary image', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                getCategories: async () => {
                    set({ loading: true, error: null });
                    try {
                        const categories = await getAllCategories();
                        if (!categories) {
                            set({ categories: [], loading: false, error: 'No categories returned from server' });
                            return;
                        }
                        set({ categories, loading: false, error: null });
                    } catch (e) {
                        console.error('Error in getCategories:', e);
                        set({ loading: false, error: 'Failed to get categories' });
                        toast.error('Failed to get categories', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                getProducts: async () => {
                    set({ loading: true, error: null });
                    try {
                        const products = await getAllProducts();
                        set({ products, loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to get products' });
                        toast.error('Failed to get products', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                addProduct: async product => {
                    set({ loading: true, error: null });
                    try {
                        const data = await createProduct(product);
                        set({ products: [...get().products, data], loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to add product' });
                        toast.error('Failed to add product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                updateProduct: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const data = await updateProduct(id, updates);
                        set({ products: [...get().products, data], loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to update product' });
                        toast.error('Failed to update product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                deleteProduct: async id => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteProduct(id);
                        if (success) {
                            set(state => ({
                                products: state.products.filter(product => product.id !== id),
                                loading: false,
                                error: null
                            }));
                            toast.success('Product deleted successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to delete product' });
                        toast.error('Failed to delete product', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                createProductType: async productType => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await createProductType(productType);
                        if (error || !data) {
                            throw new Error(error?.message || 'Failed to create product type');
                        }
                        set({ products: [...get().products, data], loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to create product type' });
                        toast.error('Failed to create product type', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                updateProductType: async (id, updates) => {
                    set({ loading: true, error: null });
                    try {
                        const { data, error } = await updateProductType(id, updates);
                        if (error || !data) {
                            throw new Error(error?.message || 'Failed to update product type');
                        }
                        set({ products: [...get().products, data], loading: false, error: null });
                    } catch (e) {
                        set({ loading: false, error: 'Failed to update product type' });
                        toast.error('Failed to update product type', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                deleteProductType: async id => {
                    set({ loading: true, error: null });
                    try {
                        const success = await deleteProductType(id);
                        if (success) {
                            set(state => ({
                                products: state.products.filter(product => product.id !== id),
                                loading: false,
                                error: null
                            }));
                            toast.success('Product type deleted successfully', { duration: 5000 });
                        }
                    } catch (e) {
                        set({ loading: false, error: 'Failed to delete product type' });
                        toast.error('Failed to delete product type', {
                            description: e instanceof Error ? e.message : 'Unknown error',
                            duration: 5000
                        });
                    }
                },

                // Product variant actions
                getProductVariants: async (productId: string) => {
                    try {
                        const variants = await getProductVariants(productId);
                        return variants;
                    } catch (e) {
                        console.error('Failed to get product variants:', e);
                        return [];
                    }
                },

                createProductVariant: async (variant: Partial<ProductVariant>) => {
                    try {
                        const createdVariant = await createProductVariant(variant);
                        return createdVariant;
                    } catch (e) {
                        console.error('Failed to create product variant:', e);
                        return null;
                    }
                },

                updateProductVariant: async (id: string, updates: Partial<ProductVariant>) => {
                    try {
                        const updatedVariant = await updateProductVariant(id, updates);
                        return updatedVariant;
                    } catch (e) {
                        console.error('Failed to update product variant:', e);
                        return null;
                    }
                },

                deleteProductVariant: async (id: string) => {
                    try {
                        const success = await deleteProductVariant(id);
                        return success;
                    } catch (e) {
                        console.error('Failed to delete product variant:', e);
                        return false;
                    }
                },

                // Variant image actions
                getVariantImages: async (variantId: string) => {
                    try {
                        const images = await getVariantImages(variantId);
                        return images;
                    } catch (e) {
                        console.error('Failed to get variant images:', e);
                        return [];
                    }
                },

                createVariantImage: async (variantImage: Partial<ProductImage>) => {
                    try {
                        const createdImage = await createVariantImage(variantImage);
                        return createdImage;
                    } catch (e) {
                        console.error('Failed to create variant image:', e);
                        return null;
                    }
                },
            }),
        ),
            {
                name: 'products-store',
                storage: createJSONStorage(() => localStorage)
        }
    )
); 