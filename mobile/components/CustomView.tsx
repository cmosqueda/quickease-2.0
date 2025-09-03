import React from "react";
import useTheme from "@/hooks/useTheme";
import Animated from "react-native-reanimated";

import { ViewProps, ViewStyle } from "react-native";

const bgVariants = [
  "colorBase100",
  "colorBase200",
  "colorBase300",
  "colorPrimary",
  "colorSecondary",
  "colorAccent",
  "colorNeutral",
  "colorInfo",
  "colorSuccess",
  "colorWarning",
  "colorError",
] as const;

interface CustomViewProps extends ViewProps {
  variant?: (typeof bgVariants)[number];
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

const CustomView: React.FC<CustomViewProps> = ({
  variant = "colorBase100",
  style,
  children,
  ...rest
}) => {
  const { currentScheme } = useTheme();

  return (
    <Animated.View
      style={[
        {
          backgroundColor: variant && currentScheme![variant],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
};

export default CustomView;
