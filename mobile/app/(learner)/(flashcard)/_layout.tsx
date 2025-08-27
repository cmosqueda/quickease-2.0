import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ animation: "fade_from_bottom" }} />
      <Stack.Screen name="edit/[id]" />
      <Stack.Screen name="view/[id]" />
      <Stack.Screen name="ai/generated" />
    </Stack>
  );
}
