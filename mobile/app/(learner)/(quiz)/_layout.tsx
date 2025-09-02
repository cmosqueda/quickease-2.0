import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="view" />
      <Stack.Screen name="answer" />
      <Stack.Screen name="ai" />
    </Stack>
  );
}
