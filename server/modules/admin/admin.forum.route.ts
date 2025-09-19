import { FastifyInstance } from "fastify";
import {
  get_reported_posts,
  get_reports_by_post,
  delete_post,
  delete_comment,
  search_reported_posts,
  resolve_post,
} from "./admin.forum.controller";

/**
 * Registers admin forum routes for managing reported posts and comments.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * The following routes are registered:
 * @route `GET /reports`: Retrieves all reported posts.
 * @route `GET /reports/search`: Searches reported posts.
 * @route `GET /report/:post_id`: Retrieves reports for a specific post.
 * @route `DELETE /post/delete/:post_id`: Deletes a specific post.
 * @route `POST /post/resolve/:post_id`: Resolves a specific post.
 * @route `DELETE /comment/delete/:comment_id`: Deletes a specific comment.
 *
 * All routes require admin authentication via the `fastify.authenticate_admin` preHandler.
 */
export default async function adminForumRoutes(fastify: FastifyInstance) {
  fastify.get("/reports", {
    preHandler: [fastify.authenticate_admin],
    handler: get_reported_posts,
  });

  fastify.get("/reports/search", {
    preHandler: [fastify.authenticate_admin],
    handler: search_reported_posts,
  });

  fastify.get("/report/:post_id", {
    preHandler: [fastify.authenticate_admin],
    handler: get_reports_by_post,
  });

  fastify.delete("/post/delete/:post_id", {
    preHandler: [fastify.authenticate_admin],
    handler: delete_post,
  });

  fastify.post("/post/resolve/:post_id", {
    preHandler: [fastify.authenticate_admin],
    handler: resolve_post,
  });

  fastify.delete("/comment/delete/:comment_id", {
    preHandler: [fastify.authenticate_admin],
    handler: delete_comment,
  });
}
