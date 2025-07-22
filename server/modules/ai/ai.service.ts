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

export async function generateSummaryNotesFromPDF(buffer: Buffer) {
  try {
    const contents = [
      {
        text:
          "Summarize this document in note form using the following styles:\n\n" +
          "- Use <h1> for headings (class: text-4xl)\n" +
          "- Use <ul> for bullet lists (class: list-disc pl-8 list-outside)\n" +
          "- Use <ol> for numbered steps (class: list-decimal pl-8 list-outside)\n" +
          "- Use <code> for inline code (class: bg-base-200)\n" +
          "- Use <hr> for section breaks (class: border-t border-base-content/25)",
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text!.replace(/^```html\s*/, "").replace(/```$/, "");
  } catch (err) {
    console.error("Failed to summarize:", err);
    return false;
  }
}

export async function generateQuizFromPDF(buffer: Buffer) {
  try {
    const contents = [
      {
        text:
          "Create a 5-question multiple choice quiz from this document.\n\n" +
          "- Format output in HTML.\n" +
          "- Use <ol> for questions and <ul> for options.\n" +
          "- Include an <hr> tag before the answer key.\n" +
          "- Use <code> for correct answers in answer key.\n" +
          "- Keep class names consistent with: text-4xl, list-disc pl-8 list-outside, etc.",
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text!.replace(/^```html\s*/, "").replace(/```$/, "");
  } catch (err) {
    console.error("Failed to generate quiz:", err);
    return false;
  }
}

export async function generateFlashcardsFromPDF(buffer: Buffer) {
  try {
    const contents = [
      {
        text:
          "Create 5–10 flashcards from this document.\n\n" +
          "- Format output as HTML.\n" +
          "- Use <ol> where each item is a Q&A.\n" +
          "- Format questions with <strong> and answers with regular <p>.\n" +
          "- Use classnames: list-decimal pl-8 list-outside, text-4xl for title, etc.",
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await _AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text!.replace(/^```html\s*/, "").replace(/```$/, "");
  } catch (err) {
    console.error("Failed to generate flashcards:", err);
    return false;
  }
}
