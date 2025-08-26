import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { View, Pressable, KeyboardAvoidingView } from "react-native";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";
import _GENERATION_ANIMATION from "../../../assets/animations/generate-study-materials.json";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

export default function Page() {
  const { currentScheme } = useTheme();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const editor = useEditorBridge({
    theme: {
      webview: {
        padding: 8,
        backgroundColor: currentScheme.colorBase100,
      },
    },
    bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
    dynamicHeight: true,
    editable: true,
    initialContent: content,
  });

  if (!editor) {
    return (
      <SafeAreaView
        style={{ backgroundColor: currentScheme.colorBase100 }}
        className="flex flex-1 p-4"
      ></SafeAreaView>
    );
  }

  if (editor) {
    return (
      <SafeAreaView
        style={{ backgroundColor: currentScheme.colorBase100 }}
        className="flex flex-1 p-4"
      >
        <View className="flex flex-row gap-4 justify-between items-center relative">
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
        </View>
        <CustomTextInput
          style={{
            paddingHorizontal: 0,
            fontFamily: _FONTS.Gabarito_900Black,
            backgroundColor: null as any,
          }}
          className="text-4xl"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <KeyboardAvoidingView className="flex-1" behavior="height">
          <RichText editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
