import _AI from "../../utils/ai";
import db_client from "../../utils/client";

/**
 * Generates a quiz with at least 10 questions based on the content of a note.
 *
 * The quiz is generated using an AI model and conforms to a specific JSON schema.
 * Questions are derived solely from the provided note content, with plausible distractor options for multiple-choice questions.
 * The correctAnswers array contains the 0-based index of the correct option.
 *
 * @param note_id - The unique identifier of the note to generate the quiz from.
 * @returns An object containing the quiz title and quiz content if successful, or `false` if an error occurs.
 */
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
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const raw = JSON.parse(
        response.text!.replace(/^```json\s*/, "").replace(/```$/, ""),
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

/**
 * Generates a set of flashcards from the content of a note specified by its ID.
 *
 * This function retrieves the note from the database, constructs a prompt for an AI model,
 * and requests the generation of at least 10 flashcards based solely on the note's content.
 * Each flashcard consists of a 'front' (key term, name, or concept) and a 'back' (definition or explanation).
 * The output conforms to a predefined JSON schema.
 *
 * @param note_id - The unique identifier of the note to generate flashcards from.
 * @returns An object containing the title and an array of flashcards if successful, or `false` if an error occurs or the note is not found.
 */
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
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const raw = JSON.parse(
        response.text!.replace(/^```json\s*/, "").replace(/```$/, ""),
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
