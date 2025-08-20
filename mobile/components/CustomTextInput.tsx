import React from "react";
import useTheme from "@/hooks/useTheme";

import { TextInput, TextInputProps } from "react-native";

type CustomTextInputProps = TextInputProps;

export default function CustomTextInput(props: CustomTextInputProps) {
  const { currentScheme } = useTheme();

  const {
    style,
    cursorColor = currentScheme.colorPrimary,
    selectionColor = currentScheme.colorPrimary,
    ...rest
  } = props;

  return (
    <TextInput
      style={[
        {
          backgroundColor: currentScheme?.colorBase200,
          color: currentScheme?.colorBaseContent,
          paddingHorizontal: 12,
        },
        style,
      ]}
      cursorColor={cursorColor}
      selectionColor={selectionColor}
      placeholderTextColor={currentScheme.colorSecondary}
      {...rest}
    />
  );
}
