import useTheme from "@/hooks/useTheme";
import _FONTS from "@/types/theme/Font";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useTrays } from "react-native-trays";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Pressable, View } from "react-native";
import { router } from "expo-router";

export default function Page() {
  const tagsTray = useTrays<MyTraysProps>("DismissibleStickToTopTray");
  const { currentScheme } = useTheme();

  const [tags, setTags] = useState([]);

  return (
    <SafeAreaView
      className="flex flex-1 p-4 gap-2"
      edges={["left", "right", "top"]}
      style={{ backgroundColor: currentScheme.colorBase100 }}
    >
      <View className="flex flex-row gap-2 items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <CustomPressable className="rounded-3xl" variant="colorBase300">
          <CustomText>
            <MaterialCommunityIcons name="send" size={20} />
          </CustomText>
        </CustomPressable>
      </View>
      <CustomTextInput
        style={{
          backgroundColor: "",
          paddingHorizontal: 0,
          fontFamily: _FONTS.Gabarito_900Black,
        }}
        className="text-4xl"
        placeholder="Title"
      />
      <View className="flex flex-row">
        <CustomPressable
          variant="colorBase300"
          className="rounded-3xl"
          onPress={() =>
            tagsTray.push("TagsTray", {
              tags: tags,
              setTags: setTags,
              close: tagsTray.pop,
            })
          }
        >
          <CustomText>Add tags</CustomText>
        </CustomPressable>
      </View>
      <CustomTextInput
        style={{
          backgroundColor: "",
          paddingHorizontal: 0,
          fontFamily: _FONTS.Gabarito_400Regular,
        }}
        placeholder="Questions?"
      />
      <View className="flex-1" />
      <CustomView className="rounded-3xl flex flex-row gap-4 items-center">
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="copy1" size={24} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="unknowfile1" size={24} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="profile" size={24} />
          </CustomText>
        </CustomPressable>
      </CustomView>
    </SafeAreaView>
  );
}
