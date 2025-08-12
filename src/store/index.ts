// Export all slices
export { useProductsStore } from './slices/productsSlice';
export { useOrdersStore } from './slices/ordersSlice';
export { useCartStore } from './slices/cartSlice';
export { useCurrencyStore } from './slices/currencySlice';
export { useUserStore } from './slices/userSlice';
export { useSettingsStore } from './slices/settingsSlice';
export { useCategoriesStore } from './slices/categoriesSlice';
export { useSubcategoriesStore } from './slices/subcategoriesSlice';

// Export hooks
export { useCurrency } from './hooks/useCurrency';
export { useCategories } from './hooks/useCategories';
export { useSubcategories } from './hooks/useSubcategories';
export { useCategoryManagement } from './hooks/useCategoryManagement';

// Export types
export type {
    Product,
    ProductType,
    Order,
    OrderItem,
    CartItem,
    User,
    ProductsState,
    OrdersState,
    CartState,
    UserState,
    RootState,
    SupabaseUser,
    UserActions,
    Currency,
    CurrencyInfo,
    LocationInfo,
    CurrencyState,
    CurrencyActions,
    Settings,
    Category,
    Subcategory,
} from './types';

// Export slice types
export type { CategoriesStore } from './slices/categoriesSlice';
export type { SubcategoriesStore } from './slices/subcategoriesSlice';

// Re-export Zustand utilities for convenience
export { create } from 'zustand';
export { devtools, persist, subscribeWithSelector } from 'zustand/middleware'; 