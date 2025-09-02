import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { toast } from "sonner-native";
import { Switch } from "@expo/ui/jetpack-compose";
import { useTrays } from "react-native-trays";
import { useState } from "react";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import useSettings from "@/hooks/useSettings";

const AccountSettings = () => {
  const { user } = useAuth();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleStickToTopTray"
  );

  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestVerification = async () => {
    setIsRequesting(true);

    try {
      const { data } = await _API_INSTANCE.post(
        "mail/request-verify-email",
        {},
        {
          timeout: 8 * 60 * 1000,
        }
      );

      toast.success("Mail sent!");
    } catch (err) {
      console.log(err);
      toast.error("Mail failed to send.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRequestChangePassword = async () => {
    setIsRequesting(true);

    try {
      const { data } = await _API_INSTANCE.post(
        "mail/request-change-password",
        {},
        {
          timeout: 8 * 60 * 1000,
        }
      );

      toast.success("Mail sent!");
    } catch (err) {
      toast.error("Mail failed to send.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View className="gap-2">
      <CustomText variant="bold" className="text-sm">
        Account
      </CustomText>

      <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
        <Pressable
          onPress={() =>
            openTray("ChangeNameTray", {
              close: closeTray,
            })
          }
          className="flex flex-row items-center gap-4"
        >
          <CustomText>
            <MaterialIcons name="edit" size={20} />
          </CustomText>
          <CustomText>Change your name</CustomText>
        </Pressable>
      </CustomView>

      <Pressable
        onPress={() => openTray("ChangeEmailTray", { close: closeTray })}
      >
        <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-4">
            <CustomText>
              <MaterialIcons name="email" size={20} />
            </CustomText>
            <CustomText>Change your email</CustomText>
          </View>
        </CustomView>
      </Pressable>

      <Pressable
        onPress={handleRequestChangePassword}
        className="disabled:opacity-50"
        disabled={isRequesting}
      >
        <CustomView className="px-6 py-6 rounded-3xl flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-4">
            <CustomText>
              <MaterialIcons name="password" size={20} />
            </CustomText>
            <CustomText>Request to change password</CustomText>
          </View>
        </CustomView>
      </Pressable>

      {user && !user?.is_verified && (
        <Pressable
          onPress={handleRequestVerification}
          className="disabled:opacity-50"
          disabled={isRequesting}
        >
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
        </Pressable>
      )}
    </View>
  );
};

const PrivacySettings = () => {
  const { user, setUser } = useAuth();
  const { currentScheme } = useTheme();
  const [isPublic, setIsPublic] = useState(user?.is_public);

  const handleProfileVisibility = async (newVisibility: boolean) => {
    setIsPublic(newVisibility);
    try {
      const { data } = await _API_INSTANCE.put("/users/toggle-visibility", {
        visibility: newVisibility,
      });
      setUser(data.user);
      toast.success("Profile privacy updated!");
    } catch (err) {
      setIsPublic((prev) => !prev);
      console.error(err);
      toast.error("Error updating profile privacy.");
    }
  };

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
          value={isPublic!}
          onValueChange={handleProfileVisibility}
          variant="switch"
          color={currentScheme.colorPrimary}
        />
      </CustomView>
    </View>
  );
};

const CustomizationSettings = () => {
  const { currentScheme } = useTheme();
  const { pomodoroInDrawerVisibility, setPomodoroInDrawerVisibility } =
    useSettings();
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
        <CustomView className="px-6 py-2 rounded-3xl flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-4 flex-1">
            <CustomText>
              <MaterialIcons name="timer" size={20} />
            </CustomText>
            <CustomText className="flex-1">
              Enable pomodoro timer in drawer
            </CustomText>
          </View>
          <Switch
            value={pomodoroInDrawerVisibility}
            onValueChange={setPomodoroInDrawerVisibility}
            variant="switch"
            color={currentScheme.colorPrimary}
          />
        </CustomView>
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
        <CustomizationSettings />
      </CustomView>
    </SafeAreaView>
  );
}
