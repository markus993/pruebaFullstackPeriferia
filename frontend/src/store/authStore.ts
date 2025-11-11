import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authService } from "../services/authService";
import type { ApiUser } from "../types/api";
import { getErrorMessage } from "../utils/api";

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  isAuthenticating: boolean;
  isBootstrapping: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  bootstrap: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticating: false,
      isBootstrapping: true,
      error: null,
      async login(identifier: string, password: string) {
        set({ isAuthenticating: true, error: null });
        try {
          const { token, user } = await authService.login({ identifier, password });
          set({ token, user, isAuthenticating: false });
        } catch (error) {
          const message = getErrorMessage(error, "No pudimos iniciar sesión. Revisa tus credenciales.");
          set({
            error: message,
            isAuthenticating: false,
            token: null,
            user: null
          });
          throw error;
        }
      },
      logout() {
        set({ token: null, user: null, error: null });
      },
      async fetchProfile() {
        const token = get().token;
        if (!token) {
          return;
        }

        try {
          const profile = await authService.getProfile(token);
          set({ user: profile });
        } catch (error) {
          console.error("Error obteniendo el perfil", error);
          set({ token: null, user: null });
        }
      },
      bootstrap() {
        set({ isBootstrapping: true });

        const token = get().token;

        if (!token) {
          set({ isBootstrapping: false });
          return;
        }

        get()
          .fetchProfile()
          .catch(() => {
            set({ token: null, user: null });
          })
          .finally(() => {
            set({ isBootstrapping: false });
          });
      },
      clearError() {
        set({ error: null });
      }
    }),
    {
      name: "periferia-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
