import { FastifyInstance } from "fastify";
import {
  generate_flashcards_from_note,
  generate_flashcards_from_prompt,
  generate_notes_from_prompt,
  generate_quiz_from_note,
  generate_quiz_from_prompt,
} from "./ai.controller";

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
}
