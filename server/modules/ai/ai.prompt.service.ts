import _AI from "../../utils/ai";

/**
 * Generates a quiz with at least 10 questions based on the provided prompt using the Gemini AI model.
 *
 * The function sends a prompt to the AI model requesting a quiz in a specific JSON format.
 * It parses the AI response and returns the quiz title and content.
 *
 * @param prompt - The input string describing the topic or subject for quiz generation.
 * @returns An object containing the quiz title and content if successful, or `false` if an error occurs.
 */
export async function generateQuizFromPrompt(prompt: string) {
  try {
    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
                Generate quiz that has atleast 10 questions or more from this prompt: "${prompt}"

                Return a JSON string in this format:
                {
                title: string,
                quiz_content: {
                question: string;
                description: string;
                options: string[];
                correctAnswers: number[];
                }[]
                }

                Only output the JSON string.
                `.trim(),
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      quiz_content: raw.quiz_content,
    };
  } catch (err) {
    return false;
  }
}

/**
 * Generates flashcards from a given prompt using an AI model.
 *
 * The function sends the prompt to the AI model "gemini-2.5-flash" and expects a JSON string response
 * containing a title and an array of flashcards, each with a front and back text. It parses the response
 * and returns the structured flashcards data.
 *
 * @param prompt - The input prompt from which to generate flashcards.
 * @returns An object containing the title and an array of flashcards if successful, or `false` if an error occurs.
 */
export async function generateFlashcardsFromPrompt(prompt: string) {
  try {
    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
              Return a JSON string in this format:
              {
              title: string;
              flashcards: { front: string; back: string; }[]
              }

              Generate atleast 10 flashcards or more from this prompt: "${prompt}"
                `.trim(),
    });

    const raw = JSON.parse(
      response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
    );

    return {
      title: raw.title,
      flashcards: raw.flashcards,
    };
  } catch (err) {
    return false;
  }
}

/**
 * Generates a summary note in HTML format from the provided prompt using the Gemini 2.0 Flash model.
 *
 * The generated HTML will use specific classnames for elements:
 * - `h1`: text-4xl
 * - `ul`: list-disc pl-8 list-outside
 * - `ol`: list-decimal pl-8 list-outside
 * - `code`: bg-base-200
 * - `hr`: border-t border-base-content/25
 *
 * @param prompt - The input string to generate a summary note from.
 * @returns The generated HTML string with applied classnames, or `false` if an error occurs.
 */
export async function generateNotesFromPrompt(prompt: string) {
  try {
    const response = await _AI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
                Output HTML only, classnames below.
                h1: text-4xl
                ul: list-disc pl-8 list-outside
                ol: list-decimal pl-8 list-outside
                code: bg-base-200
                hr: "border-t border-base-content/25
                Generate a summary note from this prompt: "${prompt}"
                `.trim(), // follow _TIPTAP_EXTENSIONS classnames
    });

    return response.text!.replace(/^```html\s*/, "").replace(/```$/, "");
  } catch (err) {
    return false;
  }
}
