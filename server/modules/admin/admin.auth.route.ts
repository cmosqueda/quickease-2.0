import { FastifyInstance } from "fastify";
import {
  get_users,
  search_users,
  update_user_email,
  update_user_password,
  update_user_full_name,
  update_user_visibility,
  delete_user,
} from "./admin.auth.controller";

export default async function adminAuthRoutes(fastify: FastifyInstance) {
  fastify.get("/users", {
    preHandler: [fastify.authenticate_admin],
    handler: get_users,
  });

  fastify.get("/users/search", {
    preHandler: [fastify.authenticate_admin],
    handler: search_users,
  });

  fastify.put("/users/:user_id/email", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_email,
  });

  fastify.put("/users/:user_id/password", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_password,
  });

  fastify.put("/users/:user_id/name", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_full_name,
  });

  fastify.put("/users/:user_id/visibility", {
    preHandler: [fastify.authenticate_admin],
    handler: update_user_visibility,
  });

  fastify.delete("/users/:user_id", {
    preHandler: [fastify.authenticate_admin],
    handler: delete_user,
  });
}
