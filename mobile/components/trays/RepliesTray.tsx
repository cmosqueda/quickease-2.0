import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomTextInput from "../CustomTextInput";
import CommentComponent from "../CommentComponent";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { Comment } from "@/types/user/types";
import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useComment } from "@/hooks/useComment";
import { toast } from "sonner-native";

const RepliesTray = ({
  comment,
  close,
}: {
  comment: Comment;
  close: () => void;
}) => {
  const { height } = useWindowDimensions();
  const [content, setContent] = useState("");

  const [comments, setComments] = useState(comment);

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
        onSuccess: () => {
          close();
        },
        onError: () => {
          toast.error("Error commenting.");
        },
      }
    );
  };

  useEffect(() => {
    setComments(comment);
  }, [comment]);

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl px-4 py-4 pb-4 gap-4"
      style={{ maxHeight: height / 1.5 }}
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
      {comment.replies && comment.replies.length > 0 && (
        <ScrollView contentContainerClassName="gap-4">
          {comments.replies.map((reply: Comment) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              invalidateKey={["view-post", comment.post_id]}
            />
          ))}
        </ScrollView>
      )}
      {comment.replies && comment.replies.length === 0 && (
        <View className="items-center justify-center gap-2">
          <CustomText>
            <MaterialCommunityIcons name="emoticon-sad" size={48} />
          </CustomText>
          <CustomText className="text-xl">No replies.</CustomText>
        </View>
      )}
    </CustomView>
  );
};

export default RepliesTray;
