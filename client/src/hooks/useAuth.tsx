import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type AuthUserRecord = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: "male" | "female";
  phone_number?: string;
  badges: {
    id: string;
    title: string;
    description: string;
  };
  is_public: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

type AuthStore = {
  user?: AuthUserRecord;
  token?: string;
  setUser: (user: AuthUserRecord) => void;
  setToken: (token: string) => void;
  requestChangePassword: (id: string) => void;
  requestChangeEmail: (id: string) => void;
  changeName: (first_name: string, last_name: string) => void;
  togglePublicProfile: () => void;
};

const useAuth = create<AuthStore>()(
  immer((set, get) => ({
    user: undefined,
    token: undefined,
    setUser: (user) => {
      set((state) => {
        state.user = user;
      });
    },
    setToken: (token) => {
      set((state) => {
        state.token = token;
      });
    },
    requestChangePassword: (id) => {},
    requestChangeEmail: (id) => {},
    changeName: (first_name, last_name) => {},
    togglePublicProfile: () => {},
  }))
);

export default useAuth;
