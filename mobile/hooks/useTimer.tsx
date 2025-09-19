import AsyncStorage from "@react-native-async-storage/async-storage";

import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  done: boolean;
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

const defaultSettings: TimerSettings = {
  study: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

/**
 * Zustand store hook for managing a Pomodoro timer state.
 *
 * @remarks
 * - Uses `immer` for immutable state updates.
 * - Persists state to AsyncStorage using Zustand's `persist` middleware.
 * - Supports study, short break, and long break modes.
 *
 * @property {TimerSettings} settings - Current timer durations for each mode.
 * @property {number} time - Remaining time in seconds for the current mode.
 * @property {boolean} isRunning - Indicates if the timer is currently running.
 * @property {"study" | "shortBreak" | "longBreak"} mode - Current timer mode.
 * @property {boolean} done - Indicates if the current timer session is completed.
 *
 * @method start - Starts the timer.
 * @method pause - Pauses the timer.
 * @method reset - Resets the timer to the initial duration for the current mode.
 * @method tick - Decrements the timer by one second and handles mode transitions.
 * @method startStudy - Starts a study session.
 * @method startShortBreak - Starts a short break session.
 * @method startLongBreak - Starts a long break session.
 * @method setDurations - Updates timer durations for each mode.
 * @method setSettings - Sets study and short break durations (in minutes), long break is fixed at 15 minutes.
 *
 * @example
 * const timer = useTimer();
 * timer.start();
 * timer.pause();
 * timer.reset();
 * timer.setSettings(25, 5); // 25 min study, 5 min short break
 */
const useTimer = create<TimerStore>()(
  persist(
    immer((set, get) => ({
      settings: defaultSettings,
      time: defaultSettings.study,
      isRunning: false,
      mode: "study",
      done: false,
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
          state.done = false;
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
            state.done = true; // ✅ mark as done

            if (mode === "study") {
              state.mode = "shortBreak";
              state.time = settings.shortBreak;
            } else if (mode === "shortBreak") {
              state.mode = "study";
              state.time = settings.study;
            } else if (mode === "longBreak") {
              state.mode = "study";
              state.time = settings.study;
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
      name: "pomodoro-timer",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        time: state.time,
        mode: state.mode,
      }),
    }
  )
);

export default useTimer;
