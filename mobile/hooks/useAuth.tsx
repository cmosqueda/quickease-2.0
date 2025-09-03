import AsyncStorage from "@react-native-async-storage/async-storage";

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Flashcard, Note, Quiz, User } from "@/types/user/types";
import { addItem, deleteItem, editItem } from "@/utils/helpers";

type _useAuth = {
  user?: User;
  setUser: (user: User) => void;
  addNote: (note: Note) => void;
  editNote: (updatedNote: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  addQuiz: (quiz: Quiz) => void;
  editQuiz: (updatedQuiz: Partial<Quiz> & { id: string }) => void;
  deleteQuiz: (id: string) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  editFlashcard: (
    updatedFlashcard: Partial<Flashcard> & { id: string }
  ) => void;
  deleteFlashcard: (id: string) => void;
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
      addNote: (note) => {
        set((state) => addItem(state, "notes", note));
      },
      editNote: (updatedNote) => {
        set((state) => editItem(state, "notes", updatedNote));
      },
      deleteNote: (id) => {
        set((state) => deleteItem(state, "notes", id));
      },
      addQuiz: (quiz) => {
        set((state) => addItem(state, "quizzes", quiz));
      },
      editQuiz: (updatedQuiz) => {
        set((state) => editItem(state, "quizzes", updatedQuiz));
      },
      deleteQuiz: (id) => {
        set((state) => deleteItem(state, "quizzes", id));
      },
      addFlashcard: (flashcard) => {
        set((state) => addItem(state, "flashcards", flashcard));
      },
      editFlashcard: (updatedFlashcard) => {
        set((state) => editItem(state, "flashcards", updatedFlashcard));
      },
      deleteFlashcard: (id) => {
        set((state) => deleteItem(state, "flashcards", id));
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
