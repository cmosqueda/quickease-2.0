import { FastifyReply, FastifyRequest } from "fastify";
import { reportComment, reportPost } from "./report.service";

/**
 * Handles reporting a forum post.
 *
 * Expects `description` and `post_id` in the request body.
 * Calls the `reportPost` service with the provided description, post ID, and the current user's ID.
 * Responds with a 201 status code and a success message if the report is successful.
 * If an error occurs, responds with a 500 status code and an error message.
 *
 * @param { description: string, post_id: string } - Fastify request object containing the report details and user information.
 * @param reply - Fastify reply object used to send the response.
 */
export async function report_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { description, post_id } = request.body as {
      description: string;
      post_id: string;
    };

    await reportPost(description, post_id, request.user.id);

    reply.code(201).send({ message: "Reported post." });
  } catch (err) {
    reply.code(500).send({ message: "Error reporting post", errors: err });
  }
}

/**
 * Handles reporting a comment in the forum.
 *
 * Expects `description` and `comment_id` in the request body.
 * Calls the `reportComment` service with the provided description, comment ID, and the current user's ID.
 * Responds with a 201 status code and a success message if the report is successful.
 * If an error occurs, responds with a 500 status code and an error message.
 *
 * @param { description: string, comment_id: string } - Fastify request object containing the report details and user information.
 * @param reply - Fastify reply object used to send the response.
 */
export async function report_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { description, comment_id } = request.body as {
      description: string;
      comment_id: string;
    };

    await reportComment(description, comment_id, request.user.id);

    reply.code(201).send({ message: "Reported comment." });
  } catch (err) {
    reply.code(500).send({ message: "Error reporting comment", errors: err });
  }
}
