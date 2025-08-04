import { FastifyInstance } from "fastify";
import {
  request_to_verify_email,
  request_to_change_email,
  request_to_change_password,
} from "./admin.mail.controller";

export default async function adminMailRoutes(fastify: FastifyInstance) {
  fastify.post("/user/:user_id/request-verify-email", {
    handler: request_to_verify_email,
    preHandler: [fastify.authenticate_admin],
  });

  fastify.post("/user/:user_id/request-change-email", {
    handler: request_to_change_email,
    preHandler: [fastify.authenticate_admin],
  });

  fastify.post("/user/:user_id/request-change-password", {
    handler: request_to_change_password,
    preHandler: [fastify.authenticate_admin],
  });
}
