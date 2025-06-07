import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Flashcard = {
  front: string;
  back: string;
};

type Flashcards = {
  id: string;
  title: string;
  description: string;
  flashcards: Flashcard[];
  created_at: string | Date;
  updated_at: string | Date;
  user: string; // relational -> user
};

type FlashcardStore = {
  flashcard?: Flashcards[];
  createFlashcard: (
    flashcards: Flashcard[],
    title: string,
    description: string
  ) => void;
  updateFlashcard: (
    id: string,
    flashcards: Flashcard[],
    title: string,
    description: string
  ) => void;
  deleteFlashcard: (id: string) => void;
};

const useFlashcards = create<FlashcardStore>()(
  immer((set, get) => ({
    flashcard: undefined,
    createFlashcard: (flashcards, title, description) => {},
    updateFlashcard: (id, flashcards, title, description) => {},
    deleteFlashcard: (id) => {},
  }))
);

export default useFlashcards;
