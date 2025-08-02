import AsyncStorage from "@react-native-async-storage/async-storage";

import { User } from "@/types/user/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type _useAuth = {
  token?: string;
  user?: User;
  isAuthenticated: boolean;
  loginUser: (token?: string, user?: User) => void;
  logoutUser: () => void;
  registerUser: () => void;
  toggleProfileVisibility: (visibility: boolean) => void;
  requestChangeEmail: () => void;
  requestChangePassword: () => void;
};

const useAuth = create<_useAuth>()(
  persist(
    (set, get) => ({
      token: undefined,
      user: undefined,
      isAuthenticated: false,

      loginUser: (token?: string, user?: User) => {
        set(() => ({
          token,
          user,
          isAuthenticated: true,
        }));
      },

      logoutUser: () => {
        set(() => ({
          token: undefined,
          user: undefined,
          isAuthenticated: false,
        }));
      },

      registerUser: () => {
        // placeholder for registration logic
      },

      requestChangeEmail: () => {
        // placeholder for email change logic
      },

      requestChangePassword: () => {
        // placeholder for password change logic
      },

      toggleProfileVisibility: (visibility: boolean) => {
        // placeholder for visibility logic
      },
    }),
    {
      name: "app-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuth;
