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
      const prompt = `
Generate a quiz with at least 10 questions based on the following content. The output must conform to the provided JSON schema.

Content: """
${note.notes_content}
"""

**Content Rules:**
- Questions must be derived solely from the provided text.
- For multiple-choice questions, create plausible but incorrect distractor options.
- The correctAnswers array must contain the 0-based index of the correct option (e.g., '[1]' for the second option).

**JSON Schema:**
{
  "title": "string",
  "quiz_content": [
    {
      "question": "string",
      "description": "string (can be empty)",
      "options": ["string"],
      "correctAnswers": [number]
    }
  ]
}
`.trim();

      const response = await _AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
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
      const prompt = `
Generate a set of at least 10 flashcards based on the following content. The output must conform to the provided JSON schema.

Content: """
${note.notes_content}
"""

**Content Rules:**
- Flashcards must be derived solely from the provided text.
- The 'front' of each card must be a key term, name, or concept.
- The 'back' of each card must be its corresponding definition or explanation.

**JSON Schema:**
{
  "title": "string",
  "flashcards": [
    {
      "front": "string",
      "back": "string"
    }
  ]
}`.trim();

      const response = await _AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
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
