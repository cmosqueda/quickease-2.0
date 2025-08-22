import clsx from "clsx";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import FlippableCard from "@/components/FlippableCard";
import useTheme from "@/hooks/useTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { router } from "expo-router";
import { useState } from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { currentScheme } = useTheme();

  const [flashcards, setFlashcards] = useState([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    <>
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
      <CustomView variant="colorBase100" className="p-4 rounded-3xl">
        <CustomText variant="black" className="text-5xl">
          Title
        </CustomText>
      </CustomView>

      <CustomView variant="colorBase100" className="p-4 rounded-3xl">
        <CustomText>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </CustomText>
      </CustomView>

      <View className="flex-1" />
      <CustomPressable
        variant="colorBase300"
        className="rounded-3xl items-center"
        onPress={() => {
          setTabIndex(1);
        }}
      >
        <CustomText>View flashcards</CustomText>
      </CustomPressable>
    </>,
    <>
      <View className="flex-1" />
      <View className="relative">
        <CustomText
          className="absolute top-6 z-10 left-6"
          color="colorSecondaryContent"
          variant="bold"
        >
          {flashcardIndex + 1}
        </CustomText>
        <FlippableCard back="Test back" front="Test front" height="h-[70vh]" />
      </View>
      <View className="flex-1" />
      <View className="flex flex-row gap-2 ">
        <CustomPressable
          className="rounded-3xl flex-1 items-center"
          onPress={() => {
            if (flashcardIndex != 0) {
              setFlashcardIndex((prev) => prev - 1);
            }
          }}
        >
          <CustomText color="colorSecondaryContent">
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="rounded-3xl flex-1 items-center"
          onPress={() => {
            setFlashcardIndex((prev) => prev + 1);
          }}
        >
          <CustomText color="colorSecondaryContent">
            <MaterialCommunityIcons name="arrow-right" size={24} />
          </CustomText>
        </CustomPressable>
      </View>
    </>,
  ];

  return (
    <SafeAreaView
      style={{ backgroundColor: currentScheme.colorBase200, flex: 1 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row gap-4 justify-between items-center relative">
        <Pressable
          className={clsx(tabIndex ? "absolute top-0" : "")}
          onPress={() => {
            if (tabIndex == 1) {
              setTabIndex(0);
              return;
            }

            router.back();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(learner)/(flashcard)/edit/[id]",
              params: { id: "test" },
            })
          }
        >
          <CustomText>
            <MaterialCommunityIcons name="note-edit" size={24} />
          </CustomText>
        </Pressable>
      </View>
      {tabs[tabIndex]}
    </SafeAreaView>
  );
}
