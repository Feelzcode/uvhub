import { useCallback } from 'react';
import { useProductsStore } from './slices/productsSlice';
import { useOrdersStore } from './slices/ordersSlice';
import { useCartStore } from './slices/cartSlice';
import { Product, Order } from './types';

// Products hooks
export const useProducts = () => {
    const {
        products,
        loading,
        error,
        selectedProduct,
        filters,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        setSelectedProduct,
        setLoading,
        setError,
        setFilters,
        clearFilters,
        getFilteredProducts,
        getProductById,
        getProductsByCategory,
    } = useProductsStore();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with actual API
            // For demo purposes, we'll use sample data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const { sampleProducts } = await import('@/lib/sampleData');
            setProducts(sampleProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
    }, [setProducts, setLoading, setError]);

    return {
        products,
        loading,
        error,
        selectedProduct,
        filters,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        setSelectedProduct,
        setLoading,
        setError,
        setFilters,
        clearFilters,
        getFilteredProducts,
        getProductById,
        getProductsByCategory,
        fetchProducts,
    };
};

// Orders hooks
export const useOrders = () => {
    const {
        orders,
        loading,
        error,
        selectedOrder,
        setOrders,
        updateOrder,
        deleteOrder,
        setSelectedOrder,
        setLoading,
        setError,
        getOrderById,
        getOrdersByStatus,
        getOrdersByUser,
        getTotalRevenue,
        getOrdersCount,
    } = useOrdersStore();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with actual API
            // For demo purposes, we'll use empty array since sampleOrders was removed
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            setOrders();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        }
    }, [setOrders, setLoading, setError]);

    const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
        setLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            const newOrder = await response.json();
            return newOrder;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            throw err;
        }
    }, [setLoading, setError]);

    return {
        orders,
        loading,
        error,
        selectedOrder,
        setOrders,
        updateOrder,
        deleteOrder,
        setSelectedOrder,
        setLoading,
        setError,
        getOrderById,
        getOrdersByStatus,
        getOrdersByUser,
        getTotalRevenue,
        getOrdersCount,
        fetchOrders,
        createOrder,
    };
};

// Cart hooks
export const useCart = () => {
    const {
        items,
        total,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItem,
        isInCart,
        getTotalItems,
        getTotalPrice,
    } = useCartStore();

    const addProductToCart = useCallback((product: Product, quantity = 1) => {
        addToCart(product, quantity);
    }, [addToCart]);

    const removeProductFromCart = useCallback((productId: string) => {
        removeFromCart(productId);
    }, [removeFromCart]);

    const updateProductQuantity = useCallback((productId: string, quantity: number) => {
        updateQuantity(productId, quantity);
    }, [updateQuantity]);

    return {
        items,
        total,
        itemCount,
        addToCart: addProductToCart,
        removeFromCart: removeProductFromCart,
        updateQuantity: updateProductQuantity,
        clearCart,
        getCartItem,
        isInCart,
        getTotalItems,
        getTotalPrice,
    };
};

// Combined hooks for common use cases
export const useEcommerce = () => {
    const products = useProducts();
    const orders = useOrders();
    const cart = useCart();

    return {
        products,
        orders,
        cart,
    };
}; 