import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
    createUserNote,
    deleteUserNote,
    getUserNote,
    getUserNotes,
    toggleNoteVisibility,
    updateUserNote
} from "./note.service";

export async function get_user_notes(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user?.id;
        if (!userId) return reply.code(401).send({ message: "Unauthorized." });

        const notes = await getUserNotes(userId);
        reply.code(200).send(notes);
    } catch (err) {
        reply.code(500).send({ message: "Error retrieving user's notes." });
    }
}

export async function get_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { note_id } = request.params as { note_id: string };

    if (!note_id) return reply.code(400).send({ message: "Note ID is required." });

    try {
        const note = await getUserNote(note_id);

        if (!note) return reply.code(404).send({ message: "Note not found." });

        reply.code(200).send(note);
    } catch (err) {
        reply.code(500).send({ message: "Error retrieving note." });
    }
}

export async function create_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, user_id } = request.body as {
        title: string;
        content: string;
        user_id: string;
    };

    const schema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters."),
        content: z.string().nullable(),
        user_id: z.string().min(1, "User ID is required.")
    });

    const result = schema.safeParse({ title, content, user_id });

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        });
    }

    try {
        const note = await createUserNote(title, content, user_id);
        reply.code(201).send(note);
    } catch (err) {
        reply.code(500).send({ message: "Error creating note." });
    }
}

export async function update_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, note_id } = request.body as {
        title: string;
        content: string;
        note_id: string;
    };

    const schema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters."),
        content: z.string().nullable(),
        note_id: z.string().min(1, "Note ID is required.")
    });

    const result = schema.safeParse({ title, content, note_id });

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        });
    }

    try {
        const note = await updateUserNote(title, content, note_id);
        reply.code(200).send(note);
    } catch (err) {
        reply.code(500).send({ message: "Error updating note." });
    }
}

export async function delete_user_note(request: FastifyRequest, reply: FastifyReply) {
    const { note_id } = request.body as { note_id: string };

    const schema = z.object({
        note_id: z.string().min(1, "Note ID is required.")
    });

    const result = schema.safeParse({ note_id });

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        });
    }

    try {
        await deleteUserNote(note_id);
        reply.code(200).send({ message: "Note deleted successfully." });
    } catch (err) {
        reply.code(500).send({ message: "Error deleting note." });
    }
}

export async function toggle_user_note_visibility(request: FastifyRequest, reply: FastifyReply) {
    const { visibility, note_id } = request.body as {
        visibility: boolean;
        note_id: string;
    };

    const schema = z.object({
        visibility: z.boolean(),
        note_id: z.string().min(1, "Note ID is required.")
    });

    const result = schema.safeParse({ visibility, note_id });

    if (!result.success) {
        return reply.code(400).send({
            message: "Invalid input",
            errors: result.error.errors
        });
    }

    try {
        await toggleNoteVisibility(visibility, note_id);
        reply.code(200).send({ message: "Note visibility updated." });
    } catch (err) {
        reply.code(500).send({ message: "Error updating note visibility." });
    }
}
