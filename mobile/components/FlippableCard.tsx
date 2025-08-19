import clsx from "clsx";
import useTheme from "@/hooks/useTheme";
import CustomText from "./CustomText";

import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

export default function FlippableCard({
  front,
  back,
}: {
  front: string;
  back: string;
}) {
  const { currentScheme } = useTheme();

  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  return (
    <Pressable
      onPress={flipCard}
      className="w-full h-48 items-center justify-center"
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
        <CustomText className={clsx("text-2xl")} variant="regular">
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
        <CustomText className={clsx("text-2xl")} variant="black">
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
  },
  cardBack: {
    position: "absolute",
    top: 0,
  },
});
