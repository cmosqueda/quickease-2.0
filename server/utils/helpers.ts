/**
 * Removes Markdown code block markers (```json and ```) from a raw JSON string response.
 * Trims any leading or trailing whitespace from the result.
 *
 * @param raw - The raw JSON string, potentially wrapped in Markdown code block markers.
 * @returns The cleaned JSON string without code block markers and trimmed whitespace.
 */
function cleanJsonResponse(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}

/**
 * Cleans a raw HTML response string by removing code block markers and trimming whitespace.
 *
 * Specifically, it removes a leading "```html" (with optional whitespace) and a trailing "```".
 *
 * @param raw - The raw HTML response string to clean.
 * @returns The cleaned HTML string without code block markers and leading/trailing whitespace.
 */
function cleanHtmlResponse(raw: string): string {
  return raw
    .replace(/^```html\s*/, "")
    .replace(/```$/, "")
    .trim();
}
