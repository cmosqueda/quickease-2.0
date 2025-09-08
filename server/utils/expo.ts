import { Expo } from "expo-server-sdk";

let _EXPO_PUSH_SERVICE = new Expo({
  useFcmV1: true,
});

export default _EXPO_PUSH_SERVICE;
