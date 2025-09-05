import dayjs from "dayjs";
import CustomText from "./CustomText";
import CustomView from "./CustomView";
import UserAvatar from "./UserAvatar";
import CustomRichText from "./CustomRichText";

import { Comment } from "@/types/user/types";
import { useTrays } from "react-native-trays";
import { MyTraysProps } from "@/types/trays/trays";
import { View, Pressable } from "react-native";
import { useVoteOnComment } from "@/hooks/useVote";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CommentComponent({
  comment,
  invalidateKey,
  disableCommentBtn = false,
}: {
  comment: Comment;
  invalidateKey: (string | number)[];
  disableCommentBtn?: boolean;
}) {
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { mutate: voteOnComment, isPending: isVotingComment } =
    useVoteOnComment([invalidateKey]);

  return (
    <CustomView className="rounded-3xl flex-1" variant="colorBase100">
      <View className="p-4 gap-4">
        <View className="flex flex-row gap-4 items-center">
          <UserAvatar avatar={comment.user?.avatar!} />
          <View>
            <CustomText variant="bold">
              {comment.user?.first_name} {comment.user?.last_name}
            </CustomText>
            <CustomText className="text-sm opacity-60">
              {dayjs(comment.updated_at)
                .format("hh:mm A / MMMM DD, YYYY")
                .toString()}
            </CustomText>
          </View>
        </View>
      </View>
      <View className="px-4">
        <CustomRichText content={comment.comment_body} />
      </View>

      <CustomView
        variant="colorPrimary"
        className="flex flex-row gap-4 items-center rounded-3xl px-6 py-4"
      >
        <Pressable
          disabled={isVotingComment}
          onPress={() =>
            voteOnComment({ comment_id: comment.id, vote_type: 1 })
          }
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="keyboard-arrow-up" size={24} />
          </CustomText>
        </Pressable>

        <CustomText variant="bold" color="colorPrimaryContent">
          {comment.vote_sum}
        </CustomText>
        <Pressable
          disabled={isVotingComment}
          onPress={() =>
            voteOnComment({ comment_id: comment.id, vote_type: -1 })
          }
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="keyboard-arrow-down" size={24} />
          </CustomText>
        </Pressable>
        <View className="flex-1" />
        {!disableCommentBtn && (
          <Pressable
            onPress={() => {
              openTray("RepliesTray", { close: closeTray, comment: comment });
            }}
            className="flex flex-row gap-2 items-center"
          >
            <CustomText color="colorPrimaryContent">
              <MaterialCommunityIcons name="comment" size={24} />
            </CustomText>
            <CustomText color="colorPrimaryContent">
              {comment.replies.length}
            </CustomText>
          </Pressable>
        )}
      </CustomView>
    </CustomView>
  );
}
