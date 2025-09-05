import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import UserAvatar from "@/components/UserAvatar";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomRichText from "@/components/CustomRichText";
import CommentComponent from "@/components/CommentComponent";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useVote } from "@/hooks/useVote";
import { useQuery } from "@tanstack/react-query";
import { useTrays } from "react-native-trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Comment, Post } from "@/types/user/types";
import { Pressable, ScrollView, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import _API_INSTANCE from "@/utils/axios";
import { RefreshControl } from "react-native-gesture-handler";

export default function Page() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleStickToTopTray"
  );

  const useViewProfileTray = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { mutate: voteOnPost, isPending: isVotingPost } = useVote([
    ["view-post", id],
  ]);

  const {
    data: post,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["view-post", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get<Post>(`/forum/post/${id}`);

        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  if (post) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: currentScheme.colorBase300,
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="px-4"
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>

        <ScrollView
          contentContainerClassName="p-4 gap-4"
          className="rounded-tl-3xl rounded-tr-3xl"
          key={0}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <CustomView variant="colorBase100" className="p-4 rounded-3xl">
            {post?.user!.id === user!.id && (
              <Link asChild href={"/(learner)/(profile)"}>
                <Pressable className="flex flex-row gap-4 items-center">
                  <UserAvatar avatar={post?.user?.avatar!} />
                  <View>
                    <CustomText variant="bold">
                      {post?.user?.first_name} {post?.user?.last_name}
                    </CustomText>
                    <CustomText className="text-sm opacity-40">
                      {dayjs(post?.created_at)
                        .format("hh:mm A / MMMM DD, YYYY")
                        .toString()}
                    </CustomText>
                  </View>
                </Pressable>
              </Link>
            )}

            {post?.user!.id !== user!.id && (
              <Pressable
                onPress={() => {
                  useViewProfileTray.push("ViewOtherProfileTray", {
                    close: () => useViewProfileTray.pop,
                    user: post?.user!,
                  });
                }}
                className="flex flex-row gap-4 items-center"
              >
                <UserAvatar avatar={post?.user?.avatar!} />
                <View>
                  <CustomText variant="bold">
                    {post?.user?.first_name} {post?.user?.last_name}
                  </CustomText>
                  <CustomText className="text-sm opacity-40">
                    {dayjs(post?.created_at)
                      .format("hh:mm A / MMMM DD, YYYY")
                      .toString()}
                  </CustomText>
                </View>
              </Pressable>
            )}

            <CustomText variant="bold" className="text-4xl">
              {post?.title}
            </CustomText>
            <CustomRichText content={post.post_body} />
          </CustomView>

          {post?.comments && post.comments.length > 0 && (
            <>
              <CustomText className="text-2xl" variant="bold">
                Comments
              </CustomText>
              {post?.comments &&
                post?.comments.map((comment: Comment) => (
                  <CommentComponent
                    invalidateKey={["view-post", id]}
                    key={comment.id}
                    comment={comment}
                  />
                ))}
            </>
          )}
        </ScrollView>

        <CustomView
          variant="colorPrimary"
          className="flex flex-row gap-4 items-center px-8 py-4 rounded-tl-3xl rounded-tr-3xl"
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
                className="flex flex-row gap-2 items-center"
              >
                <CustomText color="colorPrimaryContent">
                  <MaterialCommunityIcons name="view-list" size={24} />
                </CustomText>
              </Pressable>
            )}
          </View>
        </CustomView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        position: "relative",
        backgroundColor: currentScheme.colorBase300,
      }}
    ></SafeAreaView>
  );
}
