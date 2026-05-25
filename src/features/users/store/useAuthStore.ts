import { create } from "zustand";

import { persist } from "zustand/middleware";

import type {
  UserPublic,
  UserRole,
} from "../types/users.types";

import * as authApi from "../../../api/authApi";

interface AuthState {
  user: UserPublic | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  error: string | null;

  hasRole: (...roles: UserRole[]) => boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<void>;

  clearSession: () => void;

  setError: (msg: string | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      accessToken: null,

      isAuthenticated: false,

      isLoading: false,

      error: null,

      setError: (msg) =>
        set({ error: msg }),

      hasRole: (...roles) => {
        const { user } = get();

        if (!user) return false;

        return user.roles.some((rol) =>
          roles.includes(rol.codigo)
        );
      },

      clearSession: () =>
        set({
          user: null,

          accessToken: null,

          isAuthenticated: false,

          error: null,
        }),

      checkAuth: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          return;
        }

        set({
          isLoading: true,

          error: null,
        });

        try {
          const userId =
            authApi.getUserIdFromToken(
              accessToken
            );

          const user =
            await authApi.requestUserById(
              userId,
              accessToken
            );

          set({
            user,

            isAuthenticated: true,

            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,

            accessToken: null,

            isAuthenticated: false,

            error:
              "Error al verificar autenticación",

            isLoading: false,
          });
        }
      },

      login: async (
        email,
        password
      ) => {
        set({
          isLoading: true,

          error: null,
        });

        try {
          const token =
            await authApi.requestLogin({
              email,
              password,
            });

          const userId =
            authApi.getUserIdFromToken(
              token.access_token
            );

          const user =
            await authApi.requestUserById(
              userId,
              token.access_token
            );

          set({
            user,

            accessToken:
              token.access_token,

            isAuthenticated: true,

            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,

            accessToken: null,

            isAuthenticated: false,

            error:
              "Error al iniciar sesión",

            isLoading: false,
          });

          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();

        try {
          if (accessToken) {
            await authApi.requestLogout(
              accessToken
            );
          }
        } catch (error) {
          console.error(
            "Error al cerrar sesión",
            error
          );
        } finally {
          set({
            user: null,

            accessToken: null,

            isAuthenticated: false,

            error: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);

export { useAuthStore };