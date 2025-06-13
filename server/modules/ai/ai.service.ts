import _AI from "../../utils/ai";
import db_client from "../../utils/client";

export async function generateQuizFromNote(note_id: string) {
    try {
        const note = await db_client.note.findUnique({
            where: {
                id: note_id
            }
        })

        if (note) {
            const response = await _AI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `
                Generate a quiz that has atleast 10 questions from this note: "${note.notes_content}"

                Return a JSON string in this format:
                {
                "question": string,
                "answers": string[4],
                "correct_answer_index": number
                }

                Only output the JSON string.
                `.trim()
            })

            return response.text
        }
    } catch (err) {
        return false
    }
}

export async function generateFlashcardFromNote(note_id: string) {
    try {
        const note = await db_client.note.findUnique({
            where: {
                id: note_id
            }
        })

        if (note) {
            const response = await _AI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `
                Generate atleast 10 flashcards or more from this note: "${note.notes_content}"

                Return a JSON string in this format:
                { front: string; back: string; }[]

                Only output the JSON string.
                `.trim()
            })

            return response.text
        }
    } catch (err) {
        return false
    }
}

export async function generateQuizFromPrompt(prompt: string) {
    try {
        const response = await _AI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `
                Generate quiz that has atleast 10 questions or more from this prompt: "${prompt}"

                Return a JSON string in this format:
                {
                "question": string,
                "answers": string[4],
                "correct_answer_index": number
                }

                Only output the JSON string.
                `.trim()
        })

        return response.text
    } catch (err) { return false }
}

export async function generateFlashcardsFromPrompt(prompt: string) {
    try {
        const response = await _AI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `
                Generate atleast 10 flashcards or more from this prompt: "${prompt}"

                Return a JSON string in this format:
                { front: string; back: string; }[]

                Only output the JSON string.
                `.trim()
        })

        return response.text
    } catch (err) { return false }
}

// TO:DO
export async function generateQuizFromPDF() { }
export async function generateFlashcardsFromPDF() { }
export async function generateSummaryNotesFromPDF() { }