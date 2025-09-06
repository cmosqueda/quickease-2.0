import dayjs from "dayjs";
import useTheme from "@/hooks/useTheme";
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
  level = 0,
}: {
  comment: Comment;
  invalidateKey: (string | number)[];
  disableCommentBtn?: boolean;
  level?: number;
}) {
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { mutate: voteOnComment, isPending: isVotingComment } =
    useVoteOnComment([invalidateKey]);

  return (
    <View className="flex flex-row">
      {level > 0 && (
        <View className="w-6 items-center">
          <View
            style={{
              borderLeftColor: currentScheme.colorBase200,
              borderLeftWidth: 2,
              flex: 1,
            }}
          />
        </View>
      )}

      <View className="flex-1">
        <CustomView className="rounded-3xl my-2">
          <View className="p-4 gap-4">
            <View className="flex flex-row gap-4 items-center">
              <UserAvatar avatar={comment.user?.avatar!} />
              <View className="flex-1">
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
                onPress={() =>
                  openTray("RepliesTray", { close: closeTray, comment })
                }
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

        {comment.replies && comment.replies.length > 0 && (
          <View className="ml-6">
            {comment.replies
              .slice(0, level >= 1 ? 1 : comment.replies.length)
              .map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  invalidateKey={["view-post", reply.post_id]}
                  disableCommentBtn={disableCommentBtn}
                  level={level + 1}
                />
              ))}

            {level >= 1 && comment.replies.length > 1 && (
              <Pressable
                onPress={() =>
                  openTray("RepliesTray", { close: closeTray, comment })
                }
              >
                <CustomText className="text-sm text-blue-500 ml-8">
                  View more replies ({comment.replies.length - 1})
                </CustomText>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
