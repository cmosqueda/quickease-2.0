import React from "react";
import clsx from "clsx";
import useTheme from "@/hooks/useTheme";

import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

export const bgVariants = [
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

interface CustomPressableProps extends PressableProps {
  variant?: (typeof bgVariants)[number];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const CustomPressable: React.FC<CustomPressableProps> = ({
  variant = "colorPrimary",
  style,
  children,
  className,
  ...rest
}) => {
  const { currentScheme } = useTheme();

  return (
    <Pressable
      style={[
        {
          backgroundColor: currentScheme[variant] ?? "#ccc",
          paddingVertical: 8,
          paddingHorizontal: 24,
        },
        style,
      ]}
      className={clsx("active:opacity-50", className)}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

export default CustomPressable;
