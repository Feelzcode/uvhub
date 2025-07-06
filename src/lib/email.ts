import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
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

// For custom email notifications (optional - Supabase handles password reset emails)
export const sendCustomPasswordResetEmail = async (email: string, resetUrl: string) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Reset Password
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
    </div>
  `;

    return sendEmail({
        to: email,
        subject: 'Password Reset Request - UVHub Admin',
        html,
    });
}; 