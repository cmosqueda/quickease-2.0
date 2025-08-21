import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Mode = "study" | "shortBreak" | "longBreak";

type TimerSettings = {
  study: number;
  shortBreak: number;
  longBreak: number;
};

type TimerStore = {
  time: number;
  isRunning: boolean;
  mode: Mode;
  settings: TimerSettings;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  startStudy: () => void;
  startShortBreak: () => void;
  startLongBreak: () => void;
  setDurations: (newSettings: TimerSettings) => void;
  setSettings: (study: number, short_break: number) => void;
};

// defaults if AsyncStorage is empty
const defaultSettings: TimerSettings = {
  study: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const useTimer = create<TimerStore>()(
  persist(
    immer((set, get) => ({
      settings: defaultSettings,
      time: defaultSettings.study,
      isRunning: false,
      mode: "study",
      start: () => {
        set((state) => {
          state.isRunning = true;
        });
      },
      pause: () => {
        set((state) => {
          state.isRunning = false;
        });
      },
      reset: () => {
        const { mode, settings } = get();
        set((state) => {
          state.isRunning = false;
          state.time =
            mode === "study"
              ? settings.study
              : mode === "shortBreak"
                ? settings.shortBreak
                : settings.longBreak;
        });
      },
      tick: () => {
        const { time, isRunning, mode, settings } = get();

        if (isRunning && time > 0) {
          set((state) => {
            state.time -= 1;
          });
        } else if (isRunning && time === 0) {
          set((state) => {
            state.isRunning = false;

            if (mode === "study") {
              state.mode = "shortBreak";
              state.time = settings.shortBreak;
              state.isRunning = true;
            } else if (mode === "shortBreak") {
              state.mode = "study";
              state.time = settings.study;
              state.isRunning = true;
            } else if (mode === "longBreak") {
              state.mode = "study";
              state.time = settings.study;
              state.isRunning = true;
            }
          });
        }
      },
      startStudy: () =>
        set((state) => {
          state.mode = "study";
          state.time = state.settings.study;
          state.isRunning = true;
        }),
      startShortBreak: () =>
        set((state) => {
          state.mode = "shortBreak";
          state.time = state.settings.shortBreak;
          state.isRunning = true;
        }),
      startLongBreak: () =>
        set((state) => {
          state.mode = "longBreak";
          state.time = state.settings.longBreak;
          state.isRunning = true;
        }),
      setDurations: (newSettings) => {
        set((state) => {
          state.settings = newSettings;
          if (!state.isRunning) {
            state.time =
              state.mode === "study"
                ? newSettings.study
                : state.mode === "shortBreak"
                  ? newSettings.shortBreak
                  : newSettings.longBreak;
          }
        });
      },
      setSettings: (study, short_break) => {
        set((state) => {
          state.settings = {
            study: study * 60,
            shortBreak: short_break * 60,
            longBreak: 15 * 60,
          };
        });
      },
    })),
    {
      name: "QUICKEASE_POMODORO_TIMER", // AsyncStorage key
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);

export default useTimer;
