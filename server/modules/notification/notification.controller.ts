import { FastifyReply, FastifyRequest } from "fastify";
import {
  addPushToken,
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  testNotification,
} from "./notification.service";

/**
 * Retrieves notifications for the authenticated user.
 *
 * @param { user_id: string; } - Fastify request object containing user information.
 * @param reply - Fastify reply object for sending responses.
 * @returns Sends a list of notifications with status 200 on success,
 *          or an error message with status 500 on failure.
 */
export async function get_user_notifications(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const notifications = await getUserNotifications(request.user.id);

    reply.code(200).send(notifications);
  } catch (err) {
    reply.code(500).send({
      message: "Error getting notifications.",
      errors: err,
    });
  }
}

/**
 * Deletes a notification by its ID.
 *
 * @param { notification_id: string; } - Fastify request object containing the notification ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a 200 response on successful deletion, or a 500 response if an error occurs.
 */
export async function delete_notification(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await deleteNotification(notification_id, request.user.id);

    reply.code(200).send({
      message: "Deleted notification.",
    });
  } catch (err) {
    reply.code(500).send({
      message: "Error deleting notification.",
      errors: err,
    });
  }
}

/**
 * Marks a notification as read for the given notification ID.
 *
 * @param { notification_id: string; } - Fastify request object containing the notification ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a response indicating whether the notification was successfully marked as read.
 *
 * @throws Sends a 500 error response if the notification could not be updated.
 */
export async function mark_notification_as_read(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await markNotificationAsRead(notification_id, request.user.id);

    reply.code(201).send({
      updated: true,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Notification not updated.",
      errors: err,
    });
  }
}

/**
 * Marks a notification as unread based on the provided notification ID.
 *
 * @param { notification_id: string; } - Fastify request object containing the notification ID in the body.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a response indicating whether the notification was successfully marked as unread.
 *
 * @throws Sends a 500 error response if the notification could not be updated.
 */
export async function mark_notification_as_unread(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await markNotificationAsUnread(notification_id, request.user.id);

    reply.code(201).send({
      updated: true,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Notification not updated.",
      errors: err,
    });
  }
}

// Used for EXPO PUSH TOKENS NOTIFICATIONS (EACH DEVICE AND UPSERT), only one token
/**
 * Updates the push notification token for the authenticated user.
 *
 * @param { token: string; } - Fastify request object containing the push token in the body and user information.
 * @param reply - Fastify reply object used to send the response.
 * @returns Sends a 200 response with `{ updated: true }` if successful, or a 500 response with error details if failed.
 */
export async function update_push_token(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = request.body as {
    token: string;
  };

  try {
    await addPushToken(token, request.user.id);

    reply.code(200).send({
      updated: true,
    });
  } catch (err) {
    reply.code(500).send({
      message: "Notification push token not updated.",
      errors: err,
    });
  }
}

export async function send_test_notification(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = testNotification(request.user.id);

    if (!result) {
      return reply.code(500).send({
        message: "User has not registered a push notification token.",
      });
    }

    reply.code(200).send({
      sent: true,
    });
  } catch (err) {
    reply.code(500).send({
      message: "User has not registered a push notification token.",
      errors: err,
    });
  }
}
