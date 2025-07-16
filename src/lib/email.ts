import { Order } from '@/store/types';
import nodemailer from 'nodemailer';
import {
    compileOrderConfirmation,
    compilePasswordReset,
    compileWelcome,
    compileOrderShipped,
    compileTemplate,
    type EmailTemplateName
} from './email-templates';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: process.env.EMAIL_PORT as number, // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password for Gmail
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Failed to send email');
    }
};

// Generic template email sender
export const sendTemplateEmail = async (
    templateName: EmailTemplateName,
    data: Record<string, unknown>,
    to: string
) => {
    try {
        const html = compileTemplate(templateName, data);
        const subject = data.subject as string || 'Message from UVHub';

        return sendEmail({
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error(`Error sending template email ${templateName}:`, error);
        throw new Error(`Failed to send ${templateName} email`);
    }
};

// Order Confirmation Email
export const sendOrderConfirmationEmail = async (order: Order) => {
    const html = compileOrderConfirmation(order);

    return sendEmail({
        to: order.customer?.email as string,
        subject: 'Order Confirmation - UVHub',
        html,
    });
};

// Password Reset Email
export const sendPasswordResetEmail = async (email: string, resetUrl: string, customerName: string) => {
    const html = compilePasswordReset({
        customerName,
        resetUrl,
    });

    return sendEmail({
        to: email,
        subject: 'Password Reset Request - UVHub',
        html,
    });
};

// Welcome Email
export const sendWelcomeEmail = async (email: string, userData: Record<string, unknown>) => {
    const html = compileWelcome(userData);

    return sendEmail({
        to: email,
        subject: 'Welcome to UVHub!',
        html,
    });
};

// Order Shipped Email
export const sendOrderShippedEmail = async (email: string, shipmentData: Record<string, unknown>) => {
    const html = compileOrderShipped(shipmentData);

    return sendEmail({
        to: email,
        subject: 'Your Order Has Been Shipped - UVHub',
        html,
    });
};

// Legacy function for backward compatibility
export const sendOrderPlacedEmail = async (order: Order) => {
    return sendOrderConfirmationEmail(order);
};