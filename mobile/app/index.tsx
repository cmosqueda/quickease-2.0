import clsx from "clsx";
import useTheme from "@/hooks/useTheme";
import LottieView from "lottie-react-native";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Link } from "expo-router";
import { Image } from "expo-image";
import { useRef } from "react";
import { useAssets } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import _BADGES_ANIMATION from "../assets/animations/badges.json";
import _FORUM_ANIMATION from "../assets/animations/forums-community.json";
import _THEME_ANIMATION from "../assets/animations/multi-themes.json";
import _GENERATION_ANIMATION from "../assets/animations/generate-study-materials.json";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { currentScheme } = useTheme();
  const [assets] = useAssets([require("../assets/images/mascot.png")]);
  const carouselRef = useRef<ICarouselInstance>(null);

  const data: {
    smallHeading?: string;
    title: string;
    description: string;
    image?: boolean;
    animationIndex?: number;
  }[] = [
    {
      smallHeading: "SUPERCHARGE YOUR LEARNING.",
      title: "Get started",
      description:
        "Effortlessly create flashcards and quizzes from your notes, textbooks, or any text—anytime, anywhere. Whether you're cramming for exams or just reviewing, QuickEase makes studying fast, focused, and easy.",
      image: true,
    },
    {
      smallHeading: "Achievement!",
      title: "Fuel your study with badges!",
      description:
        "QuickEase makes learning exciting—earn badges for your achievements and show them off in your profile!",
      animationIndex: 0,
    },
    {
      smallHeading: "Personalized!",
      title: "Make it yours with more themes!",
      description:
        "Personalize your study space with a variety of themes. Learn your way, at your own pace!",
      animationIndex: 1,
    },
    {
      smallHeading: "Supercharge!",
      title: "Generate, learn, and go!",
      description:
        "Skip the busywork—create flashcards, quizzes, or notes in seconds and dive straight into learning!",
      animationIndex: 2,
    },
    {
      smallHeading: "Ask!",
      title: "Curious? Confused? Have something to share?",
      description:
        "Head to the community forums—get answers, spark ideas, and collaborate anytime, anywhere!",
      animationIndex: 3,
    },
  ];

  const animations = [
    _BADGES_ANIMATION,
    _THEME_ANIMATION,
    _GENERATION_ANIMATION,
    _FORUM_ANIMATION,
  ];

  if (!assets) return null;

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <Carousel
        ref={carouselRef}
        loop={false}
        height={height / 1.1}
        width={width}
        snapEnabled
        pagingEnabled
        data={data}
        style={{ width }}
        renderItem={({ item }) => (
          <View className="flex-1 gap-8 p-8">
            {item.image && (
              <Image
                source={assets[0].localUri}
                className="object-contain"
                style={{ height: height / 2 }}
              />
            )}
            {typeof item.animationIndex === "number" && (
              <LottieView
                source={animations[item.animationIndex]}
                autoPlay
                loop
                style={{ height: height / 2 }}
              />
            )}

            <CustomView className="self-end gap-2">
              {item.smallHeading && (
                <CustomText
                  variant="regular"
                  className="text-xs tracking-widest opacity-40"
                >
                  {item.smallHeading}
                </CustomText>
              )}

              <CustomText className="text-5xl" variant="bold">
                {item.title}
              </CustomText>
              <CustomText className="opacity-65">{item.description}</CustomText>
            </CustomView>

            <CustomView className="flex flex-1" />
          </View>
        )}
      />

      <View className="flex flex-row items-center justify-between p-4">
        <View className="flex flex-row gap-2 items-center">
          <Link asChild href={"/(auth)/login"}>
            <CustomPressable
              variant="colorBase300"
              className={clsx(
                "rounded-3xl",
                carouselRef.current?.getCurrentIndex() == 3 ? "flex-1" : ""
              )}
            >
              <CustomText>Login</CustomText>
            </CustomPressable>
          </Link>
          <Link asChild href={"/(auth)/register"}>
            <CustomPressable
              className={clsx(
                "rounded-3xl",
                carouselRef.current?.getCurrentIndex() == 3 ? "flex-1" : ""
              )}
            >
              <CustomText color="colorPrimaryContent">Register</CustomText>
            </CustomPressable>
          </Link>
        </View>
        {carouselRef.current?.getCurrentIndex() !== 4 && (
          <CustomPressable
            variant="colorBase200"
            className="rounded-3xl"
            onPress={() => carouselRef.current?.next()}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-right" size={18} />
            </CustomText>
          </CustomPressable>
        )}
      </View>
    </SafeAreaView>
  );
}
