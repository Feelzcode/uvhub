import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { User, UserActions, UserState } from '../types';

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
}

export const useUserStore = create<UserState & UserActions>()(
    devtools(
        persist((set, get) => ({
            ...initialState,

            // Actions
            setUser: (user) => set({ user: user as User }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),

            // Computed selectors
            getUser: () => get().user,
            isLoading: () => get().loading,
            hasError: () => get().error !== null,
        }), {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
        ))
)