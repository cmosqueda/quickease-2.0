import clsx from "clsx";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import LottieView from "lottie-react-native";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Image } from "expo-image";
import { useAssets } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { checkAuthAndRedirect } from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import _BADGES_ANIMATION from "../assets/animations/badges.json";
import _FORUM_ANIMATION from "../assets/animations/forums-community.json";
import _THEME_ANIMATION from "../assets/animations/multi-themes.json";
import _GENERATION_ANIMATION from "../assets/animations/generate-study-materials.json";

export default function Index() {
  const pageViewRef = useRef<PagerView>(null);
  const { height, width } = useWindowDimensions();
  const { currentScheme } = useTheme();
  const [assets] = useAssets([require("../assets/images/mascot.png")]);

  const [index, setIndex] = useState(0);

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

  const [isChecking, setIsChecking] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      setIsChecking(true);

      try {
        const loggedIn = await checkAuthAndRedirect();
        if (loggedIn) {
          setLoggedIn(true);
          return router.replace("/(learner)/(forum)");
        }
      } catch (err) {
      } finally {
        setIsChecking(false);
      }
    };

    check();
  }, []);

  if (!assets) return null;

  if (isChecking) {
    return (
      <SafeAreaView
        className="flex flex-1 items-center justify-center"
        style={{
          backgroundColor: currentScheme?.colorBase100,
        }}
      >
        <LottieView
          source={animations[3]}
          autoPlay
          loop
          style={{ height: height / 2.5, width: width }}
        />
      </SafeAreaView>
    );
  }

  if (loggedIn) {
    return (
      <SafeAreaView
        className="flex flex-1 items-center justify-center"
        style={{
          backgroundColor: currentScheme?.colorBase100,
        }}
      >
        <LottieView
          source={animations[1]}
          autoPlay
          loop
          style={{ height: height / 2 }}
        />
      </SafeAreaView>
    );
  }

  if (!loggedIn && !isChecking) {
    return (
      <SafeAreaView
        className="flex flex-1 p-2"
        style={{
          backgroundColor: currentScheme?.colorBase100,
        }}
      >
        <PagerView ref={pageViewRef} style={{ flex: 1 }} initialPage={0}>
          {data.map((item, index) => (
            <View key={index} className="flex-1 gap-8 p-4">
              {item.image && (
                <Image
                  source={assets[0].localUri}
                  className="self-center"
                  style={{ height: height / 1.9, aspectRatio: "auto" }}
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
                <CustomText className="opacity-65">
                  {item.description}
                </CustomText>
              </CustomView>

              <CustomView className="flex flex-1" />
            </View>
          ))}
        </PagerView>

        <View className="flex flex-row items-center justify-between p-4">
          <View className="flex flex-row gap-2 items-center">
            <Link asChild href={"/(auth)/login"}>
              <CustomPressable
                variant="colorBase300"
                className={clsx("rounded-3xl")}
              >
                <CustomText>Login</CustomText>
              </CustomPressable>
            </Link>
            <Link asChild href={"/(auth)/register"}>
              <CustomPressable className={clsx("rounded-3xl")}>
                <CustomText color="colorPrimaryContent">Register</CustomText>
              </CustomPressable>
            </Link>
          </View>
          <CustomPressable
            variant="colorBase200"
            className="rounded-3xl"
            onPress={() => {
              setIndex(0);

              if (index !== 5) {
                setIndex(index + 1);
              } else {
                setIndex(0);
              }

              pageViewRef.current?.setPage(index);
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-right" size={18} />
            </CustomText>
          </CustomPressable>
        </View>
      </SafeAreaView>
    );
  }
}
