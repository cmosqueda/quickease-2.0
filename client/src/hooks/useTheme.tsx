import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ThemeStore = {
  theme?: string;
  getTheme: () => void;
  setTheme: (theme: string) => void;
};

const useTheme = create<ThemeStore>()(
  immer((set, get) => ({
    theme: undefined,
    getTheme: async () => {
      const stored_theme = await localStorage.getItem("QUICKEASE_STORED_THEME");

      if (stored_theme) {
        document
          .querySelector("html")
          ?.setAttribute("data-theme", stored_theme);
        set((state) => {
          state.theme = stored_theme;
        });
      }
    },
    setTheme: (theme) => {
      set((state) => {
        state.theme = theme;
      });

      localStorage.setItem("QUICKEASE_STORED_THEME", theme);

      if (theme) {
        document.querySelector("html")?.setAttribute("data-theme", theme);
      } else if (theme != "dim") {
        document.querySelector("html")?.removeAttribute("data-theme");
      }
    },
  }))
);

export default useTheme;
