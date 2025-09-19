import { FastifyInstance } from "fastify";
import {
  get_user_quizzes,
  create_user_quiz,
  update_user_quiz,
  update_user_quiz_visibility,
  delete_user_quiz,
  get_quiz,
  submit_quiz_attempt,
  get_quiz_attempt,
} from "./quiz.controller";

/**
 * Registers quiz-related routes for the Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @routes
 * @route `GET /` - Retrieves quizzes for the authenticated user.
 * @route `GET /:quiz_id` - Retrieves a specific quiz by its ID.
 * @route `GET /attempt/:attempt_id` - Retrieves a specific quiz attempt by its ID.
 * @route `POST /submit` - Submits a quiz attempt.
 * @route `POST /create` - Creates a new quiz for the user.
 * @route `PUT /update` - Updates an existing quiz.
 * @route `PUT /toggle-visibility` - Toggles the visibility of a quiz.
 * @route `DELETE /delete` - Deletes a quiz.
 *
 * All routes require authentication via the `fastify.authenticate` preHandler.
 */
export default async function quizRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user_quizzes,
  });

  fastify.get("/:quiz_id", {
    preHandler: [fastify.authenticate],
    handler: get_quiz,
  });

  fastify.get("/attempt/:attempt_id", {
    preHandler: [fastify.authenticate],
    handler: get_quiz_attempt,
  });

  fastify.post("/submit", {
    preHandler: [fastify.authenticate],
    handler: submit_quiz_attempt,
  });

  fastify.post("/create", {
    preHandler: [fastify.authenticate],
    handler: create_user_quiz,
  });

  fastify.put("/update", {
    preHandler: [fastify.authenticate],
    handler: update_user_quiz,
  });

  fastify.put("/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: update_user_quiz_visibility,
  });

  fastify.delete("/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_user_quiz,
  });
}
