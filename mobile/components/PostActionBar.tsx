import useAuth from "@/hooks/useAuth";
import CustomView from "./CustomView";
import CustomText from "./CustomText";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Post } from "@/types/user/types";
import { useVote } from "@/hooks/useVote";
import { useTrays } from "react-native-trays";
import { MyTraysProps } from "@/types/trays/trays";
import { Pressable, View } from "react-native";

export default function PostActionBar({
  post,
  id,
}: {
  post: Post;
  id: string;
}) {
  const { user } = useAuth();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleStickToTopTray"
  );

  const { mutate: voteOnPost, isPending: isVotingPost } = useVote([
    ["view-post", id],
  ]);

  return (
    <CustomView
      variant="colorPrimary"
      className="flex flex-row gap-4 items-center px-8 py-4 rounded-3xl"
    >
      <Pressable
        disabled={isVotingPost}
        onPress={() => voteOnPost({ post_id: id, vote_type: -1 })}
      >
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="keyboard-arrow-up" size={24} />
        </CustomText>
      </Pressable>

      <CustomText variant="bold" color="colorPrimaryContent">
        {post?.vote_sum}
      </CustomText>
      <Pressable
        disabled={isVotingPost}
        onPress={() => voteOnPost({ post_id: id, vote_type: -1 })}
      >
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="keyboard-arrow-down" size={24} />
        </CustomText>
      </Pressable>

      <View className="flex-1" />
      <View className="flex flex-row items-center gap-4">
        <Pressable
          onPress={() => {
            openTray("CommentOnPostTray", {
              close: closeTray,
              post: post!,
            });
          }}
          className="flex flex-row gap-2 items-center"
          style={{ display: user?.is_verified ? "flex" : "none" }}
        >
          <CustomText color="colorPrimaryContent">
            <MaterialCommunityIcons name="comment" size={24} />
          </CustomText>
        </Pressable>
        {post?.attachments && post?.attachments.length > 0 && (
          <Pressable
            onPress={() => {
              openTray("ViewPostAttachmentsTray", {
                close: closeTray,
                post: post!,
              });
            }}
            className="hidden flex-row gap-2 items-center"
          >
            <CustomText color="colorPrimaryContent">
              <MaterialCommunityIcons name="view-list" size={24} />
            </CustomText>
          </Pressable>
        )}
      </View>
    </CustomView>
  );
}
