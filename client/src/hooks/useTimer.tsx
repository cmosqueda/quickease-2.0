import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Mode = "study" | "shortBreak" | "longBreak";

type TimerSettings = {
  study: number;
  shortBreak: number;
  longBreak: number;
  isPopupEnabled: boolean;
};

type TimerStore = {
  time: number;
  isRunning: boolean;
  isPopupEnabled: boolean;
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
  togglePopup: () => void;
  setSettings: (study: number, short_break: number) => void;
};

const getInitialSettings = (): TimerSettings => {
  const stored = localStorage.getItem("QUICKEASE_POMODORO_TIMER_SETTINGS");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, fallback to defaults
    }
  }
  return {
    study: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    isPopupEnabled: true,
  };
};

const useTimer = create<TimerStore>()(
  persist(
    immer((set, get) => ({
      settings: getInitialSettings(),
      time: getInitialSettings().study,
      isRunning: false,
      isPopupEnabled: getInitialSettings().isPopupEnabled,
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

            // Auto-transition to the next mode
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
        localStorage.setItem(
          "QUICKEASE_POMODORO_TIMER_SETTINGS",
          JSON.stringify(newSettings)
        );
        set((state) => {
          state.settings = newSettings;
          // Optional: update time if not running
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
      togglePopup: () => {
        set((state) => {
          state.isPopupEnabled = !get().isPopupEnabled;
        });
      },
      setSettings: async (study, short_break) => {
        set((state) => {

          state.settings = {
            study: study * 60,
            shortBreak: short_break * 60,
            longBreak: 15 * 60,
            isPopupEnabled: get().isPopupEnabled,
          };
        });

        toast.success("Settings saved!");
      },
    })),
    {
      name: "QUICKEASE_POMODORO_TIMER", // state persistence key
    }
  )
);

export default useTimer;
