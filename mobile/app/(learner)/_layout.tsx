import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import CustomDrawerContent from "@/components/drawer/DrawerContent";
import useTimer from "@/hooks/useTimer";

import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { setStatusBarStyle } from "expo-status-bar";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import { toast } from "sonner-native";
import { MyTraysProps } from "@/types/trays/trays";
import { useTrays } from "react-native-trays";

import _API_INSTANCE from "@/utils/axios";
import { push } from "expo-router/build/global-state/routing";
import { ToastAndroid } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { done, reset, mode } = useTimer();
  const { push: openPomodoro, pop: closePomodoro } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  useEffect(() => {
    if (currentScheme.colorscheme === "light") {
      setStatusBarStyle("dark");
    } else {
      setStatusBarStyle("light");
    }
  }, [currentScheme.colorscheme]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        await _API_INSTANCE.post("/notifications/update-push-token", {
          token: token,
        });
      })
      .catch((error: any) => {
        toast.error("Allow permissions to send notifications.");
      });
  }, []);

  useEffect(() => {
    if (done) {
      openPomodoro("PomodoroTray", {
        close: closePomodoro,
        openSettings: () => {
          closePomodoro();
          openPomodoro("PomodoroSettingsTray", { back: closePomodoro });
        },
      });

      if (mode === "study") {
        ToastAndroid.show("Study session is done, take a break!", 2000);
      }

      if (mode === "shortBreak") {
        ToastAndroid.show("Short break is done, time to focus!", 2000);
      }

      reset();
    }
  }, [done]);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: "slide",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Protected guard={user?.id ? true : false}>
        <Drawer.Screen name="(forum)" />
        <Drawer.Screen name="(note)" />
        <Drawer.Screen name="(quiz)" />
        <Drawer.Screen name="(settings)" />
        <Drawer.Screen name="(profile)" />
        <Drawer.Screen name="(flashcard)" />
      </Drawer.Protected>
    </Drawer>
  );
}
