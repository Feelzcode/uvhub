import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Order, OrdersState } from '../types';

interface OrdersActions {
    // Actions
    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    deleteOrder: (id: string) => void;
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
            setOrders: (orders) => set({ orders, loading: false, error: null }),

            addOrder: (order) =>
                set((state) => ({
                    orders: [...state.orders, order]
                })),

            updateOrder: (id, updates) =>
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === id ? { ...order, ...updates, updatedAt: new Date() } : order
                    ),
                })),

            deleteOrder: (id) =>
                set((state) => ({
                    orders: state.orders.filter((order) => order.id !== id),
                })),

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
                return orders.filter((order) => order.customer.id === userId);
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