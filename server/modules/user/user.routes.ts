import { FastifyInstance } from "fastify";
import {
  change_avatar,
  check_user,
  edit_email,
  edit_user_name,
  get_user,
  toggle_user_visibility,
  view_profile,
} from "./user.controller";

/**
 * Registers user-related routes for the Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * All routes require authentication via the `fastify.authenticate` preHandler.
 *
 * @routes
 * @route `GET /` - Retrieves the authenticated user's information.
 * @route `GET /check` - Checks the authenticated user's status.
 * @route `GET /view/:user_id` - Views the profile of a user by ID.
 * @route `PUT /edit-name` - Edits the authenticated user's name.
 * @route `PUT /edit-email` - Edits the authenticated user's email.
 * @route `PUT /toggle-visibility` - Toggles the authenticated user's visibility.
 * @route `PUT /change-avatar` - Changes the authenticated user's avatar.
 */
export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user,
  });

  fastify.get("/check", {
    preHandler: [fastify.authenticate],
    handler: check_user,
  });

  fastify.get("/view/:user_id", {
    preHandler: [fastify.authenticate],
    handler: view_profile,
  });

  fastify.put("/edit-name", {
    preHandler: [fastify.authenticate],
    handler: edit_user_name,
  });

  fastify.put("/edit-email", {
    preHandler: [fastify.authenticate],
    handler: edit_email,
  });

  fastify.put("/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: toggle_user_visibility,
  });

  fastify.put("/change-avatar", {
    preHandler: [fastify.authenticate],
    handler: change_avatar,
  });
}
