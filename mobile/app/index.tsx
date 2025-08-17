import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";
import Entypo from "@expo/vector-icons/Entypo";

import { useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import CustomView from "@/components/CustomView";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { currentScheme } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    <>
      <Image
        source={require("../assets/images/mascot.png")}
        className="object-contain"
        style={{
          height: height / 2,
        }}
      />
      <CustomView className="self-end">
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
      </CustomView>
      <CustomView className="flex flex-1" />
    </>,
    <>
      <CustomView className="flex flex-1" />
    </>,
    <>
      <CustomView className="flex flex-1" />
    </>,
    <>
      <CustomView className="flex flex-1" />
    </>,
  ];

  return (
    <SafeAreaView
      className="flex flex-1 px-6 py-4 gap-6"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      {tabs[tabIndex]}
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row gap-2">
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor:
                tabIndex === 0
                  ? currentScheme!.colorPrimary
                  : currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor:
                tabIndex === 1
                  ? currentScheme!.colorPrimary
                  : currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor:
                tabIndex === 2
                  ? currentScheme!.colorPrimary
                  : currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
          <View
            className="w-[12px] h-[12px]"
            style={{
              backgroundColor:
                tabIndex === 3
                  ? currentScheme!.colorPrimary
                  : currentScheme!.colorBase300,
              borderRadius: 999,
            }}
          />
        </View>
        {tabIndex != 3 && (
          <CustomPressable
            variant="colorPrimary"
            className="rounded-3xl"
            onPress={() => {
              setTabIndex((prev) => ++prev);
            }}
          >
            <CustomText color="colorPrimaryContent">
              <Entypo name="chevron-right" />
            </CustomText>
          </CustomPressable>
        )}
        {tabIndex == 3 && (
          <View className="flex flex-row gap-2">
            <CustomPressable
              variant="colorBase300"
              className="rounded-3xl"
              onPress={() => {
                router.replace("/(auth)/register");
              }}
            >
              <CustomText color="colorBaseContent">Register</CustomText>
            </CustomPressable>
            <CustomPressable
              variant="colorPrimary"
              className="rounded-3xl"
              onPress={() => {
                router.replace("/(auth)/login");
              }}
            >
              <CustomText color="colorPrimaryContent">Login</CustomText>
            </CustomPressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
