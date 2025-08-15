import useTheme from "@/hooks/useTheme";
import _FONTS from "@/types/theme/Font";

import { Text, TextProps, TextStyle } from "react-native";

const variants = {
  regular: _FONTS.Gabarito_400Regular,
  medium: _FONTS.Gabarito_500Medium,
  semibold: _FONTS.Gabarito_600SemiBold,
  bold: _FONTS.Gabarito_700Bold,
  extrabold: _FONTS.Gabarito_800ExtraBold,
  black: _FONTS.Gabarito_900Black,
} as const;

const colors = [
  "colorBase100",
  "colorBase200",
  "colorBase300",
  "colorBaseContent",

  "colorPrimary",
  "colorPrimaryContent",

  "colorSecondary",
  "colorSecondaryContent",

  "colorAccent",
  "colorAccentContent",

  "colorNeutral",
  "colorNeutralContent",

  "colorInfo",
  "colorInfoContent",

  "colorSuccess",
  "colorSuccessContent",

  "colorWarning",
  "colorWarningContent",

  "colorError",
  "colorErrorContent",
] as const;

type FontVariant = keyof typeof variants;

interface CustomTextProps extends TextProps {
  variant?: FontVariant;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  color?: (typeof colors)[number];
}

const CustomText: React.FC<CustomTextProps> = ({
  variant = "regular",
  children,
  style,
  color = "colorBaseContent",
  ...rest
}) => {
  const { currentScheme } = useTheme();
  const fontFamily = variants[variant];

  return (
    <Text
      style={[
        {
          fontFamily,
          color: currentScheme![color],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default CustomText;
