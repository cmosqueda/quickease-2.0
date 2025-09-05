import clsx from "clsx";
import useTheme from "@/hooks/useTheme";
import CustomText from "./CustomText";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

export default function FlippableCard({
  flipped,
  setFlipped,
  front,
  back,
  height = "h-48",
  classNames,
}: {
  flipped: boolean;
  setFlipped: Dispatch<SetStateAction<boolean>>;
  front: string;
  back: string;
  height?: string;
  classNames?: string;
}) {
  const { currentScheme } = useTheme();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => setFlipped(!flipped);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: flipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, flipped]);

  return (
    <Pressable
      onPress={flipCard}
      className={clsx("w-full items-center justify-center", height, classNames)}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: currentScheme.colorPrimary,
            transform: [{ rotateY: frontInterpolate }],
          },
        ]}
      >
        <CustomText
          className={clsx("text-2xl self-center text-center")}
          variant="regular"
          color="colorPrimaryContent"
        >
          {front}
        </CustomText>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          {
            backgroundColor: currentScheme.colorSecondary,
            transform: [{ rotateY: backInterpolate }],
          },
        ]}
      >
        <CustomText
          className={clsx("text-2xl self-center text-center")}
          variant="black"
          color="colorSecondaryContent"
        >
          {back}
        </CustomText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    textAlign: "center",
  },
  cardBack: {
    position: "absolute",
    top: 0,
  },
});
