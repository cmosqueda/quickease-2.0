import { FastifyInstance } from "fastify";
import {
  request_to_change_email,
  request_to_change_forgotten_password,
  request_to_change_password,
  request_to_verify_email,
} from "./mail.controller";

/**
 * Registers mail-related routes for email verification, email change, and password management.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * - All routes except `/forgot-password` require authentication via the `fastify.authenticate` preHandler.
 *
 * @route `POST /request-verify-email`: Requests email verification.
 * @route `POST /request-change-email`: Requests email change.
 * @route `POST /request-change-password`: Requests password change.
 * @route `POST /forgot-password`: Requests password reset for forgotten password (no authentication required).
 */
export default async function mailRoutes(fastify: FastifyInstance) {
  fastify.post("/request-verify-email", {
    preHandler: [fastify.authenticate],
    handler: request_to_verify_email,
  });

  fastify.post("/request-change-email", {
    preHandler: [fastify.authenticate],
    handler: request_to_change_email,
  });

  fastify.post("/request-change-password", {
    preHandler: [fastify.authenticate],
    handler: request_to_change_password,
  });

  fastify.post("/forgot-password", {
    handler: request_to_change_forgotten_password,
  });
}
