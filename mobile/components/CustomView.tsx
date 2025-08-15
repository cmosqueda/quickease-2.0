import useTheme from "@/hooks/useTheme";
import React from "react";

import { View, ViewProps, ViewStyle } from "react-native";

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
    <View
      style={[
        {
          backgroundColor: variant && currentScheme![variant],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default CustomView;
