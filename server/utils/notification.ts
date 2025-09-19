import db_client from "../utils/client";
import _EXPO_PUSH_SERVICE from "./expo";

import { NotificationType } from "@prisma/client";

/**
 * Sends a notification to a recipient, ensuring that duplicate notifications for the same
 * recipient, actor, type, and resource are upserted (updated or created as needed).
 * If the recipient and actor are the same, no notification is sent.
 *
 * @param recipientId - The ID of the user who will receive the notification.
 * @param actorId - The ID of the user who triggered the notification.
 * @param type - The type of notification to send.
 * @param message - The notification message content.
 * @param resourceId - (Optional) The ID of the related resource.
 * @param resourceType - (Optional) The type of the related resource.
 *
 * @remarks
 * Uses an upsert operation to avoid duplicate notifications for the same event.
 * Logs an error to the console if the upsert fails.
 */
export async function sendNotification({
  recipientId,
  actorId,
  type,
  message,
  resourceId,
  resourceType,
}: {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  message: string;
  resourceId?: string;
  resourceType?: string;
}) {
  if (recipientId === actorId) return;

  try {
    await db_client.notification.upsert({
      where: {
        recipient_id_actor_id_type_resource_id: {
          recipient_id: recipientId,
          actor_id: actorId,
          type,
          resource_id: resourceId ?? "",
        },
      },
      update: {
        message,
        is_read: false,
      },
      create: {
        recipient_id: recipientId,
        actor_id: actorId,
        type,
        message,
        resource_id: resourceId ?? "",
        resource_type: resourceType,
      },
    });
  } catch (error) {
    console.error("Notification upsert failed:", error);
  }
}
