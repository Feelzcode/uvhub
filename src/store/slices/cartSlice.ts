import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { CartItem, CartState, Product } from '../types';

interface CartActions {
    // Actions
    getCartItems: (state: CartState) => CartItem[] | [];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed selectors
    getCartItem: (productId: string) => CartItem | undefined;
    isInCart: (productId: string) => boolean;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

export const useCartStore = create<CartState & CartActions>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Actions
                addToCart: (product, quantity = 1) => {
                    set((state) => {
                        const existingItem = state.items.find(item => item.productId === product.id);

                        if (existingItem) {
                            // Update existing item quantity
                            const updatedItems = state.items.map(item =>
                                item.productId === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            );

                            const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                            const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                            return {
                                items: updatedItems,
                                total: newTotal,
                                itemCount: newItemCount,
                            };
                        } else {
                            // Add new item
                            const newItem: CartItem = {
                                productId: product.id,
                                quantity,
                                product,
                            };

                            const newItems = [...state.items, newItem];
                            const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                            const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

                            return {
                                items: newItems,
                                total: newTotal,
                                itemCount: newItemCount,
                            };
                        }
                    });
                },

                removeFromCart: (productId) => {
                    set((state) => {
                        const updatedItems = state.items.filter(item => item.productId !== productId);
                        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                        return {
                            items: updatedItems,
                            total: newTotal,
                            itemCount: newItemCount,
                        };
                    });
                },

                updateQuantity: (productId, quantity) => {
                    set((state) => {
                        if (quantity <= 0) {
                            // Remove item if quantity is 0 or negative
                            const updatedItems = state.items.filter(item => item.productId !== productId);
                            const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                            const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                            return {
                                items: updatedItems,
                                total: newTotal,
                                itemCount: newItemCount,
                            };
                        }

                        const updatedItems = state.items.map(item =>
                            item.productId === productId
                                ? { ...item, quantity }
                                : item
                        );

                        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                        return {
                            items: updatedItems,
                            total: newTotal,
                            itemCount: newItemCount,
                        };
                    });
                },

                clearCart: () => set(initialState),

                // Computed selectors
                getCartItem: (productId) => {
                    const { items } = get();
                    return items.find(item => item.productId === productId);
                },

                getCartItems: (state) => {
                    return state.items;
                },

                isInCart: (productId) => {
                    const { items } = get();
                    return items.some(item => item.productId === productId);
                },

                getTotalItems: () => {
                    const { items } = get();
                    return items.reduce((sum, item) => sum + item.quantity, 0);
                },

                getTotalPrice: () => {
                    const { items } = get();
                    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                },
            }),
            {
                name: 'cart-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    items: state.items,
                    itemCount: state.itemCount,
                    total: state.total,
                }),
            }
        ),
        {
            name: 'cart-store',
        }
    )
); 