import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="others/[id]" />
    </Stack>
  );
}
