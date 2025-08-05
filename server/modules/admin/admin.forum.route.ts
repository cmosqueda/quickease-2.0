import { FastifyInstance } from "fastify";
import {
  get_reported_posts,
  get_reports_by_post,
  delete_post,
  delete_comment,
  search_reported_posts,
} from "./admin.forum.controller";

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

  fastify.delete("/comment/delete/:comment_id", {
    preHandler: [fastify.authenticate_admin],
    handler: delete_comment,
  });
}
