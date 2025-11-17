import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUserFlashcard,
  deleteUserFlashcard,
  getUserFlashcard,
  getUserFlashcards,
  toggleFlashcardVisibility,
  updateUserFlashcard,
} from "./flashcard.service";
import { z } from "zod";

/**
 * Handles the request to retrieve flashcards for the authenticated user.
 *
 * @param { user_id: string } - The Fastify request object, expected to contain the authenticated user's information.
 * @param reply - The Fastify reply object used to send responses.
 * @returns Sends a 200 response with the user's flashcards if authenticated,
 *          a 401 response if the user is not authenticated,
 *          or a 500 response if an error occurs during retrieval.
 */
export async function get_user_flashcards(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const flashcards = await getUserFlashcards(userId);
    reply.code(200).send(flashcards);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's flashcards." });
  }
}

/**
 * Handles the retrieval of a user's flashcard by its ID.
 *
 * @param { flashcard_id: string } - Fastify request object containing the flashcard ID in params.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends the flashcard data if found, or an error message if not found or on failure.
 *
 * @throws 400 - If the flashcard ID is not provided.
 * @throws 404 - If the flashcard is not found.
 * @throws 500 - If an error occurs while retrieving the flashcard.
 */
export async function get_user_flashcard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { flashcard_id } = request.params as { flashcard_id: string };

  if (!flashcard_id) {
    return reply.code(400).send({ message: "Flashcard ID is required." });
  }

  try {
    const flashcard = await getUserFlashcard(flashcard_id, request.user.id);

    if (!flashcard) {
      return reply.code(404).send({ message: "Flashcard not found." });
    }

    reply.code(200).send(flashcard);
  } catch (err) {
    reply.code(500).send({ message: "Error getting user's flashcard." });
  }
}

/**
 * Handles the creation of a user flashcard set.
 *
 * Validates the request body for required fields: `title`, `description`, `flashcards`, and `isAI`.
 * Ensures the user is authenticated before proceeding.
 * On success, creates a new flashcard set for the user and returns it with a 201 status code.
 * On validation failure, responds with a 400 status code and error details.
 * On authentication failure, responds with a 401 status code.
 * On server error, responds with a 500 status code.
 *
 * @param { title: string; description: string; isAI: boolean; flashcards: { front: string; back: string }[]; } - The Fastify request object containing user and body data.
 * @param reply - The Fastify reply object used to send responses.
 * @returns A promise that resolves with the created flashcard set or an error response.
 */
export async function create_user_flashcard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, description, flashcards, isAI } = request.body as {
    title: string;
    description: string;
    isAI: boolean;
    flashcards: { front: string; back: string }[];
  };

  const schema = z.object({
    title: z.string().min(3),
    description: z.string().nullable(),
    flashcards: z
      .array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      )
      .min(1),
  });

  const result = schema.safeParse({ title, description, flashcards });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const flashcard = await createUserFlashcard(
      title,
      description,
      flashcards,
      isAI,
      userId
    );
    reply.code(201).send(flashcard);
  } catch (err) {
    reply.code(500).send({ message: "Error creating flashcard." });
  }
}

/**
 * Updates a user's flashcard with new title, description, and flashcards.
 *
 * @param { title: string; description: string; flashcards: { front: string; back: string }[]; flashcard_id: string; } - Fastify request object containing the flashcard update data.
 * @param reply - Fastify reply object for sending responses.
 *
 * @remarks
 * - Validates input using Zod schema.
 * - Requires user authentication.
 * - Returns 400 if input is invalid.
 * - Returns 401 if user is unauthorized.
 * - Returns 200 with updated flashcard on success.
 * - Returns 500 on server error.
 *
 * @returns Sends an HTTP response with the result of the update operation.
 */
export async function update_user_flashcard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, description, flashcards, flashcard_id } = request.body as {
    title: string;
    description: string;
    flashcards: { front: string; back: string }[];
    flashcard_id: string;
  };

  const schema = z.object({
    title: z.string(),
    description: z.string(),
    flashcards: z
      .array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      )
      .min(1),
    flashcard_id: z.string().min(1),
  });

  const result = schema.safeParse({
    title,
    description,
    flashcards,
    flashcard_id,
  });

  if (!result.success) {
    return reply.code(400).send({
      message: "Invalid input",
      errors: result.error.errors,
    });
  }

  try {
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const flashcard = await updateUserFlashcard(
      title,
      description,
      flashcards,
      userId,
      flashcard_id
    );
    reply.code(200).send(flashcard);
  } catch (err) {
    reply.code(500).send({ message: "Error updating flashcard." });
  }
}

/**
 * Deletes a user flashcard by its ID.
 *
 * Expects a `flashcard_id` in the request body. Returns a 400 error if the ID is missing.
 * On success, deletes the flashcard and responds with a 200 status and confirmation message.
 * On failure, responds with a 500 status and error message.
 *
 * @param { flashcard_id: string } - Fastify request object containing the flashcard ID in the body.
 * @param reply - Fastify reply object used to send HTTP responses.
 */
export async function delete_user_flashcard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { flashcard_id } = request.body as { flashcard_id: string };

  if (!flashcard_id) {
    return reply.code(400).send({ message: "Flashcard ID is required." });
  }

  try {
    await deleteUserFlashcard(flashcard_id, request.user.id);
    reply.code(200).send({ message: "Deleted flashcard." });
  } catch (err) {
    reply.code(500).send({ message: "Error deleting flashcard." });
  }
}

/**
 * Toggles the visibility of a flashcard by its ID.
 *
 * @param { flashcard_id: string } - Fastify request object containing the flashcard ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a response indicating success or failure of the operation.
 *
 * @throws 400 - If the flashcard ID is not provided in the request body.
 * @throws 500 - If an error occurs while updating the flashcard visibility.
 */
export async function toggle_flashcard_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { flashcard_id } = request.body as { flashcard_id: string };

  if (!flashcard_id) {
    return reply.code(400).send({ message: "Flashcard ID is required." });
  }

  try {
    await toggleFlashcardVisibility(flashcard_id, request.user.id);
    reply.code(200).send({ message: "Updated flashcard visibility." });
  } catch (err) {
    reply.code(500).send({ message: "Error updating flashcard visibility." });
  }
}
