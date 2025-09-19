import { Expo } from "expo-server-sdk";

/**
 * Instance of the Expo push notification service configured to use FCM v1.
 * 
 * This service is used to send push notifications to devices via Expo's push notification API.
 * 
 * @see https://docs.expo.dev/push-notifications/sending-notifications/
 */
let _EXPO_PUSH_SERVICE = new Expo({
  useFcmV1: true,
});

export default _EXPO_PUSH_SERVICE;
