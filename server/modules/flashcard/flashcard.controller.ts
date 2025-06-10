import { FastifyReply, FastifyRequest } from "fastify";
import { createUserFlashcard, deleteUserFlashcard, getUserFlashcards, toggleFlashcardVisibility, updateUserFlashcard } from "./flashcard.service";
import { z } from "zod";

export async function get_user_flashcards(request: FastifyRequest, reply: FastifyReply) {
    try {
        const flashcards = await getUserFlashcards(request.user.id)
        reply.code(200).send(flashcards)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user's flashcards."
        })
    }
}

export async function create_user_flashcard(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, flashcards } = request.body as { title: string, description: string, flashcards: { front: string; back: string; }[] }

    const schema = z.object({
        title: z.string().min(6),
        description: z.string().min(12),
        flashcards: z.object({ front: z.string(), back: z.string() }).array().min(1)
    })
    const result = schema.safeParse({ title, description, flashcards })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const flashcard = await createUserFlashcard(title, description, flashcards, request.user.id)

        reply.code(200).send(flashcard)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating flashcard."
        })
    }
}

export async function update_user_flashcard(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, flashcards, flashcard_id } = request.body as { title: string, description: string, flashcards: { front: string; back: string; }[], flashcard_id: string }

    const schema = z.object({
        title: z.string().min(6),
        description: z.string().min(12),
        flashcards: z.object({ front: z.string(), back: z.string() }).array().min(1),
        flashcard_id: z.string()
    })
    const result = schema.safeParse({ title, description, flashcards, flashcard_id })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const flashcard = await updateUserFlashcard(title, description, flashcards, request.user.id, flashcard_id)

        reply.code(200).send(flashcard)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating flashcard."
        })
    }
}

export async function delete_user_flashcard(request: FastifyRequest, reply: FastifyReply) {
    const { flashcard_id } = request.body as { flashcard_id: string }

    try {
        await deleteUserFlashcard(flashcard_id)

        reply.code(200).send({
            message: "Deleted flashcard."
        })

    } catch (err) {
        reply.code(500).send({
            message: "Error deleting flashcard."
        })
    }

}

export async function toggle_flashcard_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { flashcard_id } = request.body as { flashcard_id: string }

    try {
        await toggleFlashcardVisibility(flashcard_id)

        reply.code(200).send({
            message: "Updated flashcard visibility."
        })
    } catch (err) {
        reply.code(500).send({
            message: "Error updating flashcard visibility."
        })
    }

}