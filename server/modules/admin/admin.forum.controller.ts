import {
  getReportedPosts,
  getReportsByPost,
  deletePost,
  deleteComment,
  searchReportedPosts,
  resolvePost,
} from "./admin.forum.service";
import { FastifyRequest, FastifyReply } from "fastify";

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
