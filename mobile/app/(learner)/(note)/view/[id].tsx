import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Note } from "@/types/user/types";
import { toast } from "sonner-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";

import {
  View,
  Pressable,
  KeyboardAvoidingView,
  useWindowDimensions,
  Keyboard,
} from "react-native";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, editNote } = useAuth();
  const { width } = useWindowDimensions();
  const { currentScheme } = useTheme();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isToolbarHidden, setToolbarVisibility] = useState(true);

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

  const editorContent = useEditorContent(editor, { type: "html" });

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

  const handleSave = async () => {
    if (title === data!.title && editorContent === data!.notes_content) {
      toast.info("No changes to save.");
      return;
    }

    try {
      const res = await _API_INSTANCE.put(
        "/notes/update",
        {
          title: title,
          content: editorContent,
          note_id: id,
          user_id: user?.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (res.status == 200) {
        editNote(res.data);
        router.back();
      }
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (editor.getEditorState().isFocused) {
          setToolbarVisibility(false);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (editor.getEditorState().isFocused) {
          setToolbarVisibility(true);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []); // used for hiding the toolbar | might be unstable, tabanggg buset nga tiptap kinia.

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
              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <Pressable
            onPress={() => {
              toast.promise(handleSave(), {
                loading: "Saving note.",
                error: "Error saving note.",
                success: (data) => "Note created.",
              });
            }}
          >
            <CustomText>
              <MaterialIcons name="save" size={32} />
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
        <KeyboardAvoidingView
          behavior="position"
          style={{ position: "absolute", width: width, bottom: 0 }}
        >
          <Toolbar
            editor={editor}
            shouldHideDisabledToolbarItems
            hidden={isToolbarHidden}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
