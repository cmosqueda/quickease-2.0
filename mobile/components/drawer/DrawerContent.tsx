import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { View } from "react-native";
import { toast } from "sonner-native";
import { useTrays } from "react-native-trays";
import { useEffect } from "react";
import { MyTraysProps } from "@/types/trays/trays";
import { DrawerActions } from "@react-navigation/native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import _API_INSTANCE from "@/utils/axios";
import PomodoroComponent from "./PomodoroTimer";
import useSettings from "@/hooks/useSettings";
import UserAvatar from "../UserAvatar";

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

export default function CustomDrawerContent(props: any) {
  const { pomodoroInDrawerVisibility } = useSettings();
  const { user } = useAuth();
  const { currentScheme } = useTheme();
  const { push: openPomodoro, pop: closePomodoro } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { reset, tick } = useTimer();

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const handleLogout = async () => {
    try {
      useAuth.setState((state) => {
        state.user = undefined;
      });
      reset();
      await _API_INSTANCE.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      toast(err.message || "Error logging out.");
    }
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
        <UserAvatar size={32} />
        <CustomText variant="bold" className="text-xl" color="colorBaseContent">
          {user?.first_name} {user?.last_name}
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
      {!pomodoroInDrawerVisibility && (
        <>
          <View className="flex-1" />
          <View className="flex-1" />
        </>
      )}
      {pomodoroInDrawerVisibility && <PomodoroComponent />}
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
