'use client'

import { useEffect } from 'react';
import { useSettingsStore } from '@/store';

declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
    }
}

interface FacebookPixelProps {
    children: React.ReactNode;
}

export default function FacebookPixel({ children }: FacebookPixelProps) {
    const { settings } = useSettingsStore();

    useEffect(() => {
        if (!settings?.facebook_pixel_enabled || !settings?.facebook_pixel_id) {
            return;
        }

        // Load Facebook Pixel script
        const script = document.createElement('script');
        script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
        document.head.appendChild(script);

        // Initialize Facebook Pixel after script loads
        script.onload = () => {
            if (window.fbq) {
                window.fbq('init', settings.facebook_pixel_id);
                window.fbq('track', 'PageView');
            }
        };

        // Add noscript fallback
        const noscript = document.createElement('noscript');
        const img = document.createElement('img');
        img.height = 1;
        img.width = 1;
        img.style.display = 'none';
        img.src = `https://www.facebook.com/tr?id=${settings.facebook_pixel_id}&ev=PageView&noscript=1`;
        noscript.appendChild(img);
        document.head.appendChild(noscript);

        return () => {
            // Cleanup
            const existingScript = document.querySelector('script[src*="fbevents.js"]');
            if (existingScript) {
                existingScript.remove();
            }
            const existingNoscript = document.querySelector('noscript img[src*="facebook.com/tr"]');
            if (existingNoscript?.parentElement) {
                existingNoscript.parentElement.remove();
            }
        };
    }, [settings?.facebook_pixel_enabled, settings?.facebook_pixel_id]);

    return <>{children}</>;
}

// Facebook Pixel event tracking functions
export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
};

export const trackViewContent = (contentName: string, contentCategory?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
            content_name: contentName,
            content_category: contentCategory,
        });
    }
};

export const trackAddToCart = (value: number, currency: string = 'NGN', contentName?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
            value: value,
            currency: currency,
            content_name: contentName,
        });
    }
};

export const trackPurchase = (value: number, currency: string = 'NGN', contentName?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            value: value,
            currency: currency,
            content_name: contentName,
        });
    }
};

export const trackLead = (value?: number, currency: string = 'NGN') => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
            value: value,
            currency: currency,
        });
    }
};

export const trackSearch = (searchString: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Search', {
            search_string: searchString,
        });
    }
};

export const trackInitiateCheckout = (value: number, currency: string = 'NGN') => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            value: value,
            currency: currency,
        });
    }
};