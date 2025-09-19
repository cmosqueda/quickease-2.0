import { FastifyInstance } from "fastify";
import {
  request_to_verify_email,
  request_to_change_email,
  request_to_change_password,
} from "./admin.mail.controller";

/**
 * Registers admin mail-related routes for user email and password requests.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * This function sets up the following POST endpoints, all requiring admin authentication:
 * @route `POST /user/:user_id/request-verify-email`: Request to verify a user's email.
 * @route `POST /user/:user_id/request-change-email`: Request to change a user's email.
 * @route `POST /user/:user_id/request-change-password`: Request to change a user's password.
 *
 * Each route uses its respective handler and the `fastify.authenticate_admin` preHandler for authorization.
 */
export default async function adminMailRoutes(fastify: FastifyInstance) {
  fastify.post("/user/:user_id/request-verify-email", {
    handler: request_to_verify_email,
    preHandler: [fastify.authenticate_admin],
  });

  fastify.post("/user/:user_id/request-change-email", {
    handler: request_to_change_email,
    preHandler: [fastify.authenticate_admin],
  });

  fastify.post("/user/:user_id/request-change-password", {
    handler: request_to_change_password,
    preHandler: [fastify.authenticate_admin],
  });
}
