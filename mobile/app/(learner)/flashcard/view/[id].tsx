import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import useTheme from "@/hooks/useTheme";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, Pressable, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const navigation = useNavigation();
  const { currentScheme } = useTheme();

  const [index, setIndex] = useState(0);
  const tabs = [];

  return (
    <SafeAreaView
      style={{ backgroundColor: currentScheme.colorBase200, flex: 1 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row gap-4 items-center">
        <Pressable onPress={() => navigation.dispatch(CommonActions.goBack())}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
      </View>
      <View className="gap-2">
        <View className="flex flex-row gap-4 items-center">
          <View className="w-[2.5rem] aspect-square rounded-3xl bg-red-600" />
          <CustomView variant="colorBase200">
            <CustomText variant="bold">Jhon Lloyd Viernes</CustomText>
            <CustomText className="text-sm opacity-40">
              August 15, 2025
            </CustomText>
          </CustomView>
        </View>
      </View>
      <CustomText variant="black" className="text-5xl">
        Title
      </CustomText>
      <CustomText>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </CustomText>
      <View className="flex-1" />
      <CustomPressable
        variant="colorBase300"
        className="rounded-3xl items-center"
        onPress={() => {
          setIndex(1);
        }}
      >
        <CustomText>View flashcards</CustomText>
      </CustomPressable>
    </SafeAreaView>
  );
}
