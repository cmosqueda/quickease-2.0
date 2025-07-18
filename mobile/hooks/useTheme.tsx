import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type useTheme = {
  currentScheme?: "light" | "dark";
  toggleColorScheme: () => void;
};

const useTheme = create<useTheme>()(
  immer((set, get) => ({
    currentScheme: undefined,
    toggleColorScheme: () => {
      set((state) => {
        if (state.currentScheme === "light") {
          state.currentScheme = "light";
        } else {
          state.currentScheme = "dark";
        }
      });
    },
  }))
);

export default useTheme;
