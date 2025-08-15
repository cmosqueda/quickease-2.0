import { FastifyReply, FastifyRequest } from "fastify";
import { checkAndAwardBadges } from "./badges.service";

export async function checkUserBadges(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = await checkAndAwardBadges(request.user.id);
  return reply.send(result);
}
