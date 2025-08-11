import { useEffect } from 'react';
import { useCategoriesStore } from '../slices/categoriesSlice';
import { Category } from '../types';

export const useCategories = () => {
  const store = useCategoriesStore();
  const categories = store.categories;
  const loading = store.loading;
  const error = store.error;
  const selectedCategory = store.selectedCategory;
  const setCategories = store.setCategories;
  const setLoading = store.setLoading;
  const setError = store.setError;
  const setSelectedCategory = store.setSelectedCategory;
  const addCategory = store.addCategory;
  const updateCategory = store.updateCategory;
  const deleteCategory = store.deleteCategory;
  const getCategories = store.getCategories;
  const getCategoryById = store.getCategoryById;
  const clearError = store.clearError;
  const resetState = store.resetState;

  // Auto-fetch categories on mount
  useEffect(() => {
    if (categories.length === 0 && !loading) {
      getCategories();
    }
  }, [categories.length, loading, getCategories]);

  // Helper function to get category by name
  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find((category) => category.name.toLowerCase() === name.toLowerCase());
  };

  // Helper function to get categories with product count (placeholder)
  const getCategoriesWithProductCount = () => {
    return categories.map((category) => ({
      ...category,
      productCount: 0, // This would be calculated from actual product data
    }));
  };

  // Helper function to check if category exists
  const categoryExists = (name: string): boolean => {
    return categories.some((category) => category.name.toLowerCase() === name.toLowerCase());
  };

  // Helper function to get category options for select components
  const getCategoryOptions = () => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  };

  return {
    // State
    categories,
    loading,
    error,
    selectedCategory,

    // Actions
    setCategories,
    setLoading,
    setError,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    clearError,
    resetState,

    // Helper functions
    getCategoryByName,
    getCategoriesWithProductCount,
    categoryExists,
    getCategoryOptions,
  };
};
