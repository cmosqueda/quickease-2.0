import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Note } from "@/types/user/types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Pressable } from "react-native";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { buildEditorBridgeExtensions } from "@/types/theme/TenTapThemes";
import { router, useLocalSearchParams } from "expo-router";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const { user } = useAuth();
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
    bridgeExtensions: buildEditorBridgeExtensions(currentScheme),
    dynamicHeight: true,
    editable: false,
    initialContent: content,
  });

  const { data: noteData, isFetching } = useQuery({
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

  useEffect(() => {
    if (noteData && !noteData.is_public && noteData.user_id !== user?.id) {
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }, [noteData, id, user?.id]);

  if (isFetching) {
    return (
      <SafeAreaView
        style={{ backgroundColor: currentScheme.colorBase100 }}
        className="flex flex-1 p-4"
      ></SafeAreaView>
    );
  }

  if (!noteData) {
    return null;
  }

  if (!noteData.is_public && noteData.user_id !== user?.id) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center gap-6"
        style={{ backgroundColor: currentScheme.colorBase200 }}
      >
        <CustomText>
          <MaterialCommunityIcons name="alert-circle" size={96} />
        </CustomText>
        <View className="flex flex-col gap-1">
          <CustomText className="text-xl text-center" variant="bold">
            The user made this note private.
          </CustomText>
          <CustomText className="text-sm opacity-70 text-center px-8">
            Sorry, we can&apos;t display this note. The user either made this
            note private or made changes on it.
          </CustomText>
          <CustomText
            className="opacity-70 text-center my-4 px-8"
            variant="bold"
          >
            You&apos;ll be redirected to your note tab in a few seconds...
          </CustomText>
        </View>
      </SafeAreaView>
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
