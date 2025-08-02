import { FastifyInstance } from "fastify";
import {
  login_user,
  register_user,
  logout,
  update_password,
  update_email,
} from "./auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", {
    handler: login_user,
  });

  fastify.post("/register", {
    handler: register_user,
  });

  fastify.post("/logout", {
    preHandler: [fastify.authenticate],
    handler: logout,
  });

  fastify.put("/update-password", {
    handler: update_password,
  });

  fastify.put("/update-password", {
    handler: update_email,
  });
}
