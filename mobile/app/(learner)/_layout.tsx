import useTheme from "@/hooks/useTheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useWindowDimensions, View } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";

function CustomDrawerContent(props: any) {
  const { height } = useWindowDimensions();
  const { currentScheme } = useTheme();

  const links = [
    {
      label: "Forum",
      href: "forum",
      icon: "solution1" as any,
    },
    {
      href: "notes",
      label: "Notes",
      icon: "copy1" as any,
    },
    {
      href: "quizzes",
      label: "Quizzes",
      icon: "unknowfile1" as any,
    },
    {
      href: "flashcards",
      label: "Flashcards",
      icon: "profile" as any,
    },
  ];

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        gap: 12,
        flex: 1,
        backgroundColor: currentScheme.colorBase200,
      }}
    >
      <CustomPressable
        variant="colorBase100"
        className="flex flex-row gap-4 items-center rounded-3xl"
        style={{
          paddingVertical: 16,
        }}
        onPress={() => props.navigation.navigate("profile")}
      >
        <CustomText color="colorBaseContent">
          <MaterialIcons name="account-circle" size={36} />
        </CustomText>
        <CustomText variant="bold" className="text-xl" color="colorBaseContent">
          Jhon Lloyd Viernes
        </CustomText>
      </CustomPressable>
      <View
        className="border-b h-1 my-2 mx-4"
        style={{
          borderColor: currentScheme.colorBaseContent,
          opacity: 0.2,
        }}
      />
      {links.map((link) => {
        return (
          <DrawerItem
            key={link.href}
            onPress={() => props.navigation.navigate(link.href)}
            label={link.label}
            activeTintColor={currentScheme.colorBaseContent}
            activeBackgroundColor={currentScheme.colorBase300}
            inactiveBackgroundColor={currentScheme.colorBase100}
            inactiveTintColor={currentScheme.colorBaseContent}
            icon={() => (
              <CustomText>
                <AntDesign name={link.icon} size={24} />
              </CustomText>
            )}
          />
        );
      })}
      <View className="flex-1" />
      <View className="flex-1" />
      <View className="flex-1" />
      <View className="flex-1" />
      <View className="flex-1" />
      <View className="flex-1 flex flex-row gap-2 items-center self-end">
        <CustomPressable className="flex-1 rounded-full" variant="colorBase100">
          <CustomText>
            <MaterialIcons name="timer" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex-1 rounded-full"
          variant="colorBase100"
          onPress={() => props.navigation.navigate("settings")}
        >
          <CustomText>
            <MaterialIcons name="settings" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 rounded-full items-center"
          variant="colorBase100"
        >
          <CustomText>
            <MaterialIcons name="logout" size={20} />
          </CustomText>
          <CustomText className="text-lg">Logout</CustomText>
        </CustomPressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  const { currentScheme } = useTheme();

  useEffect(() => {
    if (currentScheme.colorscheme === "light") {
      setStatusBarStyle("dark");
    } else {
      setStatusBarStyle("light");
    }
  }, [currentScheme.colorscheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: currentScheme.colorBaseContent,
          drawerActiveBackgroundColor: currentScheme.colorBase300,
          drawerInactiveBackgroundColor: currentScheme.colorBase100,
          drawerInactiveTintColor: currentScheme.colorBaseContent,
          drawerContentContainerStyle: { gap: 12 },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      />
    </GestureHandlerRootView>
  );
}
