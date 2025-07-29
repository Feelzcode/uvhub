// Export all slices
export { useProductsStore } from './slices/productsSlice';
export { useOrdersStore } from './slices/ordersSlice';
export { useCartStore } from './slices/cartSlice';
export { useCurrencyStore } from './slices/currencySlice';
export { useUserStore } from './slices/userSlice';
export { useSettingsStore } from './slices/settingsSlice';

// Export hooks
export { useCurrency } from './hooks/useCurrency';

// Export types
export type {
    Product,
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
} from './types';

// Re-export Zustand utilities for convenience
export { create } from 'zustand';
export { devtools, persist, subscribeWithSelector } from 'zustand/middleware'; 