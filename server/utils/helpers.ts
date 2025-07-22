function cleanJsonResponse(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}

function cleanHtmlResponse(raw: string): string {
  return raw
    .replace(/^```html\s*/, "")
    .replace(/```$/, "")
    .trim();
}
