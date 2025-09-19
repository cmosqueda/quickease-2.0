import { FastifyRequest, FastifyReply } from "fastify";
import {
  getComments,
  commentOnPost,
  replyOnComment,
  updateComment,
  deleteComment,
} from "./comment.service";

/**
 * Retrieves comments for a specific forum post.
 *
 * @param { post_id: string } - Fastify request object containing the post ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a list of comments for the given post ID with a 200 status code,
 *          or an error message with a 500 status code if retrieval fails.
 */
export async function get_comments(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { post_id } = request.body as { post_id: string };
  try {
    const comments = await getComments(post_id);

    reply.code(200).send(comments);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting comments.",
    });
  }
}

/**
 * Handles commenting on a forum post.
 *
 * Expects the request body to contain the comment text and the post ID.
 * Calls the `commentOnPost` service to create a new comment associated with the post and the authenticated user.
 * Responds with the created comment on success, or an error message on failure.
 *
 * @param { body: string; post_id: string } - Fastify request object containing the comment data and user information.
 * @param reply - Fastify reply object used to send the response.
 */
export async function comment_on_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, post_id } = request.body as { body: string; post_id: string };
  try {
    const comment = await commentOnPost(body, post_id, request.user.id);

    reply.code(200).send(comment);
  } catch (err) {
    reply.code(500).send({
      message: "Error commenting.",
      errors: err,
    });
  }
}

/**
 * Handles replying to a specific comment on a forum post.
 *
 * @param { body: string; comment_id: string; post_id: string; } - The Fastify request object containing the reply body, comment ID, and post ID.
 * @param reply - The Fastify reply object used to send responses.
 * @returns The created reply object if successful.
 * @throws Sends a 500 error response if an error occurs while replying to the comment.
 */
export async function reply_on_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, comment_id, post_id } = request.body as {
    body: string;
    comment_id: string;
    post_id: string;
  };
  try {
    const reply = await replyOnComment(
      body,
      comment_id,
      request.user.id,
      post_id
    );

    return reply;
  } catch (err) {
    reply.code(500).send({
      message: "Error replying on comment.",
      errors: err,
    });
  }
}

/**
 * Updates a forum comment with the provided body and comment ID.
 *
 * @param { body: string; comment_id: string; } - Fastify request object containing the comment body and ID.
 * @param reply - Fastify reply object used to send the response.
 * @returns The updated comment if successful.
 * @throws Sends a 500 error response if updating the comment fails.
 */
export async function update_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { body, comment_id } = request.body as {
    body: string;
    comment_id: string;
  };

  try {
    return await updateComment(body, comment_id);
  } catch (err) {
    reply.code(500).send({
      message: "Error updating comment",
    });
  }
}

/**
 * Deletes a comment based on the provided comment ID.
 *
 * @param { comment_id: string } - Fastify request object containing the comment ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns A promise that resolves with the result of the comment deletion.
 * @throws Sends a 500 error response if an error occurs during deletion.
 */
export async function delete_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { comment_id } = request.body as {
    comment_id: string;
  };

  try {
    return await deleteComment(comment_id);
  } catch (err) {
    reply.code(500).send({
      message: "Error updating comment",
    });
  }
}
