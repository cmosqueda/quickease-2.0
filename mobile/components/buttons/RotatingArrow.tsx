import CustomText from "../CustomText";

import { MaterialIcons } from "@expo/vector-icons";

import { Animated, Easing } from "react-native";
import { useRef, useEffect } from "react";

export default function RotatingArrow({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isCollapsed ? 180 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isCollapsed]);

  const spin = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <CustomText>
        <MaterialIcons name="keyboard-arrow-down" size={24} />
      </CustomText>
    </Animated.View>
  );
}
