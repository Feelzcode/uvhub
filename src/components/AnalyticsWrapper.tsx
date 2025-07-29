'use client'

import { useEffect } from 'react';
import { useSettingsStore } from '@/store';
import FacebookPixel from './FacebookPixel';
import GoogleAnalytics from './GoogleAnalytics';

interface AnalyticsWrapperProps {
    children: React.ReactNode;
}

export default function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
    const { getSettings } = useSettingsStore();

    useEffect(() => {
        // Load settings when the component mounts
        getSettings();
    }, [getSettings]);

    return (
        <>
            <FacebookPixel>
                <GoogleAnalytics>
                    {children}
                </GoogleAnalytics>
            </FacebookPixel>
        </>
    );
} 