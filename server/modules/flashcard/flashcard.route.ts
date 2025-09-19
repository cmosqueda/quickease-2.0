import { FastifyInstance } from "fastify";
import {
  get_user_flashcards,
  create_user_flashcard,
  update_user_flashcard,
  delete_user_flashcard,
  toggle_flashcard_visibility,
  get_user_flashcard,
} from "./flashcard.controller";

/**
 * Registers flashcard-related routes for the Fastify server instance.
 *
 * @param fastify - The Fastify server instance to register routes on.
 *
 * @remarks
 * All routes require authentication via the `fastify.authenticate` preHandler.
 *
 * @route GET `/` - Retrieves all flashcards for the authenticated user.
 * @route GET `/:flashcard_id` - Retrieves a specific flashcard by its ID.
 * @route POST `/create` - Creates a new flashcard for the authenticated user.
 * @route PUT `/update` - Updates an existing flashcard.
 * @route DELETE `/delete` - Deletes a flashcard.
 * @route PUT `/toggle-visibility` - Toggles the visibility of a flashcard.
 */

export default async function flashcardRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user_flashcards,
  });

  fastify.get("/:flashcard_id", {
    preHandler: [fastify.authenticate],
    handler: get_user_flashcard,
  });

  fastify.post("/create", {
    preHandler: [fastify.authenticate],
    handler: create_user_flashcard,
  });

  fastify.put("/update", {
    preHandler: [fastify.authenticate],
    handler: update_user_flashcard,
  });

  fastify.delete("/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_user_flashcard,
  });

  fastify.put("/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: toggle_flashcard_visibility,
  });
}
