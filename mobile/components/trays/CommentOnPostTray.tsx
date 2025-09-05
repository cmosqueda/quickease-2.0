import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { useState } from "react";
import { useComment } from "@/hooks/useComment";
import { Post } from "@/types/user/types";
import { View, KeyboardAvoidingView, Dimensions } from "react-native";

import {
  useEditorBridge,
  useEditorContent,
  RichText,
} from "@10play/tentap-editor";

import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

const CommentOnPostTray = ({
  post,
  close,
}: {
  post: Post;
  close: () => void;
}) => {
  const { currentScheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditorBridge({
    theme: {
      webview: {
        padding: 8,
        backgroundColor: currentScheme.colorBase100,
      },
    },
    bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
    dynamicHeight: true,
  });

  const editorContent = useEditorContent(editor, {
    type: "html",
  });

  const { mutate: createComment } = useComment([["view-post", post.id]]);

  const handleSubmit = () => {
    if (!editorContent) {
      toast("Empty comment?");
      return;
    }
    setIsSubmitting(true);

    createComment(
      {
        body: editorContent,
        post_id: post.id,
      },
      {
        onSuccess: () => {
          close();
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-4 gap-4 flex-1"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={close}
            />
          </CustomText>
          <View>
            <CustomText variant="bold" className="text-xl">
              Comment to
            </CustomText>
            <CustomText className="text-sm">{post.title}</CustomText>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        style={{
          minHeight: Dimensions.get("screen").height / 3,
          maxHeight: Dimensions.get("screen").height / 2.5,
        }}
      >
        {editor && <RichText editor={editor} />}
      </KeyboardAvoidingView>
      <CustomPressable
        className="rounded-3xl items-center"
        variant="colorBase300"
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <CustomText>Comment</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default CommentOnPostTray;
