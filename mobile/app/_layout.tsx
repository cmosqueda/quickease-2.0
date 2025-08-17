import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
  Gabarito_800ExtraBold,
  Gabarito_900Black,
  useFonts,
} from "@expo-google-fonts/gabarito";

import "../globals.css";
import useTheme from "@/hooks/useTheme";

const client = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentScheme } = useTheme();
  const [loaded, error] = useFonts({
    Gabarito_400Regular,
    Gabarito_500Medium,
    Gabarito_600SemiBold,
    Gabarito_700Bold,
    Gabarito_800ExtraBold,
    Gabarito_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={client}>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="(learner)"
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(learner)" />
      </Stack>
      <StatusBar style="auto" translucent animated />
    </QueryClientProvider>
  );
}
