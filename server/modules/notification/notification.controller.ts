import { FastifyReply, FastifyRequest } from "fastify";
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
} from "./notification.service";

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

export async function delete_notification(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await deleteNotification(notification_id);

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

export async function mark_notification_as_read(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await markNotificationAsRead(notification_id);

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

export async function mark_notification_as_unread(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { notification_id } = request.body as {
    notification_id: string;
  };

  try {
    await markNotificationAsUnread(notification_id);

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
