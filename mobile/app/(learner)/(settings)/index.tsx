import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Switch } from "@expo/ui/jetpack-compose";
import { useTrays } from "react-native-trays";
import { useState } from "react";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

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
          <CustomText>Request to change your email</CustomText>
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
          <View>
            <CustomText>Verify email</CustomText>
          </View>
        </View>
      </CustomView>
    </View>
  );
};

const PrivacySettings = () => {
  const { currentScheme } = useTheme();
  const [isPublic, setIsPublic] = useState(false);

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
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          variant="switch"
          color={currentScheme.colorPrimary}
        />
      </CustomView>
    </View>
  );
};

const ThemeSettings = () => {
  const { push: openThemeTray, pop: closeThemeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  return (
    <>
      <View className="gap-2">
        <CustomText variant="bold" className="text-sm">
          Customizations
        </CustomText>

        <Pressable
          onPress={() =>
            openThemeTray("ChangeThemesTray", { close: closeThemeTray })
          }
        >
          <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-4">
              <CustomText>
                <MaterialIcons name="format-paint" size={20} />
              </CustomText>
              <CustomText>Set theme</CustomText>
            </View>
          </CustomView>
        </Pressable>
      </View>
    </>
  );
};

export default function Page() {
  const { currentScheme } = useTheme();

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
