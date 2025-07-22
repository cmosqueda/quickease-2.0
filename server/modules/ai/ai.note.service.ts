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
        {
        title: string;
        flashcards: { front: string; back: string; }[]
        }
                `.trim(),
      });

      const raw = JSON.parse(
        response.text!.replace(/^```json\s*/, "").replace(/```$/, "")
      );

      return {
        title: raw.title,
        flashcards: raw.flashcards,
      };
    }
  } catch (err) {
    return false;
  }
}
