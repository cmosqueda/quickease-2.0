import {
  getReportedPosts,
  getReportsByPosts,
  deletePost,
  deleteComment,
} from "./admin.forum.service";
import { FastifyRequest, FastifyReply } from "fastify";

export async function get_reported_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const posts = await getReportedPosts();
    return reply.code(200).send(posts);
  } catch {
    return reply.code(500).send({ error: "failed_to_get_reported_posts" });
  }
}

export async function get_reports_by_posts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { post_id } = request.params as { post_id: string };
    const reports = await getReportsByPosts(post_id);
    return reply.code(200).send(reports);
  } catch {
    return reply.code(500).send({ error: "failed_to_get_reports" });
  }
}

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
