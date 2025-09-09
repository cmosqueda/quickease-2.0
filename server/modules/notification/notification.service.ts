import db_client from "../../utils/client";
import _EXPO_PUSH_SERVICE from "../../utils/expo";

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

// Used for EXPO PUSH TOKENS NOTIFICATIONS (EACH DEVICE AND UPSERT), only one token
export async function addPushToken(token: string, user_id: string) {
  await db_client.user.update({
    data: {
      push_token: token,
    },
    where: {
      id: user_id,
    },
  });
  return true;
}

// API TEST
export async function testNotification(user_id: string) {
  const user = await db_client.user.findFirst({
    select: {
      first_name: true,
      last_name: true,
      push_token: true,
    },
    where: {
      id: user_id,
    },
  });

  if (!user.push_token) {
    return false;
  }

  _EXPO_PUSH_SERVICE.sendPushNotificationsAsync([
    {
      to: user.push_token,
      sound: "default",
      title: "Welcome to QuickEase",
      body: `Hello there, ${user.first_name} ${user.last_name}.`,
    },
  ]);

  return true;
}
