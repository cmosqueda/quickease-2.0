import { FastifyInstance } from "fastify";
import { checkUserBadges } from "./badges.controller";

export default async function badgeRoutes(fastify: FastifyInstance) {
  fastify.get("/check", {
    preHandler: [fastify.authenticate],
    handler: checkUserBadges,
  });
}
