import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Auth state interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// Create auth store with persistence
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        login: (user, token) =>
          set(
            (state) => ({
              ...state,
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            }),
            false,
            "auth/login"
          ),

        logout: () =>
          set(
            (state) => ({
              ...state,
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            }),
            false,
            "auth/logout"
          ),

        setUser: (user) =>
          set(
            (state) => ({
              ...state,
              user,
            }),
            false,
            "auth/setUser"
          ),

        setLoading: (loading) =>
          set(
            (state) => ({
              ...state,
              isLoading: loading,
            }),
            false,
            "auth/setLoading"
          ),

        clearAuth: () =>
          set(
            (state) => ({
              ...state,
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            }),
            false,
            "auth/clearAuth"
          ),
      }),
      {
        name: "auth-storage",
        // Only persist non-sensitive data
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);
