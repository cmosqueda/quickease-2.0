import { FastifyInstance } from "fastify";
import {
  get_users,
  search_users,
  update_user_email,
  update_user_password,
  update_user_full_name,
  update_user_visibility,
  delete_user,
  get_user,
} from "./admin.auth.controller";

/**
 * Registers admin authentication routes for user management in the Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * All routes require admin authentication via the `fastify.authenticate_admin` preHandler.
 *
 * @route `GET /users` - Retrieves a list of users.
 * @route `GET /user/:user_id` - Retrieves details of a specific user by ID.
 * @route `GET /users/search` - Searches for users based on query parameters.
 * @route `PUT /users/:user_id/email` - Updates the email address of a user.
 * @route `PUT /users/:user_id/password` - Updates the password of a user.
 * @route `PUT /users/:user_id/name` - Updates the full name of a user.
 * @route `PUT /users/:user_id/visibility` - Updates the visibility status of a user.
 * @route `DELETE /users/:user_id/delete` - Deletes a user by ID.
 */
export default async function adminAuthRoutes(fastify: FastifyInstance) {
  fastify.get("/users", {
    preHandler: [fastify.authenticate_admin],
    handler: get_users,
  });

  fastify.get("/user/:user_id", {
    preHandler: [fastify.authenticate_admin],
    handler: get_user,
  });

  fastify.get("/users/search", {
    preHandler: [fastify.authenticate_admin],
    handler: search_users,
  });

  fastify.put("/users/:user_id/email", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_email,
  });

  fastify.put("/users/:user_id/password", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_password,
  });

  fastify.put("/users/:user_id/name", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_full_name,
  });

  fastify.put("/users/:user_id/visibility", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_visibility,
  });

  fastify.delete("/users/:user_id/delete", {
    preHandler: [fastify.authenticate_admin],
    handler: delete_user,
  });
}
