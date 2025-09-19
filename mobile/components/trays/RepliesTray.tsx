import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomTextInput from "../CustomTextInput";
import CommentComponent from "../CommentComponent";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useComment } from "@/hooks/useComment";
import { Comment, Post } from "@/types/user/types";
import { findCommentById } from "@/utils/comment";

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
  Pressable,
} from "react-native";

import _API_INSTANCE from "@/utils/axios";

const RepliesTray = ({
  comment,
  close,
}: {
  comment: Comment;
  close: () => void;
}) => {
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();
  const [content, setContent] = useState("");

  const { data: post, refetch } = useQuery({
    queryKey: ["view-post", comment.post_id],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Post>(
        `/forum/post/${comment.post_id}`
      );
      return data;
    },
  });

  const liveComment = post
    ? findCommentById(post.comments, comment.id)
    : comment;

  const { mutate: createComment } = useComment([
    ["view-post", comment.post_id],
  ]);

  const handleSubmit = () => {
    if (!content) {
      toast("Empty comment?");
      return;
    }
    createComment(
      {
        body: content,
        parent_comment_id: comment.id,
        post_id: comment.post_id,
      },
      {
        onSuccess: async () => {
          setContent("");
          await refetch();
        },
        onError: () => {
          toast.error("Error commenting.");
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        maxHeight: height / 1.5,
        height: height / 1.5,
        backgroundColor: currentScheme.colorBase100,
      }}
      className="rounded-tr-3xl rounded-tl-3xl px-4 py-4 pb-4 gap-4"
    >
      <View className="flex flex-row gap-2 items-center">
        <CustomTextInput
          value={content}
          onChangeText={setContent}
          placeholder="Comment"
          className="rounded-3xl pb-4 flex-1"
          enterKeyHint="enter"
          onSubmitEditing={handleSubmit}
        />
        <Pressable onPress={handleSubmit}>
          <CustomView variant="colorBase200" className="rounded-full p-2">
            <CustomText>
              <MaterialCommunityIcons name="send" size={24} />
            </CustomText>
          </CustomView>
        </Pressable>
      </View>

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
              Replies
            </CustomText>
          </View>
        </View>
      </View>

      {liveComment?.replies && liveComment.replies.length > 0 ? (
        <ScrollView contentContainerClassName="gap-4">
          {liveComment.replies.map((reply: Comment) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              invalidateKey={["view-post", comment.post_id]}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="items-center justify-center gap-2">
          <CustomText>
            <MaterialCommunityIcons name="emoticon-sad" size={48} />
          </CustomText>
          <CustomText className="text-xl">No replies.</CustomText>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default RepliesTray;
