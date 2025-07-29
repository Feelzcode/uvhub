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
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: null,
    loading: false,
    error: null,

    getSettings: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const settings = await response.json();
            set({ settings, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch settings',
                loading: false
            });
        }
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
                throw new Error('Failed to update settings');
            }

            const settings = await response.json();
            set({ settings, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update settings',
                loading: false
            });
        }
    },

    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
})); 