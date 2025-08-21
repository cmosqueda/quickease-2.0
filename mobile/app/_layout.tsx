import * as SplashScreen from "expo-splash-screen";
import useTheme from "@/hooks/useTheme";
import _TRAYS from "@/types/trays/trays";

import { Stack } from "expo-router";
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

import "../globals.css";

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
        <TrayProvider
          trays={_TRAYS}
          stackConfigs={{
            SearchTray: {
              adjustForKeyboard: true,
              dismissOnBackdropPress: true,
              stickToTop: true,
              trayStyles: {
                backgroundColor: useTheme.getState().currentScheme.colorBase100,
              },
              backdropStyles: { backgroundColor: "rgba(0,0,0,0.7)" },
            },
            NotificationTray: {
              dismissOnBackdropPress: true,
              trayStyles: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: useTheme.getState().currentScheme.colorBase100,
              },
              backdropStyles: { backgroundColor: "rgba(0,0,0,0.5)" },
              horizontalSpacing: 0,
            },
            FilterTrays: {
              dismissOnBackdropPress: true,
              trayStyles: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: useTheme.getState().currentScheme.colorBase100,
              },
              backdropStyles: { backgroundColor: "rgba(0,0,0,0.5)" },
              horizontalSpacing: 0,
            },
            PomodoroTray: {
              dismissOnBackdropPress: true,
              trayStyles: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: useTheme.getState().currentScheme.colorBase100,
              },
              horizontalSpacing: 0,
              backdropStyles: { backgroundColor: "rgba(0,0,0,0.5)" },
            },
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen
              name="(learner)"
              options={{ animation: "fade_from_bottom" }}
            />
          </Stack>
        </TrayProvider>

        <StatusBar style="auto" translucent animated />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
