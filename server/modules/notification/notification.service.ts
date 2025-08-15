import db_client from "../../utils/client";

export async function getUserNotifications(user_id: string) {
  const notifications = await db_client.notification.findMany({
    where: {
      recipient_id: user_id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 20,
  });

  return notifications;
}

export async function deleteNotification(notification_id: string) {
  await db_client.notification.delete({
    where: {
      id: notification_id,
    },
  });

  return true;
}

export async function markNotificationAsRead(notification_id: string) {
  await db_client.notification.update({
    data: {
      is_read: true,
    },
    where: {
      id: notification_id,
    },
  });

  return true;
}

export async function markNotificationAsUnread(notification_id: string) {
  await db_client.notification.update({
    data: {
      is_read: false,
    },
    where: {
      id: notification_id,
    },
  });

  return true;
}
