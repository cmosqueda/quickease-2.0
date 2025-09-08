import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import CustomDrawerContent from "@/components/drawer/DrawerContent";

import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { setStatusBarStyle } from "expo-status-bar";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import _API_INSTANCE from "@/utils/axios";
import { toast } from "sonner-native";

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
        toast.error("Allow permission to send notifications.");
        console.log(error);
      });
  }, []);

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
