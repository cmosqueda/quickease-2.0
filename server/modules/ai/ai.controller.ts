import { FastifyReply, FastifyRequest } from "fastify";
import { generateFlashcardFromNote, generateQuizFromNote } from "./ai.service";

export async function generate_quiz_from_note(request: FastifyRequest, reply: FastifyReply) {
    const { note_id } = request.body as {
        note_id: string
    }

    try {
        const generatedContent = generateQuizFromNote(note_id)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating quiz."
        })
    }
}

export async function generate_flashcards_from_note(request: FastifyRequest, reply: FastifyReply) {
    const { note_id } = request.body as {
        note_id: string
    }

    try {
        const generatedContent = generateFlashcardFromNote(note_id)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating flashcards."
        })
    }
}