import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";
import { Toaster } from "sonner-native";
import { useEffect } from "react";
import { TrayProvider } from "react-native-trays";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
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

import _TRAYS from "@/types/trays/trays";
import _STACK_CONFIG from "@/types/trays/stack_config";

import "../globals.css";

const client = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentScheme } = useTheme();
  const { user } = useAuth();
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

  useEffect(() => {
    if (currentScheme.colorscheme === "light") {
      setStatusBarStyle("dark");
    } else {
      setStatusBarStyle("light");
    }
  }, [currentScheme.colorscheme]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={client}>
        <TrayProvider trays={_TRAYS} stackConfigs={_STACK_CONFIG} >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Protected guard={user?.id ? true : false}>
              <Stack.Screen
                name="(learner)"
                options={{ animation: "fade_from_bottom" }}
              />
            </Stack.Protected>
          </Stack>
        </TrayProvider>
        <Toaster
          position="top-center"
          swipeToDismissDirection="left"
          theme={currentScheme.colorscheme === "dark" ? "light" : "dark"}
          style={{
            backgroundColor: currentScheme.colorPrimary,
          }}
        />
        <StatusBar style="auto" translucent animated />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
