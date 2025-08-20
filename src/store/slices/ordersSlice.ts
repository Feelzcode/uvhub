import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Customer, Order, OrderItem, OrdersState } from '../types';
import { ordersApi } from '@/lib/api/orders';

interface OrdersActions {
    // Actions
    setOrders: () => Promise<void>;
    placeOrder: (orderDetails: {
        customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>,
        items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[],
        total: number,
        paymentMethod: string,
    }) => Promise<Order | null>;
    updateOrder: (id: string, updates: Partial<Order>) => Promise<Order | null>;
    deleteOrder: (id: string) => Promise<boolean>;
    setSelectedOrder: (order: Order | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Computed selectors
    getOrderById: (id: string) => Order | undefined;
    getOrdersByStatus: (status: Order['status']) => Order[];
    getOrdersByUser: (userId: string) => Order[];
    getTotalRevenue: () => number;
    getOrdersCount: () => number;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
    selectedOrder: null,
};

export const useOrdersStore = create<OrdersState & OrdersActions>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Actions
            setOrders: async () => {
                set({ loading: true, error: null });
                try {
                    const orders = await ordersApi.getAllOrders();
                    set({ orders, loading: false, error: null });
                } catch (error) {
                    console.error(error);
                    set({ error: error instanceof Error ? error.message : 'Failed to fetch orders', loading: false });
                }
            },

            placeOrder: async (orderDetails) => {
                set({ loading: true, error: null });
                try {
                    const newOrder = await ordersApi.placeOrder(orderDetails);
                    if (newOrder) {
                        set((state) => ({
                            orders: [...state.orders, newOrder],
                            loading: false,
                            error: null
                        }));
                    } else {
                        set({ error: 'Failed to place order', loading: false });
                    }
                } catch (error) {
                    console.error(error);
                    set({ error: error instanceof Error ? error.message : 'Failed to place order', loading: false });
                }
            },

            updateOrder: async (id, updates) => {
                try {
                    const updatedOrder = await ordersApi.updateOrder(id, updates);
                    if (updatedOrder) {
                        set((state) => ({
                            orders: state.orders.map((order) =>
                                order.id === id ? updatedOrder : order
                            ),
                        }));
                        return updatedOrder;
                    }
                    return null;
                } catch (error) {
                    console.error('Error updating order:', error);
                    return null;
                }
            },

            deleteOrder: async (id) => {
                try {
                    const success = await ordersApi.deleteOrder(id);
                    if (success) {
                        set((state) => ({
                            orders: state.orders.filter((order) => order.id !== id),
                        }));
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error deleting order:', error);
                    return false;
                }
            },

            setSelectedOrder: (order) => set({ selectedOrder: order }),

            setLoading: (loading) => set({ loading }),

            setError: (error) => set({ error, loading: false }),

            // Computed selectors
            getOrderById: (id) => {
                const { orders } = get();
                return orders.find((order) => order.id === id);
            },

            getOrdersByStatus: (status) => {
                const { orders } = get();
                return orders.filter((order) => order.status === status);
            },

            getOrdersByUser: (userId) => {
                const { orders } = get();
                return orders.filter((order) => order.customer_id === userId);
            },

            getTotalRevenue: () => {
                const { orders } = get();
                return orders
                    .filter((order) => order.status === 'delivered')
                    .reduce((total, order) => total + order.total, 0);
            },

            getOrdersCount: () => {
                const { orders } = get();
                return orders.length;
            },
        }),
        {
            name: 'orders-store',
        }
    )
); 