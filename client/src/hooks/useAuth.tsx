import type { Flashcard, Note, Quiz } from "@/types/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export type AuthUserRecord = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: "male" | "female";
  phone_number: string;
  badges: {
    id: string;
    title: string;
    description: string;
  };
  is_public: boolean;
  is_verified: boolean;
  is_admin: true;
  created_at: string | Date;
  updated_at: string | Date;
  notes: Note[];
  quizzes: Quiz[];
  flashcards: Flashcard[];
};

type AuthStore = {
  user?: AuthUserRecord;
  token?: string;
  setUser: (user: AuthUserRecord) => void;
  setToken: (token: string) => void;
};

const useAuth = create<AuthStore>()(
  persist(
    immer((set) => ({
      user: undefined,
      token: undefined,
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),
    })),
    {
      name: "QUICKEASE_USER",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuth;
