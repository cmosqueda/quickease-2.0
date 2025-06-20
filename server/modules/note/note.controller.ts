import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createUserNote, deleteUserNote, getUserNotes, toggleNoteVisibility, updateNoteVisibility, updateUserNote } from "./note.service";

export async function get_user_notes(request: FastifyRequest, reply: FastifyReply) {
    try {
        const flashcards = await getUserNotes(request.user.id)
        reply.code(200).send(flashcards)
    } catch (err) {
        reply.code(500).send({
            message: "Error getting user's flashcards."
        })
    }
}

export async function create_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, user_id } = request.body as { title: string, content: string, user_id: string }

    const schema = z.object({
        title: z.string().min(3),
        content: z.string().nullable(),
        user_id: z.string()
    })

    const result = schema.safeParse({ title, content, user_id })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const note = await createUserNote(title, content, user_id)
        reply.code(200).send(note)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating note."
        })
    }
}

export async function update_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, note_id, user_id } = request.body as { title: string, content: string, note_id: string, user_id: string }

    const schema = z.object({
        title: z.string().min(3),
        content: z.string().nullable(),
        note_id: z.string(),
        user_id: z.string()
    })

    const result = schema.safeParse({ title, content, note_id, user_id })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const note = await updateUserNote(title, content, note_id, user_id)
        reply.code(200).send(note)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating note."
        })
    }
}

export async function delete_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { note_id } = request.body as { note_id: string }

    const schema = z.object({
        note_id: z.string(),
    })

    const result = schema.safeParse({ note_id })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const note = await deleteUserNote(note_id)
        reply.code(200).send(note)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating note."
        })
    }
}

export async function toggle_user_note_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { visibility, note_id } = request.body as { visibility: boolean, note_id: string }

    const schema = z.object({
        note_id: z.string(),
    })

    const result = schema.safeParse({ visibility, note_id })

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        })
    }

    try {
        const note = await toggleNoteVisibility(visibility, note_id)
        reply.code(200).send(note)
    } catch (err) {
        reply.code(500).send({
            message: "Error creating note."
        })
    }
}