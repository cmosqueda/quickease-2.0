import useTheme from "@/hooks/useTheme";

import React, { useState, useRef, ReactNode } from "react";
import { View, Pressable, Animated, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomText from "../CustomText";

export default function FloatingButton({
  option_one,
  option_two,
  main_func,
}: {
  option_one: ReactNode;
  option_two: ReactNode;
  main_func: () => void;
}) {
  const { currentScheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    setExpanded((prev) => !prev);

    Animated.spring(animation, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const option1Style = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
    ],
    opacity: animation,
  };

  const option2Style = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
    ],
    opacity: animation,
  };

  return (
    <View className="absolute bottom-8 right-8 items-center">
      <Animated.View style={[styles.secondary, option1Style]}>
        {option_one}
      </Animated.View>

      <Animated.View style={[styles.secondary, option2Style]}>
        {option_two}
      </Animated.View>

      <Pressable
        style={{ backgroundColor: currentScheme.colorSecondary }}
        className="p-4 rounded-full"
        onLongPress={toggleMenu}
        onPress={toggleMenu}
      >
        <CustomText color="colorSecondaryContent">
          <MaterialIcons name={expanded ? "close" : "add"} size={28} />
        </CustomText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  main: {
    backgroundColor: "#3700b3",
  },
  secondary: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
