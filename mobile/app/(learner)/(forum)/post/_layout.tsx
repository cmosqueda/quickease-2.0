import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="create" />
      <Stack.Screen name="view" options={{ animation: "fade_from_bottom" }} />
      <Stack.Screen name="edit" options={{ animation: "fade_from_bottom" }} />
    </Stack>
  );
}
