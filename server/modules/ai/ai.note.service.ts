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
