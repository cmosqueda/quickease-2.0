import AsyncStorage from "@react-native-async-storage/async-storage";
import _THEMES, { Theme } from "@/types/theme/Themes";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type _useTheme = {
  currentScheme: Theme;
  setCurrentScheme: (theme: keyof typeof _THEMES) => void;
};

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
