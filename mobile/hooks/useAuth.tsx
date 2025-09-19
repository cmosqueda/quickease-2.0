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

/**
 * Custom hook for managing authentication and user-related data using Zustand, Immer, and persistent storage.
 *
 * @remarks
 * This hook provides state management for the authenticated user and CRUD operations for notes, quizzes, and flashcards.
 * State is persisted in AsyncStorage under the key "quickease-auth", but only the `user` property is persisted.
 *
 * @returns Zustand store with the following properties and methods:
 * - `user`: The currently authenticated user (or `undefined`).
 * - `setUser(user)`: Sets the authenticated user.
 * - `addNote(note)`: Adds a new note to the state.
 * - `editNote(updatedNote)`: Updates an existing note in the state.
 * - `deleteNote(id)`: Deletes a note by its ID.
 * - `addQuiz(quiz)`: Adds a new quiz to the state.
 * - `editQuiz(updatedQuiz)`: Updates an existing quiz in the state.
 * - `deleteQuiz(id)`: Deletes a quiz by its ID.
 * - `addFlashcard(flashcard)`: Adds a new flashcard to the state.
 * - `editFlashcard(updatedFlashcard)`: Updates an existing flashcard in the state.
 * - `deleteFlashcard(id)`: Deletes a flashcard by its ID.
 *
 * @example
 * ```tsx
 * const { user, setUser, addNote } = useAuth();
 * setUser({ id: 1, name: "Alice" });
 * addNote({ id: 1, content: "My first note" });
 * ```
 */
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
