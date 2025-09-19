import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";

type useSettings = {
  pomodoroInDrawerVisibility: boolean;
  setPomodoroInDrawerVisibility: (visibility: boolean) => void;
};

/**
 * Custom hook for managing application settings using Zustand, Immer, and persistent storage.
 *
 * @remarks
 * This hook provides state and setter for the visibility of the Pomodoro timer in the drawer.
 * The state is persisted in AsyncStorage under the key "app-settings".
 *
 * @returns
 * - `pomodoroInDrawerVisibility`: boolean indicating if the Pomodoro timer is visible in the drawer.
 * - `setPomodoroInDrawerVisibility`: function to update the visibility state.
 *
 * @example
 * const { pomodoroInDrawerVisibility, setPomodoroInDrawerVisibility } = useSettings();
 */
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
