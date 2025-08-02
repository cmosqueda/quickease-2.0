import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme?: string;
  setTheme: (theme: string) => void;
};

const useTheme = create<ThemeStore>()(
  persist(
    immer((set) => ({
      theme: undefined,
      setTheme: (theme: string) => {
        set((state) => {
          state.theme = theme;
        });

        if (theme) {
          document.querySelector("html")?.setAttribute("data-theme", theme);
        }
      },
    })),
    {
      name: "QUICKEASE_STORED_THEME",
      partialize: (state) => ({ theme: state.theme }), // Only persist `theme`
      onRehydrateStorage: () => (state) => {
        // Sync theme to <html> on rehydrate
        if (state?.theme) {
          document
            .querySelector("html")
            ?.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);

export default useTheme;
