import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="post/create" />
      <Stack.Screen name="post/view/[id]" />
    </Stack>
  );
}
