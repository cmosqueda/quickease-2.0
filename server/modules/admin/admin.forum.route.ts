import { FastifyInstance } from "fastify";
import {
  get_reported_posts,
  get_reports_by_posts,
  delete_post,
  delete_comment,
} from "./admin.forum.controller";

export default async function adminForumRoutes(fastify: FastifyInstance) {
  fastify.get("/admin/forum/reports", {
    preHandler: [fastify.admin_authenticate],
    handler: get_reported_posts,
  });

  fastify.get("/admin/forum/reports/:post_id", {
    preHandler: [fastify.admin_authenticate],
    handler: get_reports_by_posts,
  });

  fastify.delete("/admin/forum/posts/:post_id", {
    preHandler: [fastify.admin_authenticate],
    handler: delete_post,
  });

  fastify.delete("/admin/forum/comments/:comment_id", {
    preHandler: [fastify.admin_authenticate],
    handler: delete_comment,
  });
}
