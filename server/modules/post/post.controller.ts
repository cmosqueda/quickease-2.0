import { FastifyReply, FastifyRequest } from "fastify";
import {
  addTagOnPost,
  commentOnPost,
  createPost,
  deletePost,
  getComments,
  getPost,
  getRecentPosts,
  getUserPosts,
  replyOnComment,
  searchPost,
  togglePostVisibility,
  updatePost,
  voteOnComment,
  voteOnPost,
} from "./post.service";

export async function get_user_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const posts = getUserPosts(request.user.id);

    reply.code(200).send(posts);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting user posts.",
    });
  }
}

export async function get_recent_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { cursor, limit } = request.query as {
      cursor?: string;
      limit?: string;
    };

    const data = await getRecentPosts(cursor, parseInt(limit ?? "10"));
    reply.code(200).send(data);
  } catch (err) {
    reply.code(500).send({ message: "Error fetching posts.", err });
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
      err,
    });
  }
}

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

export async function create_post(
  request: FastifyRequest,
  reply: FastifyReply
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
    const post = await createPost(
      body,
      title,
      request.user.id,
      attachments,
      tags
    );
    reply.code(200).send(post);
  } catch (err) {
    console.error("Error creating post:", err);
    reply.code(500).send({ message: "Error posting.", err });
  }
}

export async function update_post(
  request: FastifyRequest,
  reply: FastifyReply
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
      attachments
    );
    reply.code(200).send(updatedPost);
  } catch (err: any) {
    reply.code(400).send({
      message: err.message || "Error editing post.",
    });
  }
}

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
    });
  }
}

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
    });
  }
}

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
export async function add_tag_on_post(
  request: FastifyRequest,
  reply: FastifyReply
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

export async function delete_post(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { post_id } = request.body as { post_id: string };
  try {
    await deletePost(post_id);

    reply.code(200).send({
      message: "Deleted post.",
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error deleting post.",
    });
  }
}

export async function toggle_post_visibility(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { visibility, post_id } = request.body as {
    visibility: boolean;
    post_id: string;
  };

  try {
    await togglePostVisibility(visibility, post_id);

    reply.code(200).send({
      message: "Updated post visibility.",
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error updating post visibility.",
    });
  }
}

export async function search_posts(
  request: FastifyRequest,
  reply: FastifyReply
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
    console.error("Search error:", err);
    reply.code(500).send({ message: "Search failed.", err });
  }
}
