import { FastifyReply, FastifyRequest } from "fastify";
import { generateFlashcardFromNote, generateFlashcardsFromPrompt, generateQuizFromNote, generateQuizFromPrompt } from "./ai.service";

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

export async function generate_quiz_from_prompt(request: FastifyRequest, reply: FastifyReply) {
    const { prompt } = request.body as {
        prompt: string
    }

    try {
        const generatedContent = generateQuizFromPrompt(prompt)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating flashcards."
        })
    }
}

export async function generate_flashcards_from_prompt(request: FastifyRequest, reply: FastifyReply) {
    const { prompt } = request.body as {
        prompt: string
    }

    try {
        const generatedContent = generateFlashcardsFromPrompt(prompt)

        reply.code(200).send({
            content: generatedContent
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error generating flashcards."
        })
    }
}