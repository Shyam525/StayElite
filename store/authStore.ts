import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, type AuthResponse } from "@/services/authService";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: "GUEST" | "HOST" | "ADMIN";
  emailVerified: boolean;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<AuthResponse | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshTokenValue: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { refreshTokenValue } = get();
        set({ isLoading: true });

        try {
          if (refreshTokenValue) {
            await authService.logout(refreshTokenValue);
          }
        } catch (error) {
          console.warn("Logout request failed, clearing local auth state anyway.", error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      refreshToken: async () => {
        const { refreshTokenValue } = get();

        if (!refreshTokenValue) {
          set({ user: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false });
          return null;
        }

        try {
          const response = await authService.refreshToken(refreshTokenValue);
          set({
            accessToken: response.accessToken,
            refreshTokenValue: response.refreshToken,
            user: response.user,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshTokenValue: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "stayelite-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
