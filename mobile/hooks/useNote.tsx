import AsyncStorage from "@react-native-async-storage/async-storage";
import _API_INSTANCE from "@/utils/axios";

import { Note } from "@/types/user/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type _useNote = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: ({
    title,
    notes_content,
    user_id,
  }: {
    title: string;
    notes_content: string;
    user_id: string;
  }) => void;
  deleteNote: (note_id: string) => void;

  editNote: ({
    note_id,
    title,
    notes_content,
  }: {
    note_id: string;
    title: string;
    notes_content: string;
  }) => void;

  toggleNoteVisibility: ({
    visibility,
    note_id,
  }: {
    visibility: boolean;
    note_id: string;
  }) => void;
};

const useNote = create<_useNote>()(
  persist(
    immer((set, get) => ({
      notes: [],

      setNotes: (notes) => set({ notes }),

      addNote: async ({ title, notes_content, user_id }) => {
        try {
          const newNote = await _API_INSTANCE.post("note/create", {
            title,
            notes_content,
            user_id,
          });

          set((state) => {
            state.notes.push(newNote.data);
          });

          return true;
        } catch (err) {
          return false;
        }
      },

      deleteNote: async (note_id) => {
        try {
          await _API_INSTANCE.delete("note/delete", { data: { note_id } });

          set((state) => {
            state.notes = state.notes.filter((n) => n.id !== note_id);
          });

          return true;
        } catch (err) {
          return false;
        }
      },

      editNote: async ({ note_id, title, notes_content }) => {
        try {
          await _API_INSTANCE.put("note/update", {
            title,
            notes_content,
            note_id,
          });

          set((state) => {
            const note = state.notes.find((n) => n.id === note_id);
            if (note) {
              note.title = title;
              note.notes_content = notes_content;
            }
          });
        } catch (err) {
          return false;
        }
      },

      toggleNoteVisibility: async ({ visibility, note_id }) => {
        try {
          await _API_INSTANCE.put("note/toggle-visibility", {
            visibility,
            note_id,
          });

          set((state) => {
            const note = state.notes.find((n) => n.id === note_id);
            if (note) {
              note.is_public = visibility;
            }
          });
        } catch (err) {
          return false;
        }
      },
    })),
    {
      name: "user-notes",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notes: state.notes,
      }),
    }
  )
);

export default useNote;
