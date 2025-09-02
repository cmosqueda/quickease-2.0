import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CommentComponent from "../CommentComponent";

import { MaterialIcons } from "@expo/vector-icons";

import { Comment } from "@/types/user/types";
import { View, ScrollView } from "react-native";

const RepliesTray = ({
  comment,
  close,
}: {
  comment: Comment;
  close: () => void;
}) => {
  if (comment.replies.length > 0) {
    return (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
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
                Replies
              </CustomText>
            </View>
          </View>
        </View>
        <ScrollView contentContainerClassName="gap-4">
          {comment.replies.map((reply: Comment) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              invalidateKey={["view-post", comment.post_id]}
              disableCommentBtn
            />
          ))}
        </ScrollView>
      </CustomView>
    );
  }
};

export default RepliesTray;
