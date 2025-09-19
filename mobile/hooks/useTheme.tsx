import AsyncStorage from "@react-native-async-storage/async-storage";
import _THEMES, { Theme } from "@/types/theme/Themes";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type _useTheme = {
  currentScheme: Theme;
  setCurrentScheme: (theme: keyof typeof _THEMES) => void;
};

/**
 * Custom hook for managing and persisting the application's theme scheme.
 *
 * Utilizes Zustand with `immer` for immutable state updates and `persist` middleware
 * to store the selected theme in AsyncStorage under the key "theme-storage".
 *
 * @returns An object containing:
 * - `currentScheme`: The currently active theme scheme.
 * - `setCurrentScheme(theme: keyof typeof _THEMES)`: Function to update the current theme scheme.
 */
const useTheme = create<_useTheme>()(
  persist(
    immer((set) => ({
      currentScheme: _THEMES.rush,
      setCurrentScheme: (theme) => {
        set((state) => {
          state.currentScheme = _THEMES[theme];
        });
      },
    })),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTheme;
