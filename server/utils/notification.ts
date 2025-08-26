import db_client from "../utils/client";

import { NotificationType } from "@prisma/client";

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
    return await db_client.notification.upsert({
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
