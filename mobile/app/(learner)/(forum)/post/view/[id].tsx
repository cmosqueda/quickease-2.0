import dayjs from "dayjs";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import UserAvatar from "@/components/UserAvatar";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Comment, Post } from "@/types/user/types";
import { useRef, useState } from "react";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

const CommentComponent = ({ comment }: { comment: Comment }) => {
  const { currentScheme } = useTheme();

  const editor = useEditorBridge({
    theme: {
      webview: {
        padding: 8,
        backgroundColor: currentScheme.colorBase100,
      },
    },
    bridgeExtensions: [..._EDITOR_BRIDGE_EXTENSIONS],
    dynamicHeight: true,
    editable: false,
    initialContent: comment ? comment.comment_body : "",
  });

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
      {editor && (
        <View className="px-4">
          <RichText editor={editor} />
        </View>
      )}

      <CustomView
        variant="colorPrimary"
        className="flex flex-row gap-4 items-center rounded-3xl px-6 py-4"
      >
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="keyboard-arrow-up" size={24} />
        </CustomText>
        <CustomText variant="bold" color="colorPrimaryContent">
          {comment.votes.length}
        </CustomText>
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="keyboard-arrow-down" size={24} />
        </CustomText>
        <View className="flex-1" />
        <View className="flex flex-row gap-2 items-center">
          <CustomText color="colorPrimaryContent">
            <MaterialCommunityIcons name="comment" size={24} />
          </CustomText>
          <CustomText color="colorPrimaryContent">
            {comment.replies.length}
          </CustomText>
        </View>
      </CustomView>
    </CustomView>
  );
};

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentScheme } = useTheme();

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  const {
    data: post,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["view-post", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get<Post>(`/forum/post/${id}`);
        console.log(data);
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
            <View className="gap-2">
              <View className="flex flex-row gap-4 items-center">
                <UserAvatar avatar={post.user?.avatar!} />
                <View>
                  <CustomText variant="bold">Jhon Lloyd Viernes</CustomText>
                  <CustomText className="text-sm opacity-40">
                    August 15, 2025
                  </CustomText>
                </View>
              </View>
            </View>

            <View className="flex-1">
              <CustomText variant="bold" className="text-4xl">
                {post.title}
              </CustomText>
              <RichText editor={editor} />
            </View>

            <CustomView
              variant="colorPrimary"
              className="flex flex-row gap-4 items-center rounded-3xl px-6 py-4"
            >
              <CustomText color="colorPrimaryContent">
                <MaterialIcons name="keyboard-arrow-up" size={24} />
              </CustomText>
              <CustomText variant="bold" color="colorPrimaryContent">
                {post.votes.length}
              </CustomText>
              <CustomText color="colorPrimaryContent">
                <MaterialIcons name="keyboard-arrow-down" size={24} />
              </CustomText>
              <View className="flex-1" />
              <View className="flex flex-row gap-2 items-center">
                <CustomText color="colorPrimaryContent">
                  <MaterialCommunityIcons name="comment" size={24} />
                </CustomText>
                <CustomText color="colorPrimaryContent">
                  {post.comments.length}
                </CustomText>
              </View>
            </CustomView>
          </CustomView>
          <View className="p-4 gap-4" key={1}>
            <ScrollView contentContainerClassName="gap-4">
              {post.comments.map((comment: Comment) => (
                <CommentComponent key={comment.id} comment={comment} />
              ))}
            </ScrollView>
          </View>
        </PagerView>
      </SafeAreaView>
    );
  }
}
