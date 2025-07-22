import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  request_to_change_email,
  request_to_change_password,
  test_email,
} from "./mail.controller";

export default async function mailRoutes(fastify: FastifyInstance) {
  fastify.post("/test", {
    handler: test_email,
  });

  fastify.post("/request-change-email", {
    preHandler: [fastify.authenticate],
    handler: request_to_change_email,
  });

  fastify.post("/request-change-password", {
    preHandler: [fastify.authenticate],
    handler: request_to_change_password,
  });
}
