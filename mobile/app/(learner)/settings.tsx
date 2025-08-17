import CustomModal from "@/components/CustomModal";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import useTheme from "@/hooks/useTheme";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useState } from "react";
import { Switch, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountSettings = () => {
  return (
    <View className="gap-2">
      <CustomText variant="bold" className="text-sm">
        Account
      </CustomText>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="edit" size={20} />
          </CustomText>
          <CustomText>Change your name</CustomText>
        </View>
      </CustomView>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="email" size={20} />
          </CustomText>
          <CustomText>Change your email</CustomText>
        </View>
      </CustomView>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="password" size={20} />
          </CustomText>
          <CustomText>Request to change password</CustomText>
        </View>
      </CustomView>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="check-circle" size={20} />
          </CustomText>
          <CustomText>Verify email</CustomText>
        </View>
      </CustomView>
    </View>
  );
};

const PrivacySettings = () => {
  return (
    <View className="gap-2">
      <CustomText variant="bold" className="text-sm">
        Privacy
      </CustomText>

      <CustomView className="px-6 py-2 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="visibility" size={20} />
          </CustomText>
          <CustomText>Set your profile visibility</CustomText>
        </View>
        <Switch />
      </CustomView>
    </View>
  );
};

const ThemeSettings = () => {
  return (
    <View className="gap-2">
      <CustomText variant="bold" className="text-sm">
        Customizations
      </CustomText>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <CustomText>
            <MaterialIcons name="format-paint" size={20} />
          </CustomText>
          <CustomText>Set theme</CustomText>
        </View>
      </CustomView>
    </View>
  );
};

export default function Page() {
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader title="Settings" />
      <CustomView
        variant="colorBase300"
        className="flex-col gap-6 flex-1 px-4 py-4"
      >
        <AccountSettings />
        <PrivacySettings />
        <ThemeSettings />
      </CustomView>
    </SafeAreaView>
  );
}
