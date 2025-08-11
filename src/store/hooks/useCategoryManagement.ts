import { useCategories } from './useCategories';
import { useSubcategories } from './useSubcategories';
import { Category, Subcategory } from '../types';

export const useCategoryManagement = () => {
  const categories = useCategories();
  const subcategories = useSubcategories();

  // Helper function to get category with its subcategories
  const getCategoryWithSubcategories = (categoryId: string) => {
    const category = categories.getCategoryById(categoryId);
    if (!category) return null;

    const categorySubcategories = subcategories.subcategories.filter(
      (subcategory) => subcategory.category_id === categoryId
    );

    return {
      ...category,
      subcategories: categorySubcategories,
    };
  };

  // Helper function to get all categories with their subcategories
  const getAllCategoriesWithSubcategories = () => {
    return categories.categories.map((category) => ({
      ...category,
      subcategories: subcategories.subcategories.filter(
        (subcategory) => subcategory.category_id === category.id
      ),
    }));
  };

  // Helper function to create a category with subcategories
  const createCategoryWithSubcategories = async (
    categoryData: Partial<Category>,
    subcategoriesData: Partial<Subcategory>[] = []
  ) => {
    try {
      // Create the category first
      await categories.addCategory(categoryData);
      
      // Get the newly created category
      const newCategory = categories.getCategoryByName(categoryData.name!);
      if (!newCategory) throw new Error('Failed to create category');

      // Create subcategories for this category
      for (const subcategoryData of subcategoriesData) {
        await subcategories.addSubcategory({
          ...subcategoryData,
          category_id: newCategory.id,
        });
      }

      return newCategory;
    } catch (error) {
      console.error('Error creating category with subcategories:', error);
      throw error;
    }
  };

  // Helper function to delete a category and all its subcategories
  const deleteCategoryWithSubcategories = async (categoryId: string) => {
    try {
      // Get all subcategories for this category
      const categorySubcategories = subcategories.subcategories.filter(
        (subcategory) => subcategory.category_id === categoryId
      );

      // Delete all subcategories first
      for (const subcategory of categorySubcategories) {
        await subcategories.deleteSubcategory(subcategory.id);
      }

      // Delete the category
      await categories.deleteCategory(categoryId);
    } catch (error) {
      console.error('Error deleting category with subcategories:', error);
      throw error;
    }
  };

  // Helper function to get category hierarchy for navigation
  const getCategoryHierarchy = () => {
    return categories.categories.map((category) => ({
      ...category,
      subcategories: subcategories.subcategories
        .filter((subcategory) => subcategory.category_id === category.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  };

  // Helper function to search categories and subcategories
  const searchCategoriesAndSubcategories = (searchTerm: string) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const matchingCategories = categories.categories.filter((category) =>
      category.name.toLowerCase().includes(lowerSearchTerm) ||
      category.description.toLowerCase().includes(lowerSearchTerm)
    );

    const matchingSubcategories = subcategories.subcategories.filter((subcategory) =>
      subcategory.name.toLowerCase().includes(lowerSearchTerm) ||
      subcategory.description.toLowerCase().includes(lowerSearchTerm)
    );

    return {
      categories: matchingCategories,
      subcategories: matchingSubcategories,
    };
  };

  // Helper function to get category and subcategory options for forms
  const getCategoryAndSubcategoryOptions = () => {
    return categories.categories.map((category) => ({
      value: category.id,
      label: category.name,
      subcategories: subcategories.subcategories
        .filter((subcategory) => subcategory.category_id === category.id)
        .map((subcategory) => ({
          value: subcategory.id,
          label: subcategory.name,
        })),
    }));
  };

  return {
    // Categories
    ...categories,
    
    // Subcategories
    ...subcategories,
    
    // Combined helpers
    getCategoryWithSubcategories,
    getAllCategoriesWithSubcategories,
    createCategoryWithSubcategories,
    deleteCategoryWithSubcategories,
    getCategoryHierarchy,
    searchCategoriesAndSubcategories,
    getCategoryAndSubcategoryOptions,
  };
};
