/* eslint-disable prefer-const */
'use server'

import { Customer, Order, OrderItem, PaginatedResponse } from "@/store/types";
import { createClient } from "@/utils/supabase/server";
import { paginationSchema, searchSchema } from "@/utils/schema";
import { createCustomer, getCustomerByEmail } from "../products/actions";
// import { sendOrderPlacedEmail } from "@/lib/email";


// Order Information
export async function getPaginatedPendingOrders(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient();
    let { data: pendingOrders, count: pendingOrdersCount, error } = await supabase.from('orders').select('*').eq('status', 'pending').range((page - 1) * limit, page * limit - 1);

    if (pendingOrders && search) {
        pendingOrders = pendingOrders.filter((order) => order.id.includes(search));
        pendingOrdersCount = pendingOrders.length;
    }
    if (error) {
        return {
            documents: [],
            total: 0,
            meta: { page, limit, totalPages: 0, previousPage: null, nextPage: null }
        }
    }

    const totalPages = Math.ceil((pendingOrdersCount ? pendingOrdersCount : 0) / limit);
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
        documents: pendingOrders ? pendingOrders : [],
        total: pendingOrdersCount ? pendingOrdersCount : 0,
        meta: { page, limit, totalPages, previousPage, nextPage }
    };
}

export async function getPaginatedProcessingOrders(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient();
    let { data: processingOrders, count: processingOrdersCount, error } = await supabase.from('orders').select('*').eq('status', 'processing').range((page - 1) * limit, page * limit - 1);

    if (processingOrders && search) {
        processingOrders = processingOrders.filter((order) => order.id.includes(search));
        processingOrdersCount = processingOrders.length;
    }
    if (error) {
        return {
            documents: [],
            total: 0,
            meta: { page, limit, totalPages: 0, previousPage: null, nextPage: null }
        }
    }

    const totalPages = Math.ceil((processingOrdersCount ? processingOrdersCount : 0) / limit);
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
        documents: processingOrders ? processingOrders : [],
        total: processingOrdersCount ? processingOrdersCount : 0,
        meta: { page, limit, totalPages, previousPage, nextPage }
    };
}

export async function getPaginatedShippedOrders(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient();
    let { data: shippedOrders, count: shippedOrdersCount, error } = await supabase.from('orders').select('*').eq('status', 'shipped').range((page - 1) * limit, page * limit - 1);

    if (shippedOrders && search) {
        shippedOrders = shippedOrders.filter((order) => order.id.includes(search));
        shippedOrdersCount = shippedOrders.length;
    }
    if (error) {
        return {
            documents: [],
            total: 0,
            meta: { page, limit, totalPages: 0, previousPage: null, nextPage: null }
        }
    }

    const totalPages = Math.ceil((shippedOrdersCount ? shippedOrdersCount : 0) / limit);
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
        documents: shippedOrders ? shippedOrders : [],
        total: shippedOrdersCount ? shippedOrdersCount : 0,
        meta: { page, limit, totalPages, previousPage, nextPage }
    };
}

export async function getPaginatedDeliveredOrders(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient();
    let { data: deliveredOrders, count: deliveredOrdersCount, error } = await supabase.from('orders').select('*').eq('status', 'delivered').range((page - 1) * limit, page * limit - 1);

    if (deliveredOrders && search) {
        deliveredOrders = deliveredOrders.filter((order) => order.id.includes(search));
        deliveredOrdersCount = deliveredOrders.length;
    }
    if (error) {
        return {
            documents: [],
            total: 0,
            meta: { page, limit, totalPages: 0, previousPage: null, nextPage: null }
        }
    }

    const totalPages = Math.ceil((deliveredOrdersCount ? deliveredOrdersCount : 0) / limit);
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
        documents: deliveredOrders ? deliveredOrders : [],
        total: deliveredOrdersCount ? deliveredOrdersCount : 0,
        meta: { page, limit, totalPages, previousPage, nextPage }
    };
}

export async function getPaginatedCancelledOrders(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Order>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient();
    let { data: cancelledOrders, count: cancelledOrdersCount, error } = await supabase.from('orders').select('*').eq('status', 'cancelled').range((page - 1) * limit, page * limit - 1);

    if (cancelledOrders && search) {
        cancelledOrders = cancelledOrders.filter((order) => order.id.includes(search));
        cancelledOrdersCount = cancelledOrders.length;
    }
    if (error) {
        return {
            documents: [],
            total: 0,
            meta: { page, limit, totalPages: 0, previousPage: null, nextPage: null }
        }
    }

    const totalPages = Math.ceil((cancelledOrdersCount ? cancelledOrdersCount : 0) / limit);
    const previousPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
        documents: cancelledOrders ? cancelledOrders : [],
        total: cancelledOrdersCount ? cancelledOrdersCount : 0,
        meta: { page, limit, totalPages, previousPage, nextPage }
    };
}

export async function getAllOrders(): Promise<Order[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    return data || [];
}

export async function getOrderById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function updateOrder(id: string, order: Order) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').update(order).eq('id', id).select().single();
    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function deleteOrder(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').delete().eq('id', id).select().single();
    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function createOrderItems(items: Omit<OrderItem, 'id' | 'created_at' | 'orderId'>[]): Promise<OrderItem[] | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('order_items').insert(items).select();
    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function placeOrder(orderDetails: {
    customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[],
    total: number,
    paymentMethod: string,
}): Promise<Order | null> {
    let customer: Customer | null;
    
    try {
        // Check if customer exists
        customer = await getCustomerByEmail(orderDetails.customer.email);

        // If customer doesn't exist, create a new one
        if (!customer) {
            customer = await createCustomer(orderDetails.customer);
            if (!customer) {
                console.error('Failed to create customer');
                return null;
            }
        }

        // Create the order
        const order = await createOrder({
            customer_id: customer.id,
            total: orderDetails.total,
            status: 'pending',
            payment_method: orderDetails.paymentMethod,
            shipping_address: {
                street: customer.address.street,
                city: customer.address.city,
                state: customer.address.state,
                zipCode: customer.address.zipCode,
                country: customer.address.country,
            }
        });

        if (!order) {
            console.error('Failed to create order');
            return null;
        }

        // Create order items
        const orderItems = await createOrderItems(orderDetails.items.map((item) => ({
            ...item,
            order_id: order.id,
        })));

        if (!orderItems) {
            console.error('Failed to create order items');
            return null;
        }

        // send an email to the customer and the admin
        // await sendOrderPlacedEmail(order!);

        return order;
    } catch (error) {
        console.error('Error in placeOrder:', error);
        return null;
    }
}