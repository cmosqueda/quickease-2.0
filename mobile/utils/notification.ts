import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Platform } from "react-native";

/**
 * Handles registration errors by displaying an alert with the provided error message
 * and then throwing an Error with the same message.
 *
 * @param errorMessage - The error message to display and throw.
 * @throws {Error} Throws an error with the provided error message.
 */
export function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

/**
 * Registers the device for push notifications and returns the Expo push token.
 *
 * - On Android, sets up the notification channel with custom vibration and light color.
 * - Requests notification permissions if not already granted.
 * - Handles errors for missing permissions, missing project ID, or non-physical devices.
 * - Returns the Expo push token string if registration is successful.
 *
 * @returns {Promise<string | undefined>} The Expo push token string, or undefined if registration fails.
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}
