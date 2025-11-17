import { FastifyInstance } from "fastify";
import { checkUserBadges } from "./badges.controller";

/**
 * Registers badge-related routes on the provided Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 * @remarks
 * This function sets up the @route `/check` endpoint, which requires authentication
 * and invokes the `checkUserBadges` handler to check user badges.
 */
export default async function badgeRoutes(fastify: FastifyInstance) {
  fastify.get("/check", {
    preHandler: [fastify.authenticate],
    handler: checkUserBadges,
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "10 minutes",
      },
    },
  });
}
