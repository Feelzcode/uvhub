# Email Templates System

This directory contains Handlebars-based email templates for the UVHub application. The templates are designed to be responsive, modern, and easily customizable.

## Structure

```
src/templates/emails/
├── base.hbs              # Base template with common styling and layout
├── order-confirmation.hbs # Order confirmation email
├── password-reset.hbs     # Password reset email
├── welcome.hbs           # Welcome email for new users
├── order-shipped.hbs     # Order shipped notification
└── README.md             # This documentation
```

## Base Template

The `base.hbs` template provides:
- Responsive design with mobile-first approach
- Modern gradient header
- Consistent styling across all emails
- Footer with company information
- CSS-in-HTML for maximum email client compatibility

### Base Template Variables

- `{{companyName}}` - Company name
- `{{companyTagline}}` - Company tagline
- `{{currentYear}}` - Current year
- `{{companyAddress}}` - Company address
- `{{websiteUrl}}` - Company website URL
- `{{supportEmail}}` - Support email
- `{{privacyUrl}}` - Privacy policy URL
- `{{{body}}}` - Main content area (triple braces for HTML)

## Available Templates

### 1. Order Confirmation (`order-confirmation.hbs`)

**Usage:**
```typescript
import { sendOrderConfirmationEmail } from '@/lib/email';

await sendOrderConfirmationEmail(order);
```

**Variables:**
- `{{customerName}}` - Customer's name
- `{{orderId}}` - Order ID
- `{{orderDate}}` - Order date
- `{{orderTotal}}` - Order total amount
- `{{currency}}` - Currency symbol
- `{{paymentMethod}}` - Payment method used
- `{{orderStatus}}` - Current order status
- `{{orderItems}}` - Array of order items
- `{{shippingAddress}}` - Shipping address object
- `{{orderTrackingUrl}}` - URL to track the order

### 2. Password Reset (`password-reset.hbs`)

**Usage:**
```typescript
import { sendPasswordResetEmail } from '@/lib/email';

await sendPasswordResetEmail(email, resetUrl, customerName);
```

**Variables:**
- `{{customerName}}` - Customer's name
- `{{resetUrl}}` - Password reset URL
- `{{expiryTime}}` - Link expiry time

### 3. Welcome Email (`welcome.hbs`)

**Usage:**
```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail(email, userData);
```

**Variables:**
- `{{customerName}}` - Customer's name
- `{{discountPercentage}}` - Welcome discount percentage
- `{{welcomeCode}}` - Welcome discount code
- `{{dashboardUrl}}` - Dashboard URL

### 4. Order Shipped (`order-shipped.hbs`)

**Usage:**
```typescript
import { sendOrderShippedEmail } from '@/lib/email';

await sendOrderShippedEmail(email, shipmentData);
```

**Variables:**
- `{{customerName}}` - Customer's name
- `{{orderId}}` - Order ID
- `{{trackingNumber}}` - Tracking number
- `{{trackingUrl}}` - Tracking URL
- `{{estimatedDelivery}}` - Estimated delivery date
- `{{shippingMethod}}` - Shipping method
- `{{carrier}}` - Shipping carrier
- `{{shippedDate}}` - Date shipped
- `{{orderItems}}` - Array of order items
- `{{shippingAddress}}` - Shipping address

## Custom Handlebars Helpers

The system includes several custom helpers:

- `{{formatCurrency amount currency}}` - Format currency
- `{{formatDate date}}` - Format date
- `{{formatDateTime date}}` - Format date and time
- `{{lowercase str}}` - Convert to lowercase
- `{{uppercase str}}` - Convert to uppercase

## Creating New Templates

1. Create a new `.hbs` file in this directory
2. Use the base template as a partial: `{{#> base}}...{{/base}}`
3. Add your content inside the partial block
4. Create a compilation function in `src/lib/email-templates.ts`
5. Add a sending function in `src/lib/email.ts`

### Example Template Structure

```handlebars
{{#> base}}
    <h2>Your Email Title</h2>
    
    <p>Hello {{customerName}},</p>
    
    <p>Your email content here...</p>
    
    <div class="info-card">
        <!-- Your structured content -->
    </div>
    
    <p>Best regards,<br>The {{companyName}} Team</p>
{{/base}}
```

## Styling Guidelines

- Use inline CSS for maximum email client compatibility
- Keep images under 600px width for responsive design
- Use web-safe fonts or system fonts
- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Use tables for complex layouts if needed
- Avoid JavaScript (not supported in emails)

## Testing Templates

You can test templates by creating a test data object and using the compilation functions:

```typescript
import { compileTemplate } from '@/lib/email-templates';

const testData = {
    customerName: 'John Doe',
    orderId: 'ORD-12345',
    // ... other test data
};

const html = compileTemplate('order-confirmation', testData);
console.log(html);
```

## Email Client Compatibility

The templates are designed to work with:
- Gmail (web and mobile)
- Outlook (all versions)
- Apple Mail
- Yahoo Mail
- Thunderbird
- Mobile email clients

## Customization

To customize the templates:
1. Modify the base template for global changes
2. Update individual templates for specific emails
3. Adjust the default company information in `email-templates.ts`
4. Add new helpers for custom formatting needs

## Environment Variables

Make sure these environment variables are set:
- `EMAIL_USER` - Email service username
- `EMAIL_PASS` - Email service password
- `NEXT_PUBLIC_APP_URL` - Application URL for links 