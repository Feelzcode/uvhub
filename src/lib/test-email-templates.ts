import { Order } from '@/store';
import { 
    compileOrderConfirmation, 
    compilePasswordReset, 
    compileWelcome, 
    compileOrderShipped 
} from './email-templates';
import fs from 'fs'
import path from 'path'

// Sample data for testing
const sampleOrder = {
    id: 'ORD-12345',
    created_at: new Date().toISOString(),
    total: 299.99,
    status: 'confirmed',
    paymentMethod: 'Credit Card',
    customer: {
        name: 'John Doe',
        email: 'john@example.com'
    },
    items: [
        {
            productName: 'Premium Wireless Headphones',
            quantity: 1,
            price: 199.99,
            productImage: 'https://example.com/headphones.jpg'
        },
        {
            productName: 'Bluetooth Speaker',
            quantity: 2,
            price: 49.99,
            productImage: 'https://example.com/speaker.jpg'
        }
    ],
    shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
    }
};

const sampleResetData = {
    customerName: 'John Doe',
    resetUrl: 'https://uvhub.com/reset-password?token=abc123'
};

const sampleUserData = {
    name: 'John Doe'
};

const sampleShipmentData = {
    customerName: 'John Doe',
    orderId: 'ORD-12345',
    trackingNumber: 'TRK-987654321',
    trackingUrl: 'https://tracking.example.com/TRK-987654321',
    estimatedDelivery: '3-5 business days',
    shippingMethod: 'Express Shipping',
    carrier: 'FedEx',
    shippedDate: new Date().toISOString(),
    orderItems: [
        {
            productName: 'Premium Wireless Headphones',
            quantity: 1,
            productImage: 'https://example.com/headphones.jpg'
        }
    ],
    shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
    }
};

// Test function to compile all templates
export const testEmailTemplates = () => {
    console.log('🧪 Testing Email Templates...\n');

    try {
        // Test Order Confirmation
        console.log('📧 Order Confirmation Template:');
        const orderConfirmationHtml = compileOrderConfirmation(sampleOrder as unknown as Order);
        console.log('✅ Compiled successfully');
        console.log(`📏 Length: ${orderConfirmationHtml.length} characters\n`);

        // Test Password Reset
        console.log('🔐 Password Reset Template:');
        const passwordResetHtml = compilePasswordReset(sampleResetData);
        console.log('✅ Compiled successfully');
        console.log(`📏 Length: ${passwordResetHtml.length} characters\n`);

        // Test Welcome Email
        console.log('🎉 Welcome Email Template:');
        const welcomeHtml = compileWelcome(sampleUserData);
        console.log('✅ Compiled successfully');
        console.log(`📏 Length: ${welcomeHtml.length} characters\n`);

        // Test Order Shipped
        console.log('📦 Order Shipped Template:');
        const orderShippedHtml = compileOrderShipped(sampleShipmentData);
        console.log('✅ Compiled successfully');
        console.log(`📏 Length: ${orderShippedHtml.length} characters\n`);

        console.log('🎉 All templates compiled successfully!');
        
        // Optionally save to files for inspection
        if (process.env.NODE_ENV === 'development') {
            const outputDir = path.join(process.cwd(), 'email-test-output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            
            fs.writeFileSync(path.join(outputDir, 'order-confirmation.html'), orderConfirmationHtml);
            fs.writeFileSync(path.join(outputDir, 'password-reset.html'), passwordResetHtml);
            fs.writeFileSync(path.join(outputDir, 'welcome.html'), welcomeHtml);
            fs.writeFileSync(path.join(outputDir, 'order-shipped.html'), orderShippedHtml);
            
            console.log(`📁 Templates saved to: ${outputDir}`);
        }

    } catch (error) {
        console.error('❌ Error testing templates:', error);
    }
};

// Run test if this file is executed directly
if (require.main === module) {
    testEmailTemplates();
} 