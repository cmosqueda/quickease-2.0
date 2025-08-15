import useTheme from "@/hooks/useTheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { currentScheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: currentScheme.colorBaseContent,
          drawerActiveBackgroundColor: currentScheme.colorBase300,
          drawerInactiveBackgroundColor: currentScheme.colorBase100,
          drawerInactiveTintColor: currentScheme.colorBase200,
        }}
      >
        <Drawer.Screen
          name="forum"
          options={{
            title: "Forum",
            drawerIcon: () => (
              <CustomText>
                <AntDesign name="home" size={24} />
              </CustomText>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
