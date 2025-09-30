import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import UserAvatar from "@/components/UserAvatar";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import Collapsible from "react-native-collapsible";
import PostActionBar from "@/components/PostActionBar";
import RotatingArrow from "@/components/buttons/RotatingArrow";
import CustomRichText from "@/components/CustomRichText";
import CommentComponent from "@/components/CommentComponent";
import * as Clipboard from "expo-clipboard";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTrays } from "react-native-trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Comment, Post } from "@/types/user/types";
import { RefreshControl } from "react-native-gesture-handler";
import { Pressable, ScrollView, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentScheme } = useTheme();

  const [isAttachmentsCollapsed, setAttachmentsCollapse] = useState(true);

  const useViewProfileTray = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );
  const useReportTray = useTrays<MyTraysProps>("DismissibleStickToTopTray");

  /**
   * Fetches and manages the state of a forum post by its `id` using React Query.
   *
   * @remarks
   * - Uses the `useQuery` hook to asynchronously retrieve post data from the API.
   * - The query is identified by the key `["view-post", id]`.
   * - Handles API errors by throwing them to be managed by React Query.
   *
   * @returns
   * - `data`: The fetched `Post` object, or `undefined` if not yet loaded.
   * - `refetch`: Function to manually refetch the post data.
   * - `isRefetching`: Boolean indicating if a refetch is currently in progress.
   */
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

  const handleShare = async () => {
    if (post) {
      const string = `https://quickease.online/learner/post/${post!.id}`;
      await Clipboard.setStringAsync(string);
    }
  };

  if (!post) {
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: currentScheme.colorBase300,
      }}
    >
      <View className="flex flex-row gap-4 items-center justify-between px-4">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View className="flex flex-row gap-4 items-center">
          {post.user?.id === user?.id && (
            <Link
              href={{
                pathname: "/post/edit/[id]",
                params: { id: post.id },
              }}
              asChild
              className="rounded-3xl"
            >
              <Pressable className="flex flex-row gap-2 items-center">
                <CustomText>
                  <MaterialCommunityIcons name="clipboard-edit" size={24} />
                </CustomText>
              </Pressable>
            </Link>
          )}
          <Pressable
            className="flex flex-row gap-2 items-center"
            onPress={handleShare}
          >
            <CustomText>
              <MaterialIcons name="share" size={24} />
            </CustomText>
          </Pressable>
          <Pressable
            className="flex flex-row gap-2 items-center"
            onPress={() => {
              useReportTray.push("ReportPostTray", {
                post: post,
                close: useReportTray.pop,
              });
            }}
          >
            <CustomText>
              <MaterialIcons name="flag" size={24} />
            </CustomText>
          </Pressable>
        </View>
      </View>

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

        {post.attachments && post.attachments.length > 0 && (
          <Pressable onPress={() => setAttachmentsCollapse((prev) => !prev)}>
            <CustomView
              variant="colorBase100"
              className="gap-2 rounded-3xl p-4"
            >
              <View className="flex flex-row justify-between items-center">
                <CustomText variant="bold" className="text-sm">
                  Attachments
                </CustomText>
                <RotatingArrow isCollapsed={isAttachmentsCollapsed} />
              </View>

              <Collapsible
                collapsed={isAttachmentsCollapsed}
                style={{ gap: 12 }}
              >
                {post.attachments.map((attachment) => {
                  switch (attachment.resource_type) {
                    case "NOTE":
                      if (attachment.note_id)
                        return (
                          <Pressable
                            key={attachment.id}
                            onPress={() => {
                              router.push({
                                pathname: "/(learner)/(forum)/note/view/[id]",
                                params: { id: attachment.note!.id },
                              });
                            }}
                            className="flex flex-row gap-4 items-center"
                          >
                            <CustomText>
                              <MaterialCommunityIcons name="note" size={28} />
                            </CustomText>
                            <CustomView
                              variant="colorBase200"
                              className="p-4 rounded-3xl flex-1"
                            >
                              <CustomText className="text-xl" variant="bold">
                                {attachment.note?.title}
                              </CustomText>
                            </CustomView>
                          </Pressable>
                        );
                    case "FLASHCARD":
                      if (attachment.flashcard_id)
                        return (
                          <Pressable
                            key={attachment.id}
                            onPress={() => {
                              router.push({
                                pathname:
                                  "/(learner)/(forum)/flashcard/view/[id]",
                                params: { id: attachment.flashcard!.id },
                              });
                            }}
                            className="flex flex-row gap-4 items-center"
                          >
                            <CustomText>
                              <MaterialCommunityIcons
                                name="view-column"
                                size={28}
                              />
                            </CustomText>
                            <CustomView
                              variant="colorBase200"
                              className="p-4 rounded-3xl flex-1"
                            >
                              <CustomText className="text-xl" variant="bold">
                                {attachment.flashcard?.title}
                              </CustomText>
                            </CustomView>
                          </Pressable>
                        );
                    case "QUIZ":
                      if (attachment.quiz_id)
                        return (
                          <Pressable
                            key={attachment.id}
                            onPress={() => {
                              router.push({
                                pathname: "/(learner)/(forum)/quiz/view/[id]",
                                params: { id: attachment.quiz!.id },
                              });
                            }}
                            className="flex flex-row gap-4 items-center"
                          >
                            <CustomText>
                              <MaterialCommunityIcons
                                name="head-question"
                                size={28}
                              />
                            </CustomText>
                            <CustomView
                              variant="colorBase200"
                              className="p-4 rounded-3xl flex-1"
                            >
                              <CustomText className="text-xl" variant="bold">
                                {attachment.quiz?.title}
                              </CustomText>
                            </CustomView>
                          </Pressable>
                        );
                  }
                })}
              </Collapsible>
            </CustomView>
          </Pressable>
        )}

        <PostActionBar post={post} id={id} />

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
    </SafeAreaView>
  );
}
