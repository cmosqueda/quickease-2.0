import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="post" />
      <Stack.Screen name="search" />
      <Stack.Screen name="flashcard/view" />
      <Stack.Screen name="note/view" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
}
