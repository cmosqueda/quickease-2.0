import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: string; // relational
};

type NoteStore = {
  notes?: Note[];
  createNote: () => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
};

const useNote = create<NoteStore>()(
  immer((set, get) => ({
    notes: undefined,
    createNote: async () => {},
    updateNote: async (id, title, content) => {},
  }))
);

export default useNote;
