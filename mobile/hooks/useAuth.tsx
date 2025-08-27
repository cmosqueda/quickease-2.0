import AsyncStorage from "@react-native-async-storage/async-storage";

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Note, User } from "@/types/user/types";

import _API_INSTANCE from "@/utils/axios";

type _useAuth = {
  user?: User;
  setUser: (user: User) => void;
  addNote: (note: Note) => void;
  editNote: (note: Note) => void;
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
      addNote: (note: Note) => {
        set((state) => {
          if (state.user) {
            state.user.notes = [...(state.user.notes ?? []), note];
          }
        });
      },
      editNote: (updatedNote: { id: string }) => {
        set((state) => {
          if (state.user && state.user.notes) {
            const index = state.user.notes.findIndex(
              (n) => n.id === updatedNote.id
            );
            if (index !== -1) {
              state.user.notes[index] = {
                ...state.user.notes[index],
                ...updatedNote,
              };
            }
          }
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
