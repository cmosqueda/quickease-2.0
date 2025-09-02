import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import UserAvatar from "@/components/UserAvatar";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CommentComponent from "@/components/CommentComponent";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useVote } from "@/hooks/useVote";
import { useQuery } from "@tanstack/react-query";
import { useTrays } from "react-native-trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Comment, Post } from "@/types/user/types";
import { useRef, useState } from "react";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { Pressable, ScrollView, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

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

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  const { mutate: voteOnPost, isPending: isVotingPost } = useVote([
    ["view-post", id],
  ]);

  const { data: post } = useQuery({
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

  const editor = useEditorBridge({
    theme: {
      webview: {
        padding: 8,
        backgroundColor: currentScheme.colorBase100,
      },
    },
    bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
    dynamicHeight: true,
    editable: false,
    initialContent: post ? post.post_body : "",
  });

  if (post && editor) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{
          position: "relative",
          backgroundColor: currentScheme.colorBase300,
        }}
      >
        <View className="flex flex-row gap-4 items-center p-4">
          <Pressable
            onPress={() => {
              setIndex(0);
              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <View className="flex flex-row gap-2 self-center flex-1">
            <CustomPressable
              variant={index == 0 ? "colorPrimary" : "colorBase100"}
              className="rounded-3xl flex-1 items-center"
              onPress={() => {
                setIndex(0);
                pagerViewRef.current?.setPage(0);
              }}
            >
              <CustomText
                color={index == 0 ? "colorPrimaryContent" : "colorBaseContent"}
              >
                Post
              </CustomText>
            </CustomPressable>
            <CustomPressable
              variant={index == 1 ? "colorPrimary" : "colorBase100"}
              className="rounded-3xl flex-1 items-center"
              onPress={() => {
                setIndex(1);
                pagerViewRef.current?.setPage(1);
              }}
            >
              <CustomText
                color={index == 1 ? "colorPrimaryContent" : "colorBaseContent"}
              >
                Answers
              </CustomText>
            </CustomPressable>
          </View>
        </View>
        <PagerView
          style={{ flex: 1, gap: 8 }}
          ref={pagerViewRef}
          initialPage={0}
          scrollEnabled={false}
        >
          <CustomView
            className="flex-1 gap-4 p-4 rounded-tr-3xl rounded-tl-3xl"
            key={0}
          >
            {post.user!.id === user!.id && (
              <Link asChild href={"/(learner)/(profile)"}>
                <Pressable className="flex flex-row gap-4 items-center">
                  <UserAvatar avatar={post.user?.avatar!} />
                  <View>
                    <CustomText variant="bold">
                      {post.user?.first_name} {post.user?.last_name}
                    </CustomText>
                    <CustomText className="text-sm opacity-40">
                      {dayjs(post.created_at)
                        .format("hh:mm A / MMMM DD, YYYY")
                        .toString()}
                    </CustomText>
                  </View>
                </Pressable>
              </Link>
            )}

            {post.user!.id !== user!.id && (
              <Pressable
                onPress={() => {
                  useViewProfileTray.push("ViewOtherProfileTray", {
                    close: () => useViewProfileTray.pop,
                    user: post.user!,
                  });
                }}
                className="flex flex-row gap-4 items-center"
              >
                <UserAvatar avatar={post.user?.avatar!} />
                <View>
                  <CustomText variant="bold">
                    {post.user?.first_name} {post.user?.last_name}
                  </CustomText>
                  <CustomText className="text-sm opacity-40">
                    {dayjs(post.created_at)
                      .format("hh:mm A / MMMM DD, YYYY")
                      .toString()}
                  </CustomText>
                </View>
              </Pressable>
            )}

            <View className="flex-1" key={0}>
              <CustomText variant="bold" className="text-4xl">
                {post.title}
              </CustomText>
              <RichText editor={editor} />
            </View>

            <CustomView
              variant="colorPrimary"
              className="flex flex-row gap-4 items-center rounded-3xl px-6 py-4"
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
                {post.vote_sum}
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
                      post: post,
                    });
                  }}
                  className="flex flex-row gap-2 items-center"
                >
                  <CustomText color="colorPrimaryContent">
                    <MaterialCommunityIcons name="comment" size={24} />
                  </CustomText>
                </Pressable>
                {post.attachments.length > 0 && (
                  <Pressable
                    onPress={() => {
                      openTray("ViewPostAttachmentsTray", {
                        close: closeTray,
                        post: post,
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
          </CustomView>
          <View className="p-4 gap-4" key={1}>
            {post.comments.length > 0 && (
              <ScrollView contentContainerClassName="gap-4">
                {post.comments.map((comment: Comment) => (
                  <CommentComponent
                    invalidateKey={["view-post", id]}
                    key={comment.id}
                    comment={comment}
                  />
                ))}
              </ScrollView>
            )}
            {post.comments.length == 0 && (
              <View className="flex-1 items-center justify-center gap-4">
                <CustomText>
                  <MaterialCommunityIcons
                    name="emoticon-happy-outline"
                    size={64}
                  />
                </CustomText>
                <CustomText className="text-2xl">
                  No answers, unfortunately.
                </CustomText>
              </View>
            )}
          </View>
        </PagerView>
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
