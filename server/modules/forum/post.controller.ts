import { FastifyReply, FastifyRequest } from "fastify";
import {
  addTagOnPost,
  createPost,
  deletePost,
  getPost,
  getRecentPosts,
  getUserPosts,
  searchPost,
  togglePostVisibility,
  updatePost,
} from "./post.service";
import { Post } from "@prisma/client";

type CreatedPost = (Post & { toxic?: boolean }) | { toxic: boolean };

/**
 * Retrieves all posts created by the authenticated user.
 *
 * @param { user_id: string } - Fastify request object containing the authenticated user.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a list of user posts with HTTP 200 status on success,
 *          or an error message with HTTP 500 status on failure.
 */
export async function get_user_posts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const posts = await getUserPosts(request.user.id);

    reply.code(200).send(posts);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting user posts.",
    });
  }
}

/**
 * Handles the request to fetch recent forum posts.
 *
 * @param { cursor:string; limit:string; } - The Fastify request object containing query parameters `cursor` (for pagination) and `limit` (number of posts to fetch).
 * @param reply - The Fastify reply object used to send the response.
 * @returns Sends a list of recent posts with HTTP status 200 on success, or an error message with status 500 on failure.
 */
export async function get_recent_posts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { cursor, limit } = request.query as {
      cursor?: string;
      limit?: string;
    };

    const data = await getRecentPosts(cursor, parseInt(limit ?? "10"));
    reply.code(200).send(data);
  } catch (err) {
    reply.code(500).send({ message: "Error fetching posts." });
  }
}

export async function get_post(request: FastifyRequest, reply: FastifyReply) {
  const { post_id } = request.params as { post_id: string };
  try {
    const post = await getPost(post_id, request.user.id);

    reply.code(200).send(post);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting post.",
    });
  }
}

/**
 * Handles the creation of a new forum post.
 *
 * Expects the request body to contain the post content, title, optional attachments, and optional tags.
 * The attachments should specify the resource type and resource ID.
 *
 * If the created post is detected as toxic, responds with a 400 status and a warning message.
 * Otherwise, responds with the created post and a 200 status.
 *
 * In case of errors during post creation, responds with a 500 status and error details.
 *
 * @param request - FastifyRequest containing the post data and user information.
 * @param reply - FastifyReply used to send the response.
 * @returns Sends the created post or an error response.
 */
export async function create_post(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { body, title, attachments, tags } = request.body as {
    body: string;
    title: string;
    attachments?: {
      resource_type: "NOTE" | "QUIZ" | "FLASHCARD";
      resource_id: string;
    }[];
    tags?: string[];
  };

  try {
    const post: CreatedPost = await createPost(
      body,
      title,
      request.user.id,
      attachments,
      tags,
    );

    if ("toxic" in post && post.toxic) {
      return reply.code(400).send({
        toxic: true,
        message:
          "Your post is toxic, as detected on our system. It might be falsely detected, please refrain on posting any offensive material.",
      });
    }

    reply.code(200).send(post);
  } catch (err) {
    console.error("Error creating post:", err);
    reply.code(500).send({ message: "Error posting.", err });
  }
}

export async function update_post(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { body, title, post_id, attachments } = request.body as {
    body: string;
    title: string;
    post_id: string;
    attachments?: {
      resource_type: "NOTE" | "QUIZ" | "FLASHCARD";
      resource_id: string;
    }[];
  };

  try {
    const updatedPost = await updatePost(
      body,
      title,
      post_id,
      request.user.id,
      attachments,
    );
    reply.code(200).send(updatedPost);
  } catch (err: any) {
    reply.code(400).send({
      message: err.message || "Error editing post.",
    });
  }
}

/**
 * Adds tags to a specific post.
 *
 * @param { tags:string[]; post_id:string; } - Fastify request object containing `tags` (array of strings) and `post_id` (string) in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends the updated tags on success with status 200, or an error message with status 500 on failure.
 */
export async function add_tag_on_post(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { tags, post_id } = request.body as {
    tags: string[];
    post_id: string;
  };

  try {
    const _tags = await addTagOnPost(post_id, tags);
    reply.code(200).send(_tags);
  } catch (err) {
    reply.code(500).send({
      message: "Error adding tags.",
    });
  }
}

/**
 * Deletes a forum post by its ID.
 *
 * @param { post_id: string } - Fastify request object containing the post ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a 200 response on successful deletion, or a 500 response if an error occurs.
 */
export async function delete_post(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { post_id } = request.body as { post_id: string };
  try {
    await deletePost(post_id, request.user.id);

    reply.code(200).send({
      message: "Deleted post.",
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error deleting post.",
    });
  }
}

/**
 * Toggles the visibility of a forum post.
 *
 * @param { visibility: boolean; post_id: string; } - Fastify request object containing the post ID and desired visibility state in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a success message if the post visibility is updated, or an error message if the operation fails.
 */
export async function toggle_post_visibility(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { visibility, post_id } = request.body as {
    visibility: boolean;
    post_id: string;
  };

  try {
    await togglePostVisibility(visibility, post_id, request.user.id);

    reply.code(200).send({
      message: "Updated post visibility.",
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error updating post visibility.",
    });
  }
}

/**
 * Handles searching for forum posts based on a query string.
 *
 * @param { query: string; sort: string; page: number; limit: number } - Fastify request object containing query parameters:
 *   - `query`: The search term (required).
 *   - `sort`: Optional sort order ("newest", "top", or "comments").
 *   - `page`: Optional page number for pagination (default: 1).
 *   - `limit`: Optional number of results per page (default: 10).
 * @param reply - Fastify reply object used to send the response.
 *
 * @returns Sends a 200 response with search results on success,
 *          a 400 response if the query is missing,
 *          or a 500 response if an error occurs during search.
 */
export async function search_posts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { query, sort } = request.query as {
    query: string;
    sort?: "newest" | "top" | "comments";
  };
  const page = Number((request.query as any).page ?? 1);
  const limit = Number((request.query as any).limit ?? 10);

  if (!query || !query.trim()) {
    return reply.code(400).send({ message: "Query is required." });
  }

  try {
    const result = await searchPost(query, page, limit, sort ?? "newest");
    reply.code(200).send(result);
  } catch (err) {
    console.error("Search error:");
    reply.code(500).send({ message: "Search failed." });
  }
}
