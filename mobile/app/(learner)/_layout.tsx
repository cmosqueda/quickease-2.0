import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Drawer } from "expo-router/drawer";
import { useTrays } from "react-native-trays";
import { useEffect } from "react";
import { MyTraysProps } from "@/types/trays/trays";
import { DrawerActions } from "@react-navigation/native";
import { setStatusBarStyle } from "expo-status-bar";
import { ToastAndroid, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import _API_INSTANCE from "@/utils/axios";

function CustomDrawerContent(props: any) {
  const { currentScheme } = useTheme();
  const { push: openPomodoro, pop: closePomodoro } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { isRunning, mode, pause, reset, start, tick, time } = useTimer();

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const links = [
    {
      href: "(forum)",
      label: "Forum",
      icon: "solution1" as any,
    },
    {
      href: "(note)",
      label: "Notes",
      icon: "copy1" as any,
    },
    {
      href: "(quiz)",
      label: "Quizzes",
      icon: "unknowfile1" as any,
    },
    {
      href: "(flashcard)",
      label: "Flashcards",
      icon: "profile" as any,
    },
  ];

  const handleLogout = async () => {
    try {
      useAuth.setState((state) => {
        state.user = undefined;
      });
      await _API_INSTANCE.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      ToastAndroid.show(
        err.message || "Error logging out.",
        ToastAndroid.SHORT
      );
    }
  };

  const PomodoroComponent = () => {
    return (
      <CustomView variant="colorBase100" className="p-4 gap-2 rounded-3xl">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-4 items-center">
            <View>
              <CustomText variant="bold" className="">
                {mode === "study" ? "Study Mode" : "Short Break Mode"}
              </CustomText>
              <CustomText className="text-xs" style={{ opacity: 0.5 }}>
                Current mode
              </CustomText>
            </View>
          </View>
        </View>

        <View className="flex flex-row gap-4 items-center justify-between">
          <View className="items-center">
            <CustomText variant="black" className="text-3xl">
              {formatTime(time)}
            </CustomText>
          </View>
          <View className="flex flex-row gap-4 justify-center">
            {isRunning && (
              <CustomPressable
                className="flex flex-row gap-2 items-center justify-center rounded-3xl"
                variant="colorBase300"
                onPress={() => pause()}
              >
                <CustomText>
                  <MaterialIcons name="pause" size={20} />
                </CustomText>
              </CustomPressable>
            )}
            {!isRunning && (
              <CustomPressable
                className="flex flex-row gap-2 items-center justify-center rounded-3xl"
                variant="colorBase300"
                onPress={() => start()}
              >
                <CustomText>
                  <MaterialIcons name="play-arrow" size={20} />
                </CustomText>
              </CustomPressable>
            )}

            <CustomPressable
              className="flex flex-row gap-2 items-center justify-center rounded-3xl"
              variant="colorBase300"
              onPress={() => reset()}
            >
              <CustomText>
                <MaterialIcons name="stop" size={24} />
              </CustomText>
            </CustomPressable>
          </View>
        </View>
      </CustomView>
    );
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        gap: 12,
        flex: 1,
        backgroundColor: currentScheme.colorBase200,
        borderTopEndRadius: 16,
        borderBottomEndRadius: 16,
      }}
      style={{
        borderTopEndRadius: 16,
        borderBottomEndRadius: 16,
      }}
    >
      <CustomPressable
        variant="colorBase100"
        className="flex flex-row gap-4 items-center rounded-3xl"
        style={{
          paddingVertical: 16,
        }}
        onPress={() => props.navigation.navigate("(profile)")}
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

      <View className="gap-4">
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
      </View>

      <View className="flex-1" />
      <View className="flex-1" />
      <View className="flex-1" />
      <PomodoroComponent />
      <View className="flex-1 flex flex-row gap-2 items-center self-end">
        <CustomPressable
          onPress={() => {
            openPomodoro("PomodoroTray", {
              close: closePomodoro,
              openSettings: () => {
                closePomodoro();
                openPomodoro("PomodoroSettingsTray", { back: closePomodoro });
              },
            });
            props.navigation.dispatch(DrawerActions.closeDrawer());
          }}
          className="flex-1 rounded-full"
          variant="colorBase100"
        >
          <CustomText>
            <MaterialIcons name="timer" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex-1 rounded-full"
          variant="colorBase100"
          onPress={() => props.navigation.navigate("(settings)")}
        >
          <CustomText>
            <MaterialIcons name="settings" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 rounded-full items-center"
          variant="colorBase100"
          onPress={() => {
            handleLogout();
            props.navigation.replace("index");
          }}
        >
          <CustomText>
            <MaterialIcons name="logout" size={20} />
          </CustomText>
          <CustomText>Logout</CustomText>
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
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: "slide",
      }}
      initialRouteName="(forum)"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(flashcard)" />
      <Drawer.Screen name="(forum)" />
      <Drawer.Screen name="(note)" />
      <Drawer.Screen name="(quiz)" />
      <Drawer.Screen name="(settings)" />
      <Drawer.Screen name="(profile)" />
    </Drawer>
  );
}
