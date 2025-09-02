import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";

import _THEMES from "@/types/theme/Themes";

const ChangeThemesTray = ({ close }: { close: () => void }) => {
  const { setCurrentScheme } = useTheme();

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-8 gap-8"
    >
      <CustomText>
        <MaterialIcons name="close" size={24} onPress={close} />
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
  );
};

export default ChangeThemesTray;
