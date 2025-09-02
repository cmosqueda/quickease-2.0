import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomDrawerContent from "@/components/drawer/DrawerContent";

import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { setStatusBarStyle } from "expo-status-bar";

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
