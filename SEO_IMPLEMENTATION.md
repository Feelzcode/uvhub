# SEO Implementation Guide for UVHub

## Overview

This document outlines the SEO implementation for the UVHub application using a hybrid approach:
- **Next.js Metadata API** for server components
- **next-seo** for client components

## Architecture

### Global SEO Configuration
- **Location**: `src/app/layout.tsx`
- **Method**: Next.js Metadata API
- **Features**: 
  - Title template (`%s | UVHub`)
  - Default title and description
  - Open Graph and Twitter meta tags
  - Global image configuration

### Page-Level SEO

#### Server Components (using Next.js Metadata API)
- Admin Dashboard pages
- Products Management
- Orders Management

#### Client Components (using next-seo)
- Home page
- About page
- All Products page
- Contact Us page
- Cart page
- Product Details page
- Order Confirmation page
- Admin Auth pages

## Implementation Examples

### Server Component SEO
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description for SEO",
  openGraph: {
    title: "Open Graph Title",
    description: "Open Graph description",
  },
};
```

### Client Component SEO
```typescript
import { NextSeo } from 'next-seo';

export default function MyPage() {
  return (
    <>
      <NextSeo
        title="Page Title | UVHub"
        description="Page description for SEO"
        openGraph={{
          title: "Open Graph Title",
          description: "Open Graph description",
        }}
      />
      {/* Your component content */}
    </>
  );
}
```

### Dynamic SEO (Client Components)
```typescript
{product && (
  <NextSeo
    title={`${product.name} | UVHub`}
    description={product.description || 'Default description'}
    openGraph={{
      title: `${product.name} | UVHub`,
      description: product.description || 'Default description',
      images: [
        { url: product.image || '/images/default.jpg', alt: product.name },
      ],
    }}
  />
)}
```

## Current SEO Implementation

### ✅ Completed Pages

#### Public Pages
- **Home** (`/home`) - Client component with NextSeo
- **About** (`/home/about`) - Client component with NextSeo
- **All Products** (`/home/all-products`) - Client component with NextSeo
- **Product Details** (`/home/product/[id]`) - Client component with dynamic NextSeo
- **Cart** (`/cart`) - Client component with NextSeo
- **Order Confirmation** (`/home/order-confirmation/[id]`) - Client component with dynamic NextSeo
- **Contact Us** (`/contact-us`) - Client component with NextSeo

#### Admin Pages
- **Dashboard** (`/admin/dashboard`) - Server component with Metadata API
- **Products Management** (`/admin/dashboard/products`) - Server component with Metadata API
- **Orders Management** (`/admin/dashboard/orders`) - Server component with Metadata API
- **Sign In** (`/admin/sign-in`) - Client component with NextSeo
- **Forgot Password** (`/admin/forgot-password`) - Client component with NextSeo
- **Reset Password** (`/admin/reset-password`) - Client component with NextSeo

## Best Practices

### 1. Title Format
- Use the format: `"Page Name | UVHub"`
- For dynamic pages: `"${dynamicValue} | UVHub"`

### 2. Description Length
- Keep descriptions between 150-160 characters
- Include relevant keywords naturally
- Make them compelling and descriptive

### 3. Open Graph Images
- Use images with 1200x630 aspect ratio
- Ensure images are optimized for web
- Provide meaningful alt text

### 4. Dynamic Content
- Always provide fallback values for dynamic content
- Use conditional rendering for dynamic SEO
- Ensure SEO updates when data changes

## Adding SEO to New Pages

### For Server Components
1. Import the Metadata type: `import type { Metadata } from "next";`
2. Add metadata export before the component:
```typescript
export const metadata: Metadata = {
  title: "Your Page Title",
  description: "Your page description",
};
```

### For Client Components
1. Import NextSeo: `import { NextSeo } from 'next-seo';`
2. Add NextSeo component at the top of your return statement:
```typescript
return (
  <>
    <NextSeo
      title="Your Page Title | UVHub"
      description="Your page description"
    />
    {/* Your component content */}
  </>
);
```

## SEO Features Included

### ✅ Implemented
- Page titles and descriptions
- Open Graph meta tags
- Twitter Card meta tags
- Dynamic SEO for product pages
- Global SEO defaults
- Title templates

### 🔄 Future Enhancements
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt
- Canonical URLs
- Meta robots tags
- Language alternates

## Troubleshooting

### Common Issues

1. **"Invalid hook call" error**
   - **Cause**: Using next-seo in server components
   - **Solution**: Use Next.js Metadata API for server components

2. **SEO not updating**
   - **Cause**: Client-side rendering delays
   - **Solution**: Ensure NextSeo is placed at the top of the component return

3. **Dynamic content not reflected in SEO**
   - **Cause**: SEO set before data loads
   - **Solution**: Use conditional rendering with NextSeo

### Debugging Tips
- Use browser dev tools to inspect meta tags
- Test with social media debugging tools
- Verify Open Graph with Facebook Sharing Debugger
- Check Twitter Card Validator

## Maintenance

### Regular Tasks
- Update product descriptions and images
- Review and optimize page titles
- Monitor search console performance
- Update meta descriptions for seasonal content

### Performance Monitoring
- Track Core Web Vitals
- Monitor page load speeds
- Check mobile responsiveness
- Validate structured data

## Resources

- [Next.js Metadata API Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [next-seo Documentation](https://github.com/garmeeh/next-seo)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) 