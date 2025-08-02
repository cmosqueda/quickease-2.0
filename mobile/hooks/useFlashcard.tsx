import AsyncStorage from "@react-native-async-storage/async-storage";

import { Flashcard } from "@/types/user/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import _API_INSTANCE from "@/utils/axios";
import { ToastAndroid } from "react-native";

type _useFlashcard = {
  flashcards?: Flashcard[];
  setFlashcards: (flashcards: Flashcard[]) => void;
  addFlashcard: ({
    title,
    description,
    flashcards,
    isAI,
  }: {
    title: string;
    description: string;
    flashcards: Flashcard["flashcards"][];
    isAI: boolean;
  }) => void;
  deleteFlashcard: (flashcard_id: string) => void;
  editFlashcard: ({
    title,
    description,
    flashcards,
    flashcard_id,
  }: {
    title: string;
    description: string;
    flashcards: { front: string; back: string }[];
    flashcard_id: string;
  }) => void;

  toggleFlashcardVisibility: ({
    visibility,
    flashcard_id,
  }: {
    visibility: boolean;
    flashcard_id: string;
  }) => void;
};

const useFlashcard = create<_useFlashcard>()(
  persist(
    immer((set, get) => ({
      flashcards: [],

      setFlashcards: (flashcards) => set({ flashcards }),

      addFlashcard: async ({ title, description, flashcards, isAI }) => {
        try {
          const res = await _API_INSTANCE.post("/flashcard/create", {
            title,
            description,
            isAI,
            flashcards,
          });

          set((state) => {
            state.flashcards?.push(res.data);
          });
          return true;
        } catch (err) {
          ToastAndroid.show("Failed to create flashcard", ToastAndroid.SHORT);
          return false;
        }
      },

      deleteFlashcard: (flashcard_id) =>
        set((state) => {
          state.flashcards = state.flashcards?.filter(
            (fc) => fc.id !== flashcard_id
          );
        }),

      editFlashcard: async ({
        title,
        description,
        flashcards,
        flashcard_id,
      }) => {
        try {
          const res = await _API_INSTANCE.put("/flashcard/update", {
            title,
            description,
            flashcards,
            flashcard_id,
          });

          set((state) => {
            const index = state.flashcards?.findIndex(
              (fc) => fc.id === flashcard_id
            );
            if (index !== undefined && index !== -1) {
              state.flashcards![index] = res.data;
            }
          });

          return true;
        } catch (err) {
          ToastAndroid.show("Error updating flashcard.", ToastAndroid.SHORT);
          return false;
        }
      },

      toggleFlashcardVisibility: async ({ visibility, flashcard_id }) => {
        try {
          await _API_INSTANCE.put("flashcard/toggle-visibility", {
            visibility,
            flashcard_id,
          });

          set((state) => {
            const flashcard = state.flashcards?.find(
              (fc) => fc.id === flashcard_id
            );
            if (flashcard) {
              flashcard.is_public = visibility;
            }
          });

          ToastAndroid.show(
            "Flashcard visibility updated.",
            ToastAndroid.SHORT
          );
          return true;
        } catch (err) {
          ToastAndroid.show(
            "Error updating flashcard visibility.",
            ToastAndroid.SHORT
          );
          return false;
        }
      },
    })),
    {
      name: "user-flashcards",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        flashcards: state.flashcards,
      }),
    }
  )
);

export default useFlashcard;
