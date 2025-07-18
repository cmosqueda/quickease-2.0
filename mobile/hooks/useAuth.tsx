import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user/User";

type useAuth = {
  token?: string;
  user?: User;
  isAuthenticated: boolean;
  loginUser: () => void;
  logoutUser: () => void;
  registerUser: () => void;
  requestChangeEmail: () => void;
  requestChangePassword: () => void;
};

const useAuth = create(
  persist((set, get) => ({}), {
    name: "quickease-auth",
    storage: createJSONStorage(() => AsyncStorage),
  })
);

export default useAuth;
