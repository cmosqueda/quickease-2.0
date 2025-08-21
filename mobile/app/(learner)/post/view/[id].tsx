import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable, ScrollView, View } from "react-native";

export default function Page() {
  const navigation = useNavigation();
  const { currentScheme } = useTheme();

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  return (
    <SafeAreaView
      className="flex-1 p-4 gap-4"
      style={{
        position: "relative",
        backgroundColor: currentScheme.colorBase200,
      }}
    >
      <View className="flex flex-row gap-4 items-center">
        <Pressable
          onPress={() => {
            setIndex(0);
            navigation.goBack();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View className="flex flex-row gap-2 self-center flex-1">
          <CustomPressable
            variant={index == 0 ? "colorPrimary" : "colorBase100"}
            className="rounded-3xl flex-1 items-center"
            onPress={() => {
              setIndex(0);
              pagerViewRef.current?.setPage(0);
            }}
          >
            <CustomText
              color={index == 0 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Post
            </CustomText>
          </CustomPressable>
          <CustomPressable
            variant={index == 1 ? "colorPrimary" : "colorBase100"}
            className="rounded-3xl flex-1 items-center"
            onPress={() => {
              setIndex(1);
              pagerViewRef.current?.setPage(1);
            }}
          >
            <CustomText
              color={index == 1 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Answers
            </CustomText>
          </CustomPressable>
        </View>
      </View>
      <PagerView
        style={{ flex: 1, gap: 8 }}
        ref={pagerViewRef}
        initialPage={0}
        scrollEnabled={false}
      >
        <View className="flex-1 gap-4" key={0}>
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

          <View className="gap-2">
            <CustomText variant="bold" className="text-4xl">
              Lorem Ipsum. (Title)
            </CustomText>
            <CustomView variant="colorBase100" className="p-4 rounded-xl">
              <CustomText>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </CustomText>
            </CustomView>
          </View>

          <View className="flex flex-row gap-2">
            <CustomView
              variant="colorBase100"
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
            <CustomPressable className="rounded-3xl" variant="colorBase100">
              <CustomText>
                <MaterialIcons name="comment" size={20} />
              </CustomText>
            </CustomPressable>
            <CustomPressable className="rounded-3xl" variant="colorBase100">
              <CustomText>
                <MaterialIcons name="menu" size={20} />
              </CustomText>
            </CustomPressable>
          </View>
        </View>
        <View className="flex-1" key={1}>
          <View className="gap-4">
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
            <CustomView
              className="gap-4 p-4 rounded-3xl"
              variant="colorBase100"
            >
              <CustomView variant="colorBase100">
                <CustomText>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </CustomText>
              </CustomView>
            </CustomView>
            <View className="flex flex-row gap-2">
              <CustomView
                variant="colorBase100"
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
              <CustomPressable className="rounded-3xl" variant="colorBase100">
                <CustomText>
                  <MaterialIcons name="comment" size={20} />
                </CustomText>
              </CustomPressable>
              <CustomPressable className="rounded-3xl" variant="colorBase100">
                <CustomText>
                  <MaterialIcons name="menu" size={20} />
                </CustomText>
              </CustomPressable>
            </View>
          </View>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
