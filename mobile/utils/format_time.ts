/**
 * USED FOR POMODORO TIMER, PROPERLY FORMATTING THE TIME TO MM:SS/HH:MM:SS
 * Formats a time value in seconds into a string in "MM:SS" format.
 *
 * @param seconds - The time in seconds to format.
 * @returns A string representing the formatted time in minutes and seconds.
 *
 * @example
 * ```typescript
 * formatTime(75); // "01:15"
 * formatTime(5);  // "00:05"
 * ```
 */
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default formatTime;
