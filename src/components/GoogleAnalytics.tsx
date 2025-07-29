'use client'

import { useEffect } from 'react';
import { useSettingsStore } from '@/store';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
    }
}

interface GoogleAnalyticsProps {
    children: React.ReactNode;
}

export default function GoogleAnalytics({ children }: GoogleAnalyticsProps) {
    const { settings } = useSettingsStore();

    useEffect(() => {
        if (!settings?.google_analytics_enabled || !settings?.google_analytics_id) {
            return;
        }

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (...args: unknown[]) {
            window.dataLayer.push(args);
        };
        window.gtag('js', new Date());
        window.gtag('config', settings.google_analytics_id, {
            page_title: document.title,
            page_location: window.location.href,
        });

        return () => {
            // Cleanup
            const existingScript = document.querySelector(`script[src*="${settings.google_analytics_id}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [settings?.google_analytics_enabled, settings?.google_analytics_id]);

    return <>{children}</>;
}

// Google Analytics event tracking functions
export const trackGAEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackGAPageView = (page_path: string, page_title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: page_path,
            page_title: page_title,
        });
    }
};

// Helper functions for common e-commerce events
export const trackGAViewItem = (item_id: string, item_name: string, price: number, currency: string = 'NGN') => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'view_item', {
            currency: currency,
            value: price,
            items: [{
                item_id: item_id,
                item_name: item_name,
                price: price,
                currency: currency,
            }],
        });
    }
};

export const trackGAAddToCart = (item_id: string, item_name: string, price: number, quantity: number, currency: string = 'NGN') => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
            currency: currency,
            value: price * quantity,
            items: [{
                item_id: item_id,
                item_name: item_name,
                price: price,
                quantity: quantity,
                currency: currency,
            }],
        });
    }
};

export const trackGAPurchase = (transaction_id: string, value: number, currency: string = 'NGN', items: unknown[] = []) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: transaction_id,
            value: value,
            currency: currency,
            items: items,
        });
    }
};

export const trackGABeginCheckout = (value: number, currency: string = 'NGN', items: unknown[] = []) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
            value: value,
            currency: currency,
            items: items,
        });
    }
};
