/**
 * THIS FUNCTION IS MOSTLY USED FOR THEMING STUFF, DON'T TOUCH UNLESS NECESSARY. (though you won't find a situation where you need to touch it tho lol)
 * Converts an RGBA or RGB color string to its hexadecimal representation.
 *
 * Accepts color strings in the format `rgba(r, g, b, a)` or `rgb(r, g, b)`.
 * The alpha channel, if present, is converted to a two-digit hex value and appended to the result.
 *
 * @param rgba - The RGBA or RGB color string to convert (e.g., "rgba(255, 0, 0, 0.5)" or "rgb(255, 0, 0)").
 * @returns The hexadecimal color string (e.g., "#ff000080" for "rgba(255, 0, 0, 0.5)", "#ff0000" for "rgb(255, 0, 0)").
 * @throws If the input string is not a valid RGBA or RGB format.
 */
export function rgbaToHex(rgba: string): string {
  const match = rgba.match(
    /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)/
  );

  if (!match) {
    throw new Error("Invalid RGBA format");
  }

  const r = Math.min(255, parseInt(match[1], 10));
  const g = Math.min(255, parseInt(match[2], 10));
  const b = Math.min(255, parseInt(match[3], 10));
  const a =
    match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : null;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return "#" + toHex(r) + toHex(g) + toHex(b) + (a !== null ? toHex(a) : "");
}

/**
 * USED FOR POMODORO TIMER AND THE SVG ON `react-countdown-circle` package, DON'T TOUCH UNLESS NECESSARY.
 * Generates an array of time values corresponding to each color step over a given duration.
 *
 * @param duration - The total duration over which the colors should be distributed.
 * @param colors - An array of color strings representing each step.
 * @returns An array of numbers representing the time (in milliseconds) for each color step.
 */
export function generateColorsTime(
  duration: number,
  colors: string[]
): number[] {
  const steps = colors.length;
  const interval = duration / (steps - 1);

  return Array.from({ length: steps }, (_, i) =>
    Math.round(duration - i * interval)
  );
}
