import { FastifyInstance } from "fastify";
import {
  check_user,
  edit_user_name,
  get_user,
  toggle_user_visibility,
  view_profile,
} from "./user.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user,
  });

  fastify.get("/check", {
    preHandler: [fastify.authenticate],
    handler: check_user,
  });

  fastify.get("/view/:user_id", {
    preHandler: [fastify.authenticate],
    handler: view_profile,
  });

  fastify.put("/edit", {
    preHandler: [fastify.authenticate],
    handler: edit_user_name,
  });

  fastify.put("/toggle-visibility", {
    preHandler: [fastify.authenticate],
    handler: toggle_user_visibility,
  });
}
