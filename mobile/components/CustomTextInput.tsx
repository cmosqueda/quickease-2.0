import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import useTheme from "@/hooks/useTheme";

// Define a prop type that extends the default TextInputProps
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
      {...rest}
    />
  );
}
