/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    sendOrderConfirmationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendOrderShippedEmail,
    sendTemplateEmail
} from './email';
import { Order, User } from '@/store/types';

// Example 1: Sending order confirmation when order is placed
export const handleOrderPlaced = async (order: Order) => {
    try {
        await sendOrderConfirmationEmail(order);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        // Handle error appropriately
    }
};

// Example 2: Sending password reset email
export const handlePasswordResetRequest = async (email: string, resetToken: string) => {
    try {
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        const customerName = 'John Doe'; // Get from database
        
        await sendPasswordResetEmail(email, resetUrl, customerName);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        // Handle error appropriately
    }
};

// Example 3: Sending welcome email when user registers
export const handleUserRegistration = async (email: string, userData: User) => {
    try {
        await sendWelcomeEmail(email, userData);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Handle error appropriately
    }
};

// Example 4: Sending order shipped notification
export const handleOrderShipped = async (order: Order, trackingInfo: {
    trackingNumber: number;
    trackingUrl: string;
    estimatedDelivery: string;
    shippingMethod: string;
    carrier: string;

}) => {
    try {
        const shipmentData = {
            customerName: order.customer?.name,
            orderId: order.id,
            trackingNumber: trackingInfo.trackingNumber,
            trackingUrl: trackingInfo.trackingUrl,
            estimatedDelivery: trackingInfo.estimatedDelivery,
            shippingMethod: trackingInfo.shippingMethod,
            carrier: trackingInfo.carrier,
            shippedDate: new Date().toISOString(),
            orderItems: order.items,
            shippingAddress: order.shipping_address
        };
        
        await sendOrderShippedEmail(order.customer?.email as string, shipmentData);
        console.log('Order shipped email sent successfully');
    } catch (error) {
        console.error('Failed to send order shipped email:', error);
        // Handle error appropriately
    }
};

// Example 5: Using the generic template function for custom emails
export const sendCustomNotification = async (email: string, notificationData: {
    customerName: string;
    message: string;
    actionUrl: string;
    actionText: string;
}) => {
    try {
        const customData = {
            subject: 'Custom Notification - UVHub',
            customerName: notificationData.customerName,
            message: notificationData.message,
            actionUrl: notificationData.actionUrl,
            actionText: notificationData.actionText
        };
        
        // await sendTemplateEma.ORDER_CONFIRMATION, customData, email);
        console.log('Custom notification email sent successfully');
    } catch (error) {
        console.error('Failed to send custom notification email:', error);
        // Handle error appropriately
    }
};

// Example 6: Batch sending emails
export const sendBulkEmails = async (emails: string[], templateName: string, data: any) => {
    const results = [];
    
    for (const email of emails) {
        try {
            const result = await sendTemplateEmail(templateName as any, data, email);
            results.push({ email, success: true, messageId: result.messageId });
        } catch (error) {
            results.push({ email, success: false, error: (error as Error).message });
        }
    }
    
    return results;
};

// Example 7: Email with conditional content
export const sendPromotionalEmail = async (email: string, userData: any) => {
    try {
        const promotionalData = {
            subject: 'Special Offer Just for You!',
            customerName: userData.name,
            discountCode: userData.isVIP ? 'VIP20' : 'SAVE10',
            discountAmount: userData.isVIP ? 20 : 10,
            isVIP: userData.isVIP,
            // Add conditional content based on user type
            ...(userData.isVIP && {
                vipMessage: 'As a VIP customer, you get exclusive access to our premium collection!'
            })
        };
        
        // await sendTemplateEma.WELCOME, promotionalData, email);
        console.log('Promotional email sent successfully');
    } catch (error) {
        console.error('Failed to send promotional email:', error);
        // Handle error appropriately
    }
};

// Example 8: Error handling wrapper
export const sendEmailWithRetry = async (
    emailFunction: () => Promise<any>,
    maxRetries: number = 3
) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await emailFunction();
        } catch (error) {
            lastError = error;
            console.warn(`Email attempt ${attempt} failed:`, (error as Error).message);
            
            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }
    
    throw lastError;
};

// Example 9: Email queue system (simplified)
export class EmailQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;
    
    addToQueue(emailFunction: () => Promise<any>) {
        this.queue.push(emailFunction);
        this.processQueue();
    }
    
    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const emailFunction = this.queue.shift();
            if (emailFunction) {
                try {
                    await emailFunction();
                } catch (error) {
                    console.error('Email queue processing error:', error);
                }
            }
        }
        
        this.processing = false;
    }
}

// Example 10: Email analytics tracking
export const sendEmailWithTracking = async (
    emailFunction: () => Promise<any>,
    trackingData: any
) => {
    const startTime = Date.now();
    
    try {
        const result = await emailFunction();
        
        // Log successful email
        console.log('Email sent successfully:', {
            ...trackingData,
            duration: Date.now() - startTime,
            messageId: result.messageId
        });
        
        return result;
    } catch (error) {
        // Log failed email
        console.error('Email failed:', {
            ...trackingData,
            duration: Date.now() - startTime,
            error: (error as Error).message
        });
        
        throw error;
    }
}; 