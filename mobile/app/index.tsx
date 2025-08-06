import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import { useWindowDimensions, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { currentScheme } = useTheme();

  return (
    <SafeAreaView
      className="flex flex-1 px-6 py-4 gap-2"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <Image
        source={require("../assets/images/mascot.png")}
        className="object-contain"
        style={{
          height: height / 2,
        }}
      />
      <View className="self-end">
        <CustomText
          variant="regular"
          className="text-xs tracking-widest opacity-40"
        >
          SUPERCHARGE YOUR LEARNING.
        </CustomText>
        <CustomText className="text-5xl" variant="bold">
          Get started
        </CustomText>
        <CustomText className="opacity-65">
          Effortlessly create flashcards and quizzes from your notes, textbooks,
          or any text—anytime, anywhere. Whether you&apos;re cramming for exams
          or just reviewing, QuickEase makes studying fast, focused, and easy.
        </CustomText>
      </View>
      <View className="flex flex-1" />
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row gap-2">
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor: currentScheme!.colorPrimary,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor: currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor: currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor: currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
        </View>
        <CustomPressable variant="colorPrimary" className="rounded-3xl">
          <CustomText color="colorPrimaryContent">Next</CustomText>
        </CustomPressable>
      </View>
    </SafeAreaView>
  );
}
