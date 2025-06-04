import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";

import { useEffect, useState } from "react";
import {
  Clock,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  BookOpen,
  Coffee,
  Bed,
} from "lucide-react";
import clsx from "clsx";

export default function TimerPopup() {
  const {
    time,
    isRunning,
    mode,
    start,
    pause,
    reset,
    tick,
    startStudy,
    startShortBreak,
    startLongBreak,
    isPopupEnabled,
  } = useTimer();
  const [isAlwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const modeLabelMap: Record<typeof mode, string> = {
    study: "Study",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <div
      className={clsx(
        isAlwaysOnTop ? "dropdown-open" : null,
        "lg:block hidden border border-base-300 rounded-3xl",
        "dropdown dropdown-top dropdown-end lg:fixed lg:right-12 lg:bottom-12"
      )}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={startStudy}
        className="flex flex-row gap-4 items-center bg-base-100 p-4 rounded-3xl cursor-pointer"
      >
        <Clock size={32} />
        <h1>
          {isRunning
            ? `${formatTime(time)} / ${modeLabelMap[mode]}`
            : "Start study session"}
        </h1>
      </div>

      <ul tabIndex={0} className="dropdown-content">
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-[16rem] border p-4">
          <legend className="fieldset-legend">Study options</legend>
          <label className="label">
            <input
              type="checkbox"
              checked={isAlwaysOnTop}
              onChange={() => setAlwaysOnTop(!isAlwaysOnTop)}
              className="checkbox"
            />
            Always on top
          </label>
        </fieldset>
        <div className="bg-base-100 rounded-box z-10 w-[24rem] border border-base-300 items-center my-4 p-4 shadow-sm flex flex-col gap-4">
          <h1 className="text-base-content/70 font-bold text-2xl capitalize">
            {modeLabelMap[mode]} Session
          </h1>

          <div className="text-4xl font-mono">{formatTime(time)}</div>

          <div className="flex gap-4">
            <button
              onClick={isRunning ? pause : start}
              className="btn btn-primary btn-soft btn-sm flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <PauseCircle size={18} />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle size={18} />
                  Start
                </>
              )}
            </button>

            <button
              onClick={reset}
              className="btn btn-secondary btn-soft btn-sm flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/*
        // These buttons are for manual changing mode
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={startStudy}
            className="btn btn-sm btn-soft flex gap-2 items-center"
          >
            <BookOpen size={16} />
            Study
          </button>
          <button
            onClick={startShortBreak}
            className="btn btn-sm btn-soft flex gap-2 items-center"
          >
            <Coffee size={16} />
            Short Break
          </button>
          <button
            onClick={startLongBreak}
            className="btn btn-sm btn-soft flex gap-2 items-center"
          >
            <Bed size={16} />
            Long Break
          </button>
        </div>
        */}
      </ul>
    </div>
  );
}
