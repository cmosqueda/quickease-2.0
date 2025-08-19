import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import useTheme from "@/hooks/useTheme";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { currentScheme } = useTheme();

  const [index, setIndex] = useState(0);

  const tabs = [
    <>
      <View className="gap-2">
        <View className="flex flex-row gap-4 items-center">
          <View className="w-[2.5rem] aspect-square rounded-3xl bg-red-600" />
          <CustomView>
            <CustomText variant="bold">Jhon Lloyd Viernes</CustomText>
            <CustomText className="text-sm opacity-40">
              August 15, 2025
            </CustomText>
          </CustomView>
        </View>
      </View>

      <View className="gap-2">
        <CustomText variant="bold" className="text-4xl">
          Lorem Ipsum. (Title)
        </CustomText>
        <CustomView variant="colorBase200" className="p-4 rounded-xl">
          <CustomText>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </CustomText>
        </CustomView>
      </View>

      <View className="flex flex-row gap-2">
        <CustomView
          variant="colorBase200"
          className="flex flex-row gap-4 items-center px-6 py-2 rounded-3xl"
        >
          <CustomText>
            <MaterialIcons name="arrow-upward" size={24} />
          </CustomText>
          <CustomText variant="black">0</CustomText>
          <CustomText>
            <MaterialIcons name="arrow-downward" size={24} />
          </CustomText>
        </CustomView>
        <CustomPressable className="rounded-3xl" variant="colorBase200">
          <CustomText>
            <MaterialIcons name="comment" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable className="rounded-3xl" variant="colorBase200">
          <CustomText>
            <MaterialIcons name="menu" size={20} />
          </CustomText>
        </CustomPressable>
      </View>
    </>,
    <>
      <View
        className="h-1 border-b opacity-20"
        style={{ borderColor: currentScheme.colorPrimary }}
      />
      <View className="gap-4">
        <View className="gap-2">
          <View className="flex flex-row gap-4 items-center">
            <View className="w-[2.5rem] aspect-square rounded-3xl bg-red-600" />
            <CustomView>
              <CustomText variant="bold">Jhon Lloyd Viernes</CustomText>
              <CustomText className="text-sm opacity-40">
                August 15, 2025
              </CustomText>
            </CustomView>
          </View>
        </View>
        <CustomView className="gap-4 p-4 rounded-3xl" variant="colorBase200">
          <CustomView variant="colorBase200">
            <CustomText>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </CustomText>
          </CustomView>
        </CustomView>
        <View className="flex flex-row gap-2">
          <CustomView
            variant="colorBase200"
            className="flex flex-row gap-4 items-center px-6 py-2 rounded-3xl"
          >
            <CustomText>
              <MaterialIcons name="arrow-upward" size={24} />
            </CustomText>
            <CustomText variant="black">0</CustomText>
            <CustomText>
              <MaterialIcons name="arrow-downward" size={24} />
            </CustomText>
          </CustomView>
          <CustomPressable className="rounded-3xl" variant="colorBase200">
            <CustomText>
              <MaterialIcons name="comment" size={20} />
            </CustomText>
          </CustomPressable>
          <CustomPressable className="rounded-3xl" variant="colorBase200">
            <CustomText>
              <MaterialIcons name="menu" size={20} />
            </CustomText>
          </CustomPressable>
        </View>
      </View>
    </>,
  ]; // 1 - Post | 2 - Answers

  return (
    <ScrollView
      contentContainerClassName="gap-4 px-4"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
      }}
      style={{
        position: "relative",
        backgroundColor: currentScheme.colorBase100,
      }}
    >
      <View className="flex flex-row gap-4 items-center">
        <Pressable onPress={() => navigation.dispatch(CommonActions.goBack())}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View className="flex flex-row gap-2 self-center">
          <CustomPressable
            variant="colorBase200"
            className="rounded-3xl"
            onPress={() => setIndex(0)}
          >
            <CustomText>Post</CustomText>
          </CustomPressable>
          <CustomPressable
            variant="colorBase200"
            className="rounded-3xl"
            onPress={() => setIndex(1)}
          >
            <CustomText>Answers</CustomText>
          </CustomPressable>
        </View>
      </View>
      {tabs[index]}
    </ScrollView>
  );
}
