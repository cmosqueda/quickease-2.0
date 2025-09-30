import {
  getReportedPosts,
  getReportsByPost,
  deletePost,
  deleteComment,
  searchReportedPosts,
  resolvePost,
  getReportedComments,
  getReportsByComment,
} from "./admin.forum.service";
import { FastifyRequest, FastifyReply } from "fastify";

/**
 * Handles the retrieval of reported forum posts for admin review.
 *
 * @param request - The Fastify request object, expected to contain a `page` query parameter for pagination.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A list of reported posts for the specified page, or an error message if retrieval fails.
 */
export async function get_reported_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const page = Number((request.query as any).page) || 1;

    const posts = await getReportedPosts(page);
    return reply.code(200).send(posts);
  } catch (err) {
    return reply.code(500).send({ error: "failed_to_get_reported_posts" });
  }
}

export async function get_reported_comments(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const page = Number((request.query as any).page) || 1;

    const posts = await getReportedComments(page);
    return reply.code(200).send(posts);
  } catch (err) {
    return reply.code(500).send({ error: "failed_to_get_reported_comments" });
  }
}

/**
 * Handles searching for reported forum posts with pagination and optional query filtering.
 *
 * @param { page?: string, q?: string } - Fastify request object containing query parameters:
 *   - `page`: The page number for pagination (defaults to "1").
 *   - `q`: Optional search query string.
 * @param reply - Fastify reply object used to send responses.
 * @returns Sends a 200 response with the search results, or an error response:
 *   - 400 if the page parameter is invalid.
 *   - 500 if an internal error occurs during search.
 */
export async function search_reported_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { page = "1", q = "" } = request.query as {
      page?: string;
      q?: string;
    };

    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return reply.code(400).send({ error: "invalid_page_param" });
    }

    const result = await searchReportedPosts(pageNum, q);
    return reply.code(200).send(result);
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "failed_to_get_reported_posts" });
  }
}

/**
 * Handles the retrieval of reports associated with a specific post.
 *
 * @param { post_id: string } - The Fastify request object containing the post ID in its parameters.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves with a list of reports for the specified post,
 *          or an error response if the operation fails.
 */
export async function get_reports_by_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { post_id } = request.params as { post_id: string };
    const reports = await getReportsByPost(post_id);
    return reply.code(200).send(reports);
  } catch {
    return reply.code(500).send({ error: "failed_to_get_reports" });
  }
}

export async function get_reports_by_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { comment_id } = request.params as { comment_id: string };
    const reports = await getReportsByComment(comment_id);
    return reply.code(200).send(reports);
  } catch {
    return reply.code(500).send({ error: "failed_to_get_reports" });
  }
}

/**
 * Deletes a forum post as an admin.
 *
 * @param { post_id: string, user_id: string } - Fastify request object containing `post_id` in params and `user_id` in body.
 * @param reply - Fastify reply object used to send the response.
 * @returns A success response if the post is deleted, or an error response if deletion fails.
 */
export async function delete_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { post_id } = request.params as { post_id: string };
    const { user_id } = request.body as { user_id: string };

    const admin_id = request.user.id;

    await deletePost(post_id, admin_id, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_delete_post" });
  }
}

/**
 * Deletes a comment from the forum as an admin.
 *
 * @param { comment_id: string, user_id: string } - Fastify request object containing `comment_id` in params and `user_id` in body.
 * @param reply - Fastify reply object used to send the response.
 * @returns A success response if the comment is deleted, or an error response if deletion fails.
 *
 * @throws Returns a 500 error response if the deletion process fails.
 */
export async function delete_comment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { comment_id } = request.params as { comment_id: string };
    const { user_id } = request.body as { user_id: string };

    const admin_id = request.user.id;

    await deleteComment(comment_id, admin_id, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_delete_comment" });
  }
}

/**
 * Resolves a forum post by an admin.
 *
 * @param { post_id: string, user_id: string } - The Fastify request object containing `post_id` in params and `user_id` in body.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A success response if the post is resolved, or an error response if the operation fails.
 *
 * @throws Returns a 500 error response if resolving the post fails.
 */
export async function resolve_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { post_id } = request.params as { post_id: string };
    const { user_id } = request.body as { user_id: string };

    const admin_id = request.user.id;

    await resolvePost(post_id, admin_id, user_id);
    return reply.code(200).send({ success: true });
  } catch {
    return reply.code(500).send({ error: "failed_to_delete_post" });
  }
}
