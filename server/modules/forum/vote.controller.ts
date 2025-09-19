import { FastifyRequest, FastifyReply } from "fastify";
import { voteOnComment, voteOnPost } from "./vote.service";

/**
 * Handles voting on a forum post.
 *
 * Expects `vote_type` and `post_id` in the request body.
 * Invokes the `voteOnPost` service with the provided vote type, post ID, and user ID.
 * Responds with the vote result on success, or an error message on failure.
 *
 * @param { vote_type: number; post_id: string; } - Fastify request object containing user and vote data.
 * @param reply - Fastify reply object for sending responses.
 * @returns Sends a response with the vote result or an error message.
 */
export async function vote_on_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { vote_type, post_id } = request.body as {
    vote_type: number;
    post_id: string;
  };
  try {
    const vote = await voteOnPost(vote_type, post_id, request.user.id);

    reply.code(200).send(vote);
  } catch (err) {
    reply.code(500).send({
      message: "Error voting on comment.",
    });
  }
}

/**
 * Handles voting on a forum comment.
 *
 * Receives the vote type and comment ID from the request body, and the user ID from the request context.
 * Calls the `voteOnComment` service to register the vote.
 * Responds with the vote result on success, or an error message on failure.
 *
 * @param { vote_type: number; comment_id: string; } - Fastify request object containing vote details and user information.
 * @param reply - Fastify reply object used to send the response.
 */
export async function vote_on_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { vote_type, comment_id } = request.body as {
    vote_type: number;
    comment_id: string;
  };
  try {
    const vote = await voteOnComment(vote_type, comment_id, request.user.id);

    reply.code(200).send(vote);
  } catch (err) {
    reply.code(500).send({
      message: "Error voting on comment.",
    });
  }
}
