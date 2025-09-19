import { FastifyInstance } from "fastify";
import {
  get_user_posts,
  get_post,
  create_post,
  add_tag_on_post,
  delete_post,
  toggle_post_visibility,
  get_recent_posts,
  update_post,
  search_posts,
} from "./post.controller";

import {
  get_comments,
  comment_on_post,
  reply_on_comment,
  delete_comment,
  update_comment,
} from "./comment.controller";

import { vote_on_post, vote_on_comment } from "./vote.controller";
import { report_comment, report_post } from "./report.controller";

/**
 * Registers forum-related routes on the provided Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @route `GET /` - Get posts for the authenticated user.
 * @route `GET /post/:post_id` - Get a specific post by ID.
 * @route `PUT /post/update` - Update an existing post.
 * @route `GET /posts/recent` - Get recent posts.
 * @route `POST /comments/view` - View comments on a post.
 * @route `POST /post/create` - Create a new post.
 * @route `POST /post/comment` - Add a comment to a post.
 * @route `POST /post/vote` - Vote on a post.
 * @route `POST /post/comment/reply` - Reply to a comment.
 * @route `POST /post/comment/vote` - Vote on a comment.
 * @route `PUT /post/comment/update` - Update a comment.
 * @route `DELETE /post/comment/delete` - Delete a comment.
 * @route `POST /post/tag` - Add a tag to a post.
 * @route `DELETE /post/delete` - Delete a post.
 * @route `PUT /post/toggle-visibility` - Toggle post visibility.
 * @route `GET /search` - Search posts.
 * @route `PUT /post/report` - Report a post.
 * @route `PUT /comment/report` - Report a comment.
 *
 * All routes require authentication via the `fastify.authenticate` preHandler.
 */
export default async function forumRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user_posts,
  });

  fastify.get("/post/:post_id", {
    preHandler: [fastify.authenticate],
    handler: get_post,
  });

  fastify.put("/post/update", {
    preHandler: [fastify.authenticate],
    handler: update_post,
  });

  fastify.get("/posts/recent", {
    preHandler: [fastify.authenticate],
    handler: get_recent_posts,
  });

  fastify.post("/comments/view", {
    preHandler: [fastify.authenticate],
    handler: get_comments,
  });

  fastify.post("/post/create", {
    preHandler: [fastify.authenticate],
    handler: create_post,
  });

  fastify.post("/post/comment", {
    preHandler: [fastify.authenticate],
    handler: comment_on_post,
  });

  fastify.post("/post/vote", {
    preHandler: [fastify.authenticate],
    handler: vote_on_post,
  });

  fastify.post("/post/comment/reply", {
    preHandler: [fastify.authenticate],
    handler: reply_on_comment,
  });

  fastify.post("/post/comment/vote", {
    preHandler: [fastify.authenticate],
    handler: vote_on_comment,
  });

  fastify.put("/post/comment/update", {
    preHandler: [fastify.authenticate],
    handler: update_comment,
  });

  fastify.delete("/post/comment/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_comment,
  });

  fastify.post("/post/tag", {
    preHandler: [fastify.authenticate],
    handler: add_tag_on_post,
  });

  fastify.delete("/post/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_post,
  });

  fastify.put("/post/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: toggle_post_visibility,
  });

  fastify.get("/search", {
    preHandler: [fastify.authenticate],
    handler: search_posts,
  });

  fastify.put("/post/report", {
    preHandler: [fastify.authenticate],
    handler: report_post,
  });

  fastify.put("/comment/report", {
    preHandler: [fastify.authenticate],
    handler: report_comment,
  });
}
