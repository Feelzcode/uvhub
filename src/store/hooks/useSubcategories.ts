import { useEffect } from 'react';
import { useSubcategoriesStore } from '../slices/subcategoriesSlice';
import { Subcategory } from '../types';

export const useSubcategories = () => {
  const store = useSubcategoriesStore();
  const subcategories = store.subcategories;
  const loading = store.loading;
  const error = store.error;
  const selectedSubcategory = store.selectedSubcategory;
  const setSubcategories = store.setSubcategories;
  const setLoading = store.setLoading;
  const setError = store.setError;
  const setSelectedSubcategory = store.setSelectedSubcategory;
  const addSubcategory = store.addSubcategory;
  const updateSubcategory = store.updateSubcategory;
  const deleteSubcategory = store.deleteSubcategory;
  const getSubcategories = store.getSubcategories;
  const getSubcategoriesByCategory = store.getSubcategoriesByCategory;
  const getSubcategoryById = store.getSubcategoryById;
  const clearError = store.clearError;
  const resetState = store.resetState;

  // Auto-fetch subcategories on mount
  useEffect(() => {
    if (subcategories.length === 0 && !loading) {
      getSubcategories();
    }
  }, [subcategories.length, loading, getSubcategories]);

  // Helper function to get subcategory by name
  const getSubcategoryByName = (name: string): Subcategory | undefined => {
    return subcategories.find((subcategory) => subcategory.name.toLowerCase() === name.toLowerCase());
  };

  // Helper function to get subcategories with product count (placeholder)
  const getSubcategoriesWithProductCount = () => {
    return subcategories.map((subcategory) => ({
      ...subcategory,
      productCount: 0, // This would be calculated from actual product data
    }));
  };

  // Helper function to check if subcategory exists
  const subcategoryExists = (name: string): boolean => {
    return subcategories.some((subcategory) => subcategory.name.toLowerCase() === name.toLowerCase());
  };

  // Helper function to get subcategory options for select components
  const getSubcategoryOptions = (categoryId?: string) => {
    let filteredSubcategories = subcategories;
    
    if (categoryId) {
      filteredSubcategories = subcategories.filter((subcategory) => subcategory.category_id === categoryId);
    }

    return filteredSubcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
    }));
  };

  // Helper function to get subcategories grouped by category
  const getSubcategoriesGroupedByCategory = () => {
    const grouped: Record<string, Subcategory[]> = {};
    
    subcategories.forEach((subcategory) => {
      if (!grouped[subcategory.category_id]) {
        grouped[subcategory.category_id] = [];
      }
      grouped[subcategory.category_id].push(subcategory);
    });

    return grouped;
  };

  // Helper function to check if subcategory exists in a specific category
  const subcategoryExistsInCategory = (name: string, categoryId: string): boolean => {
    return subcategories.some(
      (subcategory) => 
        subcategory.name.toLowerCase() === name.toLowerCase() && 
        subcategory.category_id === categoryId
    );
  };

  return {
    // State
    subcategories,
    loading,
    error,
    selectedSubcategory,

    // Actions
    setSubcategories,
    setLoading,
    setError,
    setSelectedSubcategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getSubcategories,
    getSubcategoriesByCategory,
    getSubcategoryById,
    clearError,
    resetState,

    // Helper functions
    getSubcategoryByName,
    getSubcategoriesWithProductCount,
    subcategoryExists,
    getSubcategoryOptions,
    getSubcategoriesGroupedByCategory,
    subcategoryExistsInCategory,
  };
};
