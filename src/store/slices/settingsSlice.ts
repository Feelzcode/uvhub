import { create } from 'zustand';
import { Settings } from '../types';

interface SettingsState {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
}

interface SettingsActions {
    getSettings: () => Promise<void>;
    updateSettings: (settings: Partial<Settings>) => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getDefaultSettings: () => Settings;
    getCurrentSettings: () => Settings;
}

type SettingsStore = SettingsState & SettingsActions;

// Default settings fallback - using static dates to prevent hydration mismatch
const defaultSettings: Settings = {
    id: 'default',
    facebook_pixel_id: '',
    facebook_pixel_enabled: false,
    google_analytics_id: '',
    google_analytics_enabled: false,
    site_name: 'UVHub',
    site_description: 'Your Ultimate Shopping Destination',
    contact_email: '',
    contact_phone: '',
    created_at: '2024-01-01T00:00:00.000Z', // Static date
    updated_at: '2024-01-01T00:00:00.000Z', // Static date
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: null, // Start with null to prevent hydration mismatch
    loading: false,
    error: null,

    getDefaultSettings: () => defaultSettings,
    getCurrentSettings: () => {
        const state = get();
        return state.settings || defaultSettings;
    },

    getSettings: async () => {
        // Set default settings immediately to prevent hydration issues
        set({ settings: defaultSettings, loading: true, error: null });
        
        // Retry logic with exponential backoff
        const maxRetries = 3;
        let retryCount = 0;
        
        const attemptFetch = async (): Promise<void> => {
            try {
                const response = await fetch('/api/settings');
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error(`Settings fetch attempt ${retryCount + 1} failed:`, response.status, errorData);
                    
                    // If it's a server error and we haven't exceeded retries, try again
                    if (response.status >= 500 && retryCount < maxRetries - 1) {
                        retryCount++;
                        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return attemptFetch();
                    }
                    
                    // If it's a server error or we've exceeded retries, use default settings
                    if (response.status >= 500) {
                        console.warn('Using default settings due to server error after retries');
                        set({ 
                            settings: defaultSettings, 
                            loading: false,
                            error: 'Server error - using default settings'
                        });
                        return;
                    }
                    
                    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
                }
                
                const settings = await response.json();
                set({ settings, loading: false, error: null });
                console.log('Settings loaded successfully');
            } catch (error) {
                console.error(`Settings fetch error (attempt ${retryCount + 1}):`, error);
                
                // If we haven't exceeded retries, try again
                if (retryCount < maxRetries - 1) {
                    retryCount++;
                    const delay = Math.pow(2, retryCount) * 1000;
                    console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return attemptFetch();
                }
                
                // On final error, fall back to default settings
                set({
                    settings: defaultSettings,
                    error: error instanceof Error ? error.message : 'Failed to fetch settings - using defaults',
                    loading: false
                });
            }
        };
        
        await attemptFetch();
    },

    updateSettings: async (updatedSettings: Partial<Settings>) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const settings = await response.json();
            set({ settings, loading: false, error: null });
        } catch (error) {
            console.error('Settings update error:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to update settings',
                loading: false
            });
        }
    },

    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
})); 