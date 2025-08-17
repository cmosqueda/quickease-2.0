import CustomModal from "@/components/CustomModal";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import useTheme from "@/hooks/useTheme";
import _THEMES from "@/types/theme/Themes";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useState } from "react";
import { Pressable, Switch, useWindowDimensions, View } from "react-native";
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
  const { setCurrentScheme } = useTheme();
  const { height } = useWindowDimensions();
  const [modalVisibility, setModalVisibility] = useState(false);

  return (
    <>
      <View className="gap-2">
        <CustomText variant="bold" className="text-sm">
          Customizations
        </CustomText>

        <Pressable onPress={() => setModalVisibility(true)}>
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
      <CustomModal
        modalVisibility={modalVisibility}
        setModalVisibility={setModalVisibility}
      >
        <CustomView
          variant="colorBase100"
          style={{ height: height / 1.1, gap: 24 }}
          className="rounded-tr-3xl rounded-tl-3xl p-8"
        >
          <CustomText>
            <MaterialIcons
              name="close"
              size={24}
              onPress={() => setModalVisibility(false)}
            />
          </CustomText>

          <View className="gap-4">
            <CustomText>Light</CustomText>
            <CustomView
              variant="colorBase200"
              className="flex flex-row gap-4 flex-wrap p-4 rounded-3xl justify-center"
            >
              {Object.values(_THEMES)
                .filter((theme) => theme.colorscheme === "light")
                .map((theme) => (
                  <Pressable
                    onPress={() => setCurrentScheme(theme.name)}
                    key={theme.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase100 }}
                      />
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase200 }}
                      />
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorPrimary }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: theme.colorSecondary,
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
            </CustomView>
          </View>

          <View className="gap-4">
            <CustomText>Dark</CustomText>
            <CustomView
              variant="colorBase200"
              className="flex flex-row gap-4 flex-wrap p-4 rounded-3xl justify-center"
            >
              {Object.values(_THEMES)
                .filter((theme) => theme.colorscheme === "dark")
                .map((theme) => (
                  <Pressable
                    onPress={() => setCurrentScheme(theme.name)}
                    key={theme.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase100 }}
                      />
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase200 }}
                      />
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorPrimary }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: theme.colorSecondary,
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
            </CustomView>
          </View>
        </CustomView>
      </CustomModal>
    </>
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
