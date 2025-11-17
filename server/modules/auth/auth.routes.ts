import { FastifyInstance } from "fastify";
import {
  login_user,
  register_user,
  logout,
  update_password,
  update_email,
  verify_email,
} from "./auth.controller";

/**
 * Registers authentication-related routes for the Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * This function sets up the following routes:
 * @route POST `/login`: Handles user login.
 * @route POST `/register`: Handles user registration.
 * @route POST `/logout`: Logs out the authenticated user. Requires authentication.
 * @route PUT `/update-password`: Updates the authenticated user's password. Requires authentication.
 * @route PUT `/update-email`: Updates the authenticated user's email. Requires authentication.
 * @route PUT `/verify-email`: Verifies the authenticated user's email. Requires authentication.
 */
export default async function authRoutes(fastify: FastifyInstance) {
  const authRateLimit = {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  };

  fastify.post("/login", {
    ...authRateLimit,
    handler: login_user,
  });

  fastify.post("/register", {
    ...authRateLimit,
    handler: register_user,
  });

  fastify.post("/logout", {
    ...authRateLimit,
    preHandler: [fastify.authenticate],
    handler: logout,
  });

  fastify.put("/update-password", {
    ...authRateLimit,
    preHandler: [fastify.authenticate],
    handler: update_password,
  });

  fastify.put("/update-email", {
    ...authRateLimit,
    preHandler: [fastify.authenticate],
    handler: update_email,
  });

  fastify.put("/verify-email", {
    ...authRateLimit,
    preHandler: [fastify.authenticate],
    handler: verify_email,
  });
}
