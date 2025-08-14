'use server'

import { Category, Customer, PaginatedResponse, ProductType, Subcategory, ProductImage, Product, ProductVariant } from "@/store/types";
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
            category:categories(*),
            subcategory:subcategories(*)
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

    // First try without the category join to see if basic query works
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            subcategory:subcategories(*)`,
            { count: 'exact' }
        )
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Database error:', error)
        return []
    }
    return data;
}

export async function getProductById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            subcategory:subcategories(*)
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
            category:categories(*),
            subcategory:subcategories(*)
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
            category:categories(*),
            subcategory:subcategories(*)
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

    // Log the customer object before any operation
    console.log('Attempting to create customer with data:', customer);

    try {
        // Check if the customer already exists
        const { data: existingCustomer, error: existingCustomerError } = await supabase
            .from('customers')
            .select('*')
            .eq('email', customer.email)
            .maybeSingle(); // Use maybeSingle instead of single to avoid error when no record found

        if (existingCustomerError) {
            console.error('Error checking for existing customer:', existingCustomerError);
            return null;
        }

        // If the customer already exists, return the customer
        if (existingCustomer) {
            console.log('Customer already exists:', existingCustomer);
            return existingCustomer;
        }

        // If the customer does not exist, create the customer
        const { data, error } = await supabase
            .from('customers')
            .insert(customer)
            .select()
            .single();

        if (error) {
            console.error('Error inserting new customer:', error);
            return null;
        }

        console.log('Customer created successfully:', data);
        return data;
    } catch (error) {
        console.error('Unexpected error in createCustomer:', error);
        return null;
    }
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

// Categories with Types Information
export async function getPaginatedCategories(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Category>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient()
    const { data, error, count } = await supabase
        .from('categories')
        .select(`
            *,
            types:product_types(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search && search.length > 0) {
        const { data: searchData, error: searchError, count: searchCount } = await supabase
            .from('categories')
            .select(`
                *,
                types:product_types(*)
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

export async function getAllCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select(`
            *,
            types:product_types(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching categories:', error);
        return null;
    }

    return data;
}

export async function createCategory(category: Partial<Category>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

    if (error) {
        console.error('Error creating category:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function updateCategory(id: string, updates: Partial<Category>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating category:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function deleteCategory(id: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return false;
    }

    return true;
}

// Product Types functions
export async function createProductType(type: Partial<ProductType>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('product_types')
        .insert([type])
        .select()
        .single();

    if (error) {
        console.error('Error creating product type:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function updateProductType(id: string, updates: Partial<ProductType>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('product_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product type:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function deleteProductType(id: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product type:', error);
        return false;
    }

    return true;
}

// Subcategory Information
export async function getPaginatedSubcategories(params: { page: number, limit: number, search?: string }): Promise<PaginatedResponse<Subcategory>> {
    const { page, limit } = paginationSchema.parse({ page: params.page, limit: params.limit });
    const { search } = searchSchema.parse({ search: params.search });

    const supabase = await createClient()
    const { data, error, count } = await supabase
        .from('subcategories')
        .select(`
            *,
            category:categories(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search && search.length > 0) {
        const { data: searchData, error: searchError, count: searchCount } = await supabase
            .from('subcategories')
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
    }
}

export async function getAllSubcategories() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('subcategories')
        .select(`
            *,
            category:categories(*)
        `)
        .order('created_at', { ascending: false });
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function getSubcategoriesByCategory(categoryId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('subcategories')
        .select(`
            *,
            category:categories(*)
        `)
        .eq('category_id', categoryId)
        .order('name', { ascending: true });
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function getSubcategoryById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('subcategories')
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

export async function createSubcategory(subcategory: Partial<Subcategory>) {
    const supabase = await createClient()

    // Transform the data to match database column names
    const subcategoryData = {
        name: subcategory.name,
        description: subcategory.description,
        category_id: subcategory.category_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
        .from('subcategories')
        .insert(subcategoryData)
        .select(`
            *,
            category:categories(*)
        `)
        .single();

    if (error) {
        console.error('Error creating subcategory:', error)
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

export async function updateSubcategory(id: string, subcategory: Partial<Subcategory>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('subcategories')
        .update(subcategory)
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

export async function deleteSubcategory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('subcategories').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}

// Product Images Information
export async function getProductImages(productId: string): Promise<ProductImage[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });
    
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function createProductImage(productImage: Partial<ProductImage>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_images')
        .insert(productImage)
        .select()
        .single();
    
    if (error) {
        console.error('Error creating product image:', error)
        return null
    }
    return data;
}

export async function updateProductImage(id: string, productImage: Partial<ProductImage>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_images')
        .update(productImage)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function deleteProductImage(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('product_images').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}

export async function setPrimaryProductImage(productId: string, imageId: string) {
    const supabase = await createClient()
    
    // First, set all images for this product to not primary
    const { error: updateError } = await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);
    
    if (updateError) {
        console.error('Error updating existing primary images:', updateError)
        return null
    }
    
    // Then set the specified image as primary
    const { data, error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId)
        .select()
        .single();
    
    if (error) {
        console.error('Error setting primary image:', error)
        return null
    }
    return data;
}

// Product Variants Information
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });
    
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function createProductVariant(variant: Partial<ProductVariant>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_variants')
        .insert(variant)
        .select()
        .single();
    
    if (error) {
        console.error('Error creating product variant:', error)
        return null
    }
    return data;
}

export async function updateProductVariant(id: string, variant: Partial<ProductVariant>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_variants')
        .update(variant)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error(error)
        return null
    }
    return data;
}

export async function deleteProductVariant(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('product_variants').delete().eq('id', id);
    if (error) {
        console.error(error)
        return null
    }
    return true;
}

// Variant Images Information
export async function getVariantImages(variantId: string): Promise<ProductImage[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('variant_images')
        .select('*')
        .eq('variant_id', variantId)
        .order('sort_order', { ascending: true });
    
    if (error) {
        console.error(error)
        return []
    }
    return data;
}

export async function createVariantImage(variantImage: Partial<ProductImage>) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('variant_images')
        .insert(variantImage)
        .select()
        .single();
    
    if (error) {
        console.error('Error creating variant image:', error)
        return null
    }
    return data;
}