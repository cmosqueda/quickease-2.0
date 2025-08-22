import AsyncStorage from "@react-native-async-storage/async-storage";

import { User } from "@/types/user/types";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import _API_INSTANCE from "@/utils/axios";

type _useAuth = {
  user?: User;
  setUser: (user: User) => void;
};

const useAuth = create<_useAuth>()(
  persist(
    immer((set, get) => ({
      user: undefined,
      setUser: (user) => {
        set((state) => {
          state.user = user;
        });
      },
    })),
    {
      name: "quickease-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useAuth;
