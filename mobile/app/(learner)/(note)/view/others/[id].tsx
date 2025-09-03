import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Note } from "@/types/user/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Pressable } from "react-native";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { router, useLocalSearchParams } from "expo-router";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
    editable: false,
    initialContent: content,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["view-note", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get<Note>(`/notes/${id}`);

        if (data) {
          setTitle(data.title);
          setContent(data.notes_content);
        }

        return data;
      } catch (err) {
        throw err;
      }
    },
    retry: 3,
    enabled: !!id,
  });

  if (isFetching) {
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
              router.replace("/(learner)/(note)");
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
          multiline
        />
        <RichText editor={editor} />
      </SafeAreaView>
    );
  }
}
