import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";

type useSettings = {
  pomodoroInDrawerVisibility: boolean;
  setPomodoroInDrawerVisibility: (visibility: boolean) => void;
};

const useSettings = create<useSettings>()(
  persist(
    immer((set) => ({
      pomodoroInDrawerVisibility: true,
      setPomodoroInDrawerVisibility: (visibility: boolean) => {
        set((state) => {
          state.pomodoroInDrawerVisibility = visibility;
        });
      },
    })),
    {
      name: "app-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pomodoroInDrawerVisibility: state.pomodoroInDrawerVisibility,
      }),
    }
  )
);

export default useSettings;
