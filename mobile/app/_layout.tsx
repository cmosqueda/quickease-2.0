import * as SplashScreen from "expo-splash-screen";
import useTheme from "@/hooks/useTheme";

import { Stack } from "expo-router";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Pressable, useWindowDimensions, View } from "react-native";
import { TrayProvider, useTrays } from "react-native-trays";
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
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import _TRAYS from "@/types/trays/trays";

const client = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentScheme } = useTheme();
  const { height, width } = useWindowDimensions();
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
            main: {
              adjustForKeyboard: true,
              dismissOnBackdropPress: true,
              stickToTop: true,
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
