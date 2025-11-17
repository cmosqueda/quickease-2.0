import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  createUserNote,
  deleteUserNote,
  getUserNote,
  getUserNotes,
  toggleNoteVisibility,
  updateUserNote,
} from "./note.service";

/**
 * Retrieves all notes belonging to the authenticated user.
 *
 * @param { user_id: string; } - The Fastify request object, expected to contain the authenticated user's information.
 * @param reply - The Fastify reply object used to send the response.
 * @returns Sends a 200 response with the user's notes if authenticated,
 *          otherwise sends a 401 Unauthorized response.
 *          Sends a 500 response if an error occurs during retrieval.
 */
export async function get_user_notes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.id;
    if (!userId) return reply.code(401).send({ message: "Unauthorized." });

    const notes = await getUserNotes(userId);
    reply.code(200).send(notes);
  } catch (err) {
    reply.code(500).send({ message: "Error retrieving user's notes." });
  }
}

/**
 * Handles the retrieval of a user's note by its ID.
 *
 * @param { note_id: string } - The Fastify request object, expected to contain `note_id` in params.
 * @param reply - The Fastify reply object used to send responses.
 * @returns Sends the note data if found, or an appropriate error response:
 * - 400 if `note_id` is missing
 * - 404 if the note is not found
 * - 500 if an error occurs during retrieval
 */
export async function get_user_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { note_id } = request.params as { note_id: string };

  if (!note_id)
    return reply.code(400).send({ message: "Note ID is required." });

  try {
    const note = await getUserNote(note_id, request.user.id);

    if (!note) return reply.code(404).send({ message: "Note not found." });

    reply.code(200).send(note);
  } catch (err) {
    reply.code(500).send({ message: "Error retrieving note." });
  }
}

/**
 * Handles the creation of a new user note.
 *
 * Validates the request body for required fields (`title`, `content`, `user_id`, and optional `is_ai_generated`).
 * If validation fails, responds with a 400 status and error details.
 * On success, creates the note using `createUserNote` and responds with the created note and a 201 status.
 * If an error occurs during note creation, responds with a 500 status and error details.
 *
 * @param { title: string; content: string; user_id: string; is_ai_generated: boolean; } - Fastify request object containing the note data in the body.
 * @param reply - Fastify reply object used to send responses.
 * @returns Sends a response with the created note or error details.
 */
export async function create_user_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    title,
    content,
    user_id,
    is_ai_generated = false,
  } = request.body as {
    title: string;
    content: string;
    user_id: string;
    is_ai_generated: boolean;
  };

  const schema = z.object({
    title: z.string(),
    content: z.string().nullable(),
    user_id: z.string().min(1, "User ID is required."),
  });

  const result = schema.safeParse({ title, content, user_id });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    const note = await createUserNote(title, content, user_id, is_ai_generated);
    reply.code(201).send(note);
  } catch (err) {
    reply.code(500).send({ message: "Error creating note.", errors: err });
  }
}

/**
 * Updates a user's note with the provided title and content.
 *
 * Validates the input using a Zod schema to ensure the title is at least 3 characters,
 * the note ID is present, and the content is optional (nullable).
 *
 * Responds with:
 * - 400 Bad Request if validation fails, including error details.
 * - 200 OK with the updated note on success.
 * - 500 Internal Server Error if an unexpected error occurs during update.
 *
 * @param { title: string; content: string; note_id: string; } - FastifyRequest containing the note update data in the body.
 * @param reply - FastifyReply used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
export async function update_user_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, content, note_id } = request.body as {
    title: string;
    content: string;
    note_id: string;
  };

  const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    content: z.string().nullable(),
    note_id: z.string().min(1, "Note ID is required."),
  });

  const result = schema.safeParse({ title, content, note_id });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    const note = await updateUserNote(title, content, note_id, request.user.id);
    reply.code(200).send(note);
  } catch (err) {
    reply.code(500).send({ message: "Error updating note." });
  }
}

/**
 * Deletes a user note by its ID.
 *
 * Validates the request body to ensure a valid `note_id` is provided.
 * If validation fails, responds with a 400 status and error details.
 * On success, deletes the note and responds with a 200 status.
 * If an error occurs during deletion, responds with a 500 status.
 *
 * @param { note_id: string } - The Fastify request object containing the note ID in the body.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the response is sent.
 */
export async function delete_user_note(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { note_id } = request.body as { note_id: string };

  const schema = z.object({
    note_id: z.string().min(1, "Note ID is required."),
  });

  const result = schema.safeParse({ note_id });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    await deleteUserNote(note_id, request.user.id);
    reply.code(200).send({ message: "Note deleted successfully." });
  } catch (err) {
    reply.code(500).send({ message: "Error deleting note." });
  }
}

/**
 * Toggles the visibility of a user note.
 *
 * Validates the request body to ensure it contains a boolean `visibility` and a string `note_id`.
 * If validation fails, responds with a 400 status and error details.
 * On success, updates the note's visibility and responds with a 200 status.
 * If an error occurs during the update, responds with a 500 status.
 *
 * @param { visibility: boolean; note_id: string; } - The Fastify request object containing the note visibility data.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves when the response is sent.
 */
export async function toggle_user_note_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { visibility, note_id } = request.body as {
    visibility: boolean;
    note_id: string;
  };

  const schema = z.object({
    visibility: z.boolean(),
    note_id: z.string(),
  });

  const result = schema.safeParse({ visibility, note_id });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    await toggleNoteVisibility(visibility, note_id, request.user.id);
    reply.code(200).send({ message: "Note visibility updated." });
  } catch (err) {
    reply.code(500).send({ message: "Error updating note visibility." });
  }
}
