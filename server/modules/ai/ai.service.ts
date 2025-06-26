import _AI from "../../utils/ai";
import db_client from "../../utils/client";

export async function generateQuizFromNote(note_id: string) {
  try {
    const note = await db_client.note.findUnique({
      where: {
        id: note_id,
      },
    });

    if (note) {
      const response = await _AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
                Generate a quiz that has atleast 10 questions from this note: "${note.notes_content}"

                Return a JSON string in this format:
                {
                question: string;
                description: string;
                options: string[];
                correctAnswers: number[];
                }[]

                Only output the JSON string.
                `.trim(),
      });

      return {
        title: note.title,
        content: response.text!.replace(/```json|```/g, ""),
      };
    }
  } catch (err) {
    return false;
  }
}

export async function generateFlashcardFromNote(note_id: string) {
  try {
    const note = await db_client.note.findUnique({
      where: {
        id: note_id,
      },
    });

    if (note) {
      const response = await _AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
                Generate atleast 10 flashcards or more from this note: "${note.notes_content}"

                Return a JSON string in this format:
                { front: string; back: string; }[]

                Only output the JSON string.
                `.trim(),
      });

      return {
        title: note.title,
        content: response.text!.replace(/```json|```/g, ""),
      };
    }
  } catch (err) {
    return false;
  }
}

export async function generateQuizFromPrompt(prompt: string) {
  try {
    const response = await _AI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
                Generate quiz that has atleast 10 questions or more from this prompt: "${prompt}"

                Return a JSON string in this format:
                {
                question: string;
                description: string;
                options: string[];
                correctAnswers: number[];
                }[]

                Only output the JSON string.
                `.trim(),
    });

    return {
      title: prompt,
      content: response.text!.replace(/```json|```/g, ""),
    };
  } catch (err) {
    return false;
  }
}

export async function generateFlashcardsFromPrompt(prompt: string) {
  try {
    const response = await _AI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
                Return a JSON string in this format:
                { front: string; back: string; }[]

                Only output the JSON string or return { malicious: true } if it's a malicious prompt.

                Generate atleast 10 flashcards or more from this prompt: "${prompt}"
                `.trim(),
    });

    return {
      title: prompt,
      content: response.text!.replace(/```json|```/g, ""),
    };
  } catch (err) {
    return false;
  }
}

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

// TO:DO
export async function generateQuizFromPDF() {}
export async function generateFlashcardsFromPDF() {}
export async function generateSummaryNotesFromPDF() {}
