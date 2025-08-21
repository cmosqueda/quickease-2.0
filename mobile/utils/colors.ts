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
