'use client'

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store';
import FacebookPixel from './FacebookPixel';
import GoogleAnalytics from './GoogleAnalytics';
import ClientOnly from './ClientOnly';

interface AnalyticsWrapperProps {
    children: React.ReactNode;
}

export default function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getSettings, error, loading } = useSettingsStore();
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client side before loading settings
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // Only load settings after hydration is complete
        if (isClient) {
            // Use a small delay to ensure hydration is complete
            const timer = setTimeout(() => {
                getSettings().catch((error) => {
                    console.warn('Failed to load settings, using defaults:', error);
                });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [getSettings, isClient]);

    // Log any settings errors for debugging
    useEffect(() => {
        if (error && isClient) {
            console.warn('Settings error in AnalyticsWrapper:', error);
        }
    }, [error, isClient]);

    return (
        <>
            {children}
            <ClientOnly>
                <FacebookPixel />
                <GoogleAnalytics />
            </ClientOnly>
        </>
    );
} 