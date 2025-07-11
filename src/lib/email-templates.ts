/* eslint-disable @typescript-eslint/no-explicit-any */
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Register custom helpers
Handlebars.registerHelper('formatCurrency', function(amount: number, currency: string = 'NGN', locale: string = 'en-NG') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
});

Handlebars.registerHelper('formatDate', function(date: string | Date) {
    return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

Handlebars.registerHelper('formatDateTime', function(date: string | Date) {
    return new Date(date).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

Handlebars.registerHelper('lowercase', function(str: string) {
    return str.toLowerCase();
});

Handlebars.registerHelper('uppercase', function(str: string) {
    return str.toUpperCase();
});

// Load and compile templates
const templatesDir = path.join(process.cwd(), 'src', 'templates', 'emails');

// Load base template
const baseTemplatePath = path.join(templatesDir, 'base.hbs');
const baseTemplateSource = fs.readFileSync(baseTemplatePath, 'utf-8');

// Register base template as partial
Handlebars.registerPartial('base', baseTemplateSource);

// Load all email templates
const loadTemplate = (templateName: string) => {
    const templatePath = path.join(templatesDir, `${templateName}.hbs`);
    if (!fs.existsSync(templatePath)) {
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
        
        return template(templateData);
    } catch (error) {
        console.error(`Error compiling template ${templateName}:`, error);
        throw error;
    }
};

// Specific email template functions
export const compileOrderConfirmation = (orderData: any) => {
    return compileTemplate('order-confirmation', {
        subject: 'Order Confirmation - UVHub',
        customerName: orderData.customer.name,
        orderId: orderData.id,
        orderDate: new Date(orderData.created_at).toLocaleDateString(),
        orderTotal: orderData.total,
        currency: '$',
        paymentMethod: orderData.paymentMethod,
        orderStatus: orderData.status,
        orderItems: orderData.items || [],
        shippingAddress: orderData.shippingAddress,
        orderTrackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData.id}`
    });
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