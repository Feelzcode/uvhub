// Export all slices
export { useProductsStore } from './slices/productsSlice';
export { useOrdersStore } from './slices/ordersSlice';
export { useCartStore } from './slices/cartSlice';

// Export types
export type {
    Product,
    Order,
    OrderItem,
    CartItem,
    ProductsState,
    OrdersState,
    CartState,
    RootState,
} from './types';

// Re-export Zustand utilities for convenience
export { create } from 'zustand';
export { devtools, persist, subscribeWithSelector } from 'zustand/middleware'; 