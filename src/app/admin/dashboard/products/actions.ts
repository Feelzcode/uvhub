'use server'

import { Category, Customer, PaginatedResponse, Product } from "@/store/types";
import { paginationSchema, searchSchema } from "@/utils/schema";
import { createClient } from "@/utils/supabase/server";


// Products Information
export async function getPaginatedProducts(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Product>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient()
    const { data, error, count } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search && search.length > 0) {
        const { data: searchData, error: searchError, count: searchCount } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(*)
            `, { count: 'exact' })
            .textSearch('name', search)
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);
        if (searchError) {
            console.error(searchError)
            return {
                documents: [],
                total: 0,
                meta: {
                    page,
                    limit,
                    totalPages: 0,
                    previousPage: null,
                    nextPage: null,
                }
            }
        }
        return {
            documents: searchData,
            total: searchCount ? searchCount : 0,
            meta: {
                page,
                limit,
                totalPages: Math.ceil(searchCount ?? 0 / limit),
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(searchCount ?? 0 / limit) ? page + 1 : null,
            }
        }
    }

    if (error) {
        console.error(error)
        return {
            documents: [],
            total: 0,
            meta: {
                page,
                limit,
                totalPages: 0,
                previousPage: null,
                nextPage: null,
            }
        }
    }
    return {
        documents: data,
        total: count ? count : 0,
        meta: {
            page,
            limit,
            totalPages: Math.ceil(count ?? 0 / limit),
            previousPage: page > 1 ? page - 1 : null,
            nextPage: page < Math.ceil(count ?? 0 / limit) ? page + 1 : null,
        }
    };
}

export async function getAllProducts() {
    const supabase = await createClient()
    console.log('Fetching products from database...');
    
    // First try without the category join to see if basic query works
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    
    console.log('Supabase response:', { data, error });
    
    if (error) {
        console.error('Database error:', error)
        return []
    }
    
    console.log('Products returned:', data);
    return data;
}

export async function getProductById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*)
        `)
        .eq('id', id)
        .single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function createProduct(product: Partial<Product>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select(`
            *,
            category:categories(*)
        `)
        .single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function updateProduct(id: string, product: Product) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select(`
            *,
            category:categories(*)
        `)
        .single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}

// Customer Information
export async function getPaginatedCustomers(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Customer>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient()
    const { data, error, count } = await supabase.from('customers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);

    if (search && search.length > 0) {
        const { data: searchData, error: searchError, count: searchCount } = await supabase.from('customers').select('*', { count: 'exact' }).textSearch('name', search).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
        if (searchError) {
            console.error(searchError)
            return {
                documents: [],
                total: 0,
                meta: {
                    page,
                    limit,
                    totalPages: 0,
                    previousPage: null,
                    nextPage: null,
                }
            }
        }
        return {
            documents: searchData,
            total: searchCount ? searchCount : 0,
            meta: {
                page,
                limit,
                totalPages: Math.ceil(searchCount ?? 0 / limit),
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(searchCount ?? 0 / limit) ? page + 1 : null,
            }
        }
    }

    if (error) {
        console.error(error)
        return {
            documents: [],
            total: 0,
            meta: {
                page,
                limit,
                totalPages: 0,
                previousPage: null,
                nextPage: null,
            }
        }
    }
    return {
        documents: data,
        total: count ? count : 0,
        meta: {
            page,
            limit,
            totalPages: Math.ceil(count ?? 0 / limit),
            previousPage: page > 1 ? page - 1 : null,
            nextPage: page < Math.ceil(count ?? 0 / limit) ? page + 1 : null,
        }
    }
}

export async function getAllCustomers() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function getCustomerById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function getCustomerByEmail(email: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('customers').select('*').eq('email', email).single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function createCustomer(customer: Partial<Customer>) {
    const supabase = await createClient()

    // check if the customer already exists first
    const { data: existingCustomer, error: existingCustomerError } = await supabase.from('customers').select('*').eq('email', customer.email).single();
    if (existingCustomerError) {
        console.error(existingCustomerError)
        return null
    }

    // if the customer already exists, return the customer
    if (existingCustomer) {
        return existingCustomer;
    }

    // if the customer does not exist, create the customer
    const { data, error } = await supabase.from('customers').insert(customer).select().single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('customers').update(customer).eq('id', id).select().single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}

// Category Information
export async function getPaginatedCategories(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Category>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient()
    const { data, error, count } = await supabase.from('categories').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);

    if (search && search.length > 0) {
        const { data: searchData, error: searchError, count: searchCount } = await supabase.from('categories').select('*', { count: 'exact' }).textSearch('name', search).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);
        if (searchError) {
            console.error(searchError)
            return {
                documents: [],
                total: 0,
                meta: {
                    page,
                    limit,
                    totalPages: 0,
                    previousPage: null,
                    nextPage: null,
                }
            }
        }
        return {
            documents: searchData,
            total: searchCount ? searchCount : 0,
            meta: {
                page,
                limit,
                totalPages: Math.ceil(searchCount ?? 0 / limit),
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(searchCount ?? 0 / limit) ? page + 1 : null,
            }
        }
    }

    if (error) {
        console.error(error)
        return {
            documents: [],
            total: 0,
            meta: {
                page,
                limit,
                totalPages: 0,
                previousPage: null,
                nextPage: null,
            }
        }
    }
    return {
        documents: data,
        total: count ? count : 0,
        meta: {
            page,
            limit,
            totalPages: Math.ceil(count ?? 0 / limit),
            previousPage: page > 1 ? page - 1 : null,
            nextPage: page < Math.ceil(count ?? 0 / limit) ? page + 1 : null,
        }
    }
}

export async function getAllCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error(error)
        return []
    }

    return data;
}

export async function getCategoryById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function createCategory(category: Partial<Category>) {
    const supabase = await createClient()

    // Transform the data to match database column names
    const categoryData = {
        name: category.name,
        description: category.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('categories').insert(categoryData).select().single();

    if (error) {
        console.error('Error creating category:', error)
        console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        })
        return null
    }
    return data;
}

export async function updateCategory(id: string, category: Partial<Category>) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}