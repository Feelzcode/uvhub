/* eslint-disable @typescript-eslint/no-explicit-any */
import { assertServerOnly } from './server-only';

// Assert this module is only used on the server
assertServerOnly();

import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Order } from '@/store';

// Register custom helpers
Handlebars.registerHelper('formatCurrency', function (amount: number, currency: string = 'NGN', locale: string = 'en-NG') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
});

Handlebars.registerHelper('formatDate', function (date: string | Date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

Handlebars.registerHelper('formatDateTime', function (date: string | Date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

Handlebars.registerHelper('lowercase', function (str: string) {
    return str ? str.toLowerCase() : '';
});

Handlebars.registerHelper('uppercase', function (str: string) {
    return str ? str.toUpperCase() : '';
});

// Load and compile templates
const templatesDir = path.join(process.cwd(), 'src', 'templates', 'emails');

// Load all email templates
const loadTemplate = (templateName: string) => {
    const templatePath = path.join(templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Template file not found:', templatePath);
        throw new Error(`Template ${templateName} not found`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateSource);
};

// Default company information
const defaultCompanyInfo = {
    companyName: 'UVHub',
    companyTagline: 'Your Ultimate Shopping Destination',
    currentYear: new Date().getFullYear(),
    companyAddress: '123 Commerce St, Business City, BC 12345',
    websiteUrl: 'https://uvhub.com.ng',
    supportEmail: 'mailto:support@uvhub.com',
    privacyUrl: 'https://uvhub.com.ng/privacy'
};

// Template compilation function
export const compileTemplate = (templateName: string, data: any) => {
    try {
        const template = loadTemplate(templateName);

        // Merge default company info with provided data
        const templateData = {
            ...defaultCompanyInfo,
            ...data
        };

        const result = template(templateData);
        console.log('✅ Template compilation successful, result length:', result.length);

        return result;
    } catch (error) {
        console.error(`❌ Error compiling template ${templateName}:`, error);
        throw error;
    }
};

// Specific email template functions
export const compileOrderConfirmation = (orderData: Order) => {
    console.log('🔍 Compiling order confirmation email for order:', orderData.id);

    // Transform order items to match template expectations
    const transformedItems = (orderData.items || []).map(item => ({
        productName: item.product?.name || 'Unknown Product',
        productImage: item.product?.image || '',
        quantity: item.quantity,
        price: item.price,
        currency: 'NGN'
    }));

    const templateData = {
        subject: 'Order Confirmation - UVHub',
        customerName: orderData.customer?.name ?? 'Valued Customer',
        orderId: orderData.id,
        orderDate: orderData.created_at ? new Date(orderData.created_at).toLocaleDateString() : '',
        orderTotal: orderData.total,
        currency: 'NGN',
        paymentMethod: orderData.payment_method,
        orderStatus: orderData.status,
        orderItems: transformedItems,
        shippingAddress: orderData.shipping_address,
        orderTrackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData.id}`
    };

    try {
        const html = compileTemplate('order-confirmation', templateData);
        console.log('✅ Email compiled successfully, length:', html.length);
        return html;
    } catch (error) {
        console.error('❌ Error compiling email template:', error);
        throw error;
    }
};

export const compilePasswordReset = (resetData: any) => {
    return compileTemplate('password-reset', {
        subject: 'Password Reset Request - UVHub',
        customerName: resetData.customerName,
        resetUrl: resetData.resetUrl,
        expiryTime: '24 hours'
    });
};

export const compileWelcome = (userData: any) => {
    return compileTemplate('welcome', {
        subject: 'Welcome to UVHub!',
        customerName: userData.name,
        discountPercentage: 10,
        welcomeCode: 'WELCOME10',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    });
};

export const compileOrderShipped = (shipmentData: any) => {
    return compileTemplate('order-shipped', {
        subject: 'Your Order Has Been Shipped - UVHub',
        customerName: shipmentData.customerName,
        orderId: shipmentData.orderId,
        trackingNumber: shipmentData.trackingNumber,
        trackingUrl: shipmentData.trackingUrl,
        estimatedDelivery: shipmentData.estimatedDelivery,
        shippingMethod: shipmentData.shippingMethod,
        carrier: shipmentData.carrier,
        shippedDate: new Date(shipmentData.shippedDate).toLocaleDateString(),
        orderItems: shipmentData.orderItems || [],
        shippingAddress: shipmentData.shippingAddress
    });
};

// Export template names for reference
export const EMAIL_TEMPLATES = {
    ORDER_CONFIRMATION: 'order-confirmation',
    PASSWORD_RESET: 'password-reset',
    WELCOME: 'welcome',
    ORDER_SHIPPED: 'order-shipped',
    ORDER_PLACED: 'order-placed'
} as const;

export type EmailTemplateName = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES]; 