import { FastifyInstance } from "fastify";
import {
  generate_flashcards_from_note,
  generate_flashcards_from_pdf,
  generate_flashcards_from_prompt,
  generate_notes_from_image,
  generate_notes_from_pdf,
  generate_notes_from_prompt,
  generate_quiz_from_note,
  generate_quiz_from_pdf,
  generate_quiz_from_prompt,
} from "./ai.controller";

/**
 * Registers AI-related routes for generating quizzes, flashcards, and notes from various sources.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * All routes require authentication via the `fastify.authenticate` preHandler.
 *
 * @route POST /generate-quiz-from-note - Generates a quiz from a note.
 * @route POST /generate-flashcards-from-note - Generates flashcards from a note.
 * @route POST /generate-quiz-from-prompt - Generates a quiz from a prompt.
 * @route POST /generate-flashcards-from-prompt - Generates flashcards from a prompt.
 * @route POST /generate-notes-from-prompt - Generates notes from a prompt.
 * @route POST /generate-notes-from-pdf - Generates notes from a PDF file.
 * @route POST /generate-quiz-from-pdf - Generates a quiz from a PDF file.
 * @route POST /generate-flashcards-from-pdf - Generates flashcards from a PDF file.
 * @route POST /generate-notes-from-image - Generates notes from an image.
 */
export default async function aiRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/generate-quiz-from-note",
    { preHandler: [fastify.authenticate] },
    generate_quiz_from_note
  );

  fastify.post(
    "/generate-flashcards-from-note",
    { preHandler: [fastify.authenticate] },
    generate_flashcards_from_note
  );

  fastify.post(
    "/generate-quiz-from-prompt",
    { preHandler: [fastify.authenticate] },
    generate_quiz_from_prompt
  );

  fastify.post(
    "/generate-flashcards-from-prompt",
    { preHandler: [fastify.authenticate] },
    generate_flashcards_from_prompt
  );

  fastify.post(
    "/generate-notes-from-prompt",
    { preHandler: [fastify.authenticate] },
    generate_notes_from_prompt
  );

  fastify.post(
    "/generate-notes-from-pdf",
    { preHandler: [fastify.authenticate] },
    generate_notes_from_pdf
  );

  fastify.post(
    "/generate-quiz-from-pdf",
    { preHandler: [fastify.authenticate] },
    generate_quiz_from_pdf
  );

  fastify.post(
    "/generate-flashcards-from-pdf",
    { preHandler: [fastify.authenticate] },
    generate_flashcards_from_pdf
  );

  fastify.post(
    "/generate-notes-from-image",
    { preHandler: [fastify.authenticate] },
    generate_notes_from_image
  );
}
