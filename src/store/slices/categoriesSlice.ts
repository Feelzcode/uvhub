import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Category } from '../types';
import { createCategory, getAllCategories } from '@/app/admin/dashboard/products/actions';

// Initial state
const initialState = {
  categories: [] as Category[],
  loading: false,
  error: null as string | null,
  selectedCategory: null as Category | null,
};

// Store type
export type CategoriesStore = typeof initialState & {
  // State setters
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: Category | null) => void;

  // CRUD operations
  addCategory: (categoryData: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Data fetching
  getCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  
  // Utility actions
  clearError: () => void;
  resetState: () => void;
};

// Create the store
export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // State setters
        setCategories: (categories: Category[]) => set({ categories }),
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: string | null) => set({ error }),
        setSelectedCategory: (category: Category | null) => set({ selectedCategory: category }),

        // CRUD operations
        addCategory: async (categoryData: Partial<Category>) => {
          const { setLoading, setError } = get();
          
          setLoading(true);
          setError(null);

          try {
            // Here you would typically make an API call to create the category
            // For now, we'll simulate the API call
            const newCategory = await createCategory(categoryData as Partial<Category>);

            if (newCategory && newCategory.data) {
              set((state) => ({
                categories: [...state.categories, newCategory.data as Category],
                loading: false,
              }));
            } else if (newCategory && newCategory.error) {
              throw new Error(newCategory.error.message || 'Failed to create category');
            }
          } catch (error) {
            console.error('Error adding category:', error);
            setError(error instanceof Error ? error.message : 'Failed to add category');
            set({ loading: false });
          }
        },

        updateCategory: async (id: string, updates: Partial<Category>) => {
          const { setLoading, setError } = get();
          
          setLoading(true);
          setError(null);

          try {
            // Here you would typically make an API call to update the category
            set((state) => ({
              categories: state.categories.map((category) =>
                category.id === id
                  ? { ...category, ...updates, updated_at: new Date() }
                  : category
              ),
              loading: false,
            }));
          } catch (error) {
            console.error('Error updating category:', error);
            setError(error instanceof Error ? error.message : 'Failed to update category');
            set({ loading: false });
          }
        },

        deleteCategory: async (id: string) => {
          const { setLoading, setError } = get();
          
          setLoading(true);
          setError(null);

          try {
            // Here you would typically make an API call to delete the category
            set((state) => ({
              categories: state.categories.filter((category) => category.id !== id),
              loading: false,
            }));
          } catch (error) {
            console.error('Error deleting category:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete category');
            set({ loading: false });
          }
        },

        // Data fetching
        getCategories: async () => {
          const { setLoading, setError } = get();
          
          setLoading(true);
          setError(null);

          try {
            // Here you would typically make an API call to fetch categories
            // For now, we'll simulate the API call
            const categories = await getAllCategories();

            if (categories) {
              set({ categories, loading: false });
            }
          } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch categories');
            set({ loading: false });
          }
        },

        getCategoryById: (id: string) => {
          const { categories } = get();
          return categories.find((category) => category.id === id);
        },

        // Utility actions
        clearError: () => set({ error: null }),
        resetState: () => set(initialState),
      }),
      {
        name: 'categories-storage',
        partialize: (state) => ({
          categories: state.categories,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: 'categories-store',
    }
  )
);
