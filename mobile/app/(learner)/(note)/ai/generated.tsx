import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { toast } from "sonner-native";
import { router } from "expo-router";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useLayoutEffect, useState } from "react";

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
import { buildEditorBridgeExtensions } from "@/types/theme/TenTapThemes";

export default function Page() {
  const { user, addNote } = useAuth();
  const { currentScheme } = useTheme();
  const { width } = useWindowDimensions();

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
    bridgeExtensions: buildEditorBridgeExtensions(currentScheme),
    dynamicHeight: true,
    editable: true,
    initialContent: content,
  });

  const editorContent = useEditorContent(editor, { type: "html" });

  useLayoutEffect(() => {
    /**
     * Retrieves the generated note content from AsyncStorage, parses it,
     * and updates the editor and state with the retrieved title and content.
     * If retrieval or parsing fails, navigates back using the router.
     *
     * @async
     * @returns {Promise<void>} Resolves when the content is set or navigation occurs.
     */
    const getGeneratedContent = async () => {
      try {
        const stored = await AsyncStorage.getItem("app-ai-generated-note");

        if (stored) {
          const parsed = JSON.parse(stored);

          setTitle(parsed.title || "Untitled");
          setContent(parsed.content || "");
          editor.setContent(parsed.content);
        }
      } catch (err) {
        router.back();
      }
    };

    getGeneratedContent();
  }, [editor]);

  const handleSave = async () => {
    try {
      const res = await _API_INSTANCE.post(
        "/notes/create",
        {
          title: title,
          content: editorContent,
          user_id: user?.id,
          is_ai_generated: true,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (res.status == 201) {
        addNote(res.data);

        await checkBadges();
        router.back();
      }
    } catch (err: any) {
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
