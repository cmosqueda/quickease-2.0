import { FastifyInstance } from "fastify";
import {
  delete_notification,
  get_user_notifications,
  mark_notification_as_read,
  mark_notification_as_unread,
} from "./notification.controller";

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: get_user_notifications,
  });

  fastify.delete("/delete", {
    preHandler: [fastify.authenticate],
    handler: delete_notification,
  });

  fastify.put("/mark-as-read", {
    preHandler: [fastify.authenticate],
    handler: mark_notification_as_read,
  });

  fastify.put("/mark-as-unread", {
    preHandler: [fastify.authenticate],
    handler: mark_notification_as_unread,
  });
}
