# Facebook Pixel Implementation Guide

## Overview

This implementation provides a comprehensive Facebook Pixel solution for the UVHub e-commerce application. The system includes an admin settings page where you can easily configure Facebook Pixel without touching any code.

## Features

### ✅ Admin Settings Page

- **Location**: `/admin/dashboard/settings`
- **Features**:
  - Enable/disable Facebook Pixel
  - Enter Facebook Pixel ID
  - Enable/disable Google Analytics
  - Enter Google Analytics ID
  - Manage site settings (name, description, contact info)

### ✅ Automatic Event Tracking

The system automatically tracks the following events:

1. **PageView** - When users visit any page
2. **ViewContent** - When users view product details
3. **AddToCart** - When users add items to cart
4. **InitiateCheckout** - When users start checkout process
5. **Purchase** - When users complete orders
6. **Lead** - When users sign up (ready for implementation)

### ✅ Google Analytics Integration

- Automatic Google Analytics 4 tracking
- E-commerce event tracking
- Cross-platform analytics

## Setup Instructions

### 1. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of database/settings_table.sql
```

### 2. Get Your Facebook Pixel ID

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager**
3. Click **Connect Data Sources**
4. Select **Web**
5. Choose **Facebook Pixel**
6. Follow the setup wizard
7. Copy your Pixel ID (format: `123456789012345`)

### 3. Configure Settings

1. Log into your admin dashboard
2. Go to **Settings** in the sidebar
3. Click on the **Analytics** tab
4. Enable Facebook Pixel
5. Enter your Pixel ID
6. Click **Save Changes**

## How It Works

### Automatic Tracking

The system automatically tracks user behavior:

```typescript
// Product View
trackViewContent("Product Name", "Category Name");

// Add to Cart
trackAddToCart(price, "NGN", "Product Name");

// Checkout
trackInitiateCheckout(total, "NGN");

// Purchase
trackPurchase(total, "NGN", "Order ID");
```

### Manual Tracking (Optional)

You can also manually track custom events:

```typescript
import { trackLead, trackSearch } from "@/components/FacebookPixel";

// Track lead generation
trackLead(100, "NGN");

// Track search
trackSearch("fitness equipment");
```

## Facebook Pixel Events Explained

### 1. PageView

- **When**: Every page load
- **Purpose**: Track website traffic
- **Data**: Page URL, title

### 2. ViewContent

- **When**: User views product details
- **Purpose**: Build product interest audiences
- **Data**: Product name, category, price

### 3. AddToCart

- **When**: User adds item to cart
- **Purpose**: Retarget cart abandoners
- **Data**: Product name, price, quantity

### 4. InitiateCheckout

- **When**: User starts checkout process
- **Purpose**: Retarget checkout abandoners
- **Data**: Cart total, items

### 5. Purchase

- **When**: User completes order
- **Purpose**: Build customer audiences, track conversions
- **Data**: Order total, order ID, items

## Benefits

### For Marketing

- **Retargeting**: Show ads to people who visited your site
- **Lookalike Audiences**: Find new customers similar to existing ones
- **Conversion Tracking**: Measure ad performance
- **Dynamic Ads**: Show relevant products to interested users

### For Business

- **Customer Insights**: Understand user behavior
- **ROI Measurement**: Track advertising spend effectiveness
- **Audience Building**: Create targeted customer segments
- **Sales Optimization**: Identify and fix conversion bottlenecks

## Testing Your Implementation

### 1. Facebook Pixel Helper

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedmjlckhdkpobimccg) Chrome extension
2. Visit your website
3. Check that events are firing correctly

### 2. Facebook Events Manager

1. Go to Events Manager
2. Check **Test Events** tab
3. Verify events are being received

### 3. Google Analytics

1. Go to Google Analytics
2. Check **Real-time** reports
3. Verify events are tracking

## Troubleshooting

### Common Issues

1. **Pixel Not Loading**

   - Check if Facebook Pixel is enabled in settings
   - Verify Pixel ID is correct
   - Check browser console for errors

2. **Events Not Firing**

   - Ensure settings are saved
   - Check if user is authenticated (for admin pages)
   - Verify network connectivity

3. **Duplicate Events**
   - Check for multiple pixel installations
   - Ensure AnalyticsWrapper is only used once

### Debug Mode

Enable debug mode in Facebook Events Manager to see detailed event data:

1. Go to Events Manager
2. Click **Test Events**
3. Enable **Test Mode**

## Advanced Configuration

### Custom Events

You can add custom event tracking:

```typescript
// In any component
import { trackCustomEvent } from "@/components/FacebookPixel";

trackCustomEvent("custom_event_name", {
  custom_parameter: "value",
  another_parameter: 123,
});
```

### Enhanced E-commerce

For more detailed e-commerce tracking:

```typescript
// Track product impressions
trackViewContent("Product Name", "Category", {
  value: 99.99,
  currency: "NGN",
  content_type: "product",
});
```

## Security & Privacy

### Data Protection

- Only essential data is sent to Facebook
- No personal information is shared
- Compliant with GDPR requirements

### User Consent

- Consider implementing cookie consent
- Respect user privacy preferences
- Provide opt-out mechanisms

## Support

### Getting Help

1. Check this documentation
2. Review Facebook Pixel documentation
3. Contact development team

### Useful Resources

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/)
- [Facebook Business Help](https://www.facebook.com/business/help)
- [Google Analytics Help](https://support.google.com/analytics/)

## Maintenance

### Regular Tasks

1. **Monthly**: Review event data in Facebook Events Manager
2. **Quarterly**: Update pixel implementation if needed
3. **Annually**: Review and optimize tracking strategy

### Updates

- Keep Facebook Pixel code updated
- Monitor for deprecated features
- Test after major updates

---

**Note**: This implementation is designed to be user-friendly and requires no coding knowledge to configure. Simply use the admin settings page to enable and configure Facebook Pixel tracking.
