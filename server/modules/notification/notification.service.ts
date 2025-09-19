import db_client from "../../utils/client";
import _EXPO_PUSH_SERVICE from "../../utils/expo";

/**
 * Retrieves the latest 20 notifications for a specific user.
 *
 * @param user_id - The unique identifier of the user whose notifications are to be fetched.
 * @returns A promise that resolves to an array of notification objects for the given user, ordered by creation date in descending order.
 */
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

/**
 * Deletes a notification from the database by its unique identifier.
 *
 * @param notification_id - The unique identifier of the notification to delete.
 * @returns A promise that resolves to `true` if the notification was successfully deleted.
 */
export async function deleteNotification(notification_id: string) {
  await db_client.notification.delete({
    where: {
      id: notification_id,
    },
  });

  return true;
}

/**
 * Marks a notification as read in the database.
 *
 * @param notification_id - The unique identifier of the notification to mark as read.
 * @returns A promise that resolves to `true` when the operation is complete.
 */
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

/**
 * Marks a notification as unread by setting its `is_read` property to `false`.
 *
 * @param notification_id - The unique identifier of the notification to update.
 * @returns A promise that resolves to `true` when the operation is complete.
 */
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
/**
 * Associates a push notification token with a user in the database.
 *
 * @param token - The push notification token to be added.
 * @param user_id - The unique identifier of the user to update.
 * @returns A promise that resolves to `true` when the token has been successfully added.
 */
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
