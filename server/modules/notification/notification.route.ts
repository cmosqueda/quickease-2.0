import { FastifyInstance } from "fastify";
import {
  delete_notification,
  get_user_notifications,
  mark_notification_as_read,
  mark_notification_as_unread,
  send_test_notification,
  update_push_token,
} from "./notification.controller";

/**
 * Registers notification-related routes for the Fastify instance.
 *
 * @param fastify - The Fastify instance to register routes on.
 *
 * @remarks
 * All routes require authentication via the `fastify.authenticate` preHandler.
 *
 * @routes
 * @route `GET /` - Retrieves user notifications.
 * @route `DELETE /delete` - Deletes a notification.
 * @route `PUT /mark-as-read` - Marks a notification as read.
 * @route `PUT /mark-as-unread` - Marks a notification as unread.
 * @route `POST /update-push-token` - Updates the user's push notification token.
 * @route `POST /test-push-notification` - Sends a test push notification.
 */
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

  fastify.post("/update-push-token", {
    preHandler: [fastify.authenticate],
    handler: update_push_token,
  });

  fastify.post("/test-push-notification", {
    preHandler: [fastify.authenticate],
    handler: send_test_notification,
  });
}
