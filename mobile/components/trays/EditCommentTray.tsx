import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomPressable from "../CustomPressable";

import { MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { Comment } from "@/types/user/types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  View,
  KeyboardAvoidingView,
  Dimensions,
  useWindowDimensions,
} from "react-native";

import {
  useEditorBridge,
  useEditorContent,
  RichText,
} from "@10play/tentap-editor";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";
import { router } from "expo-router";

const EditCommentTray = ({
  comment,
  close,
}: {
  comment: Comment;
  close: () => void;
}) => {
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();

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
    initialContent: comment.comment_body,
  });

  const editorContent = useEditorContent(editor, {
    type: "html",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await _API_INSTANCE.put(
        "/forum/post/comment/update",
        {
          body: editorContent,
          comment_id: comment.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ["view-post", comment.post_id],
      });

      toast.success("Comment updated.");
      close();
      router.replace({
        pathname: "/(learner)/(forum)/post/view/[id]",
        params: { id: comment.post_id },
      });
    } catch (err) {
      toast.error("Error updating comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        maxHeight: height / 1.2,
        backgroundColor: currentScheme.colorBase100,
      }}
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
              Edit comment
            </CustomText>
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
    </KeyboardAvoidingView>
  );
};

export default EditCommentTray;
