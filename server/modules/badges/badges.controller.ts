import { FastifyReply, FastifyRequest } from "fastify";
import { checkAndAwardBadges } from "./badges.service";

/**
 * Checks and awards badges for the authenticated user.
 *
 * This function retrieves the user's ID from the request object,
 * invokes the badge checking and awarding logic, and sends the result
 * back in the HTTP response.
 *
 * @param { user_id: string; } - The Fastify request object containing user information.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves when the response is sent.
 */
export async function checkUserBadges(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = await checkAndAwardBadges(request.user.id);
  return reply.send(result);
}
