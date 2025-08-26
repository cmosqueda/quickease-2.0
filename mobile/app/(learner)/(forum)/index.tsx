import useTheme from "@/hooks/useTheme";
import ForumHeader from "@/components/ForumHeader";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Link } from "expo-router";
import { Post } from "@/types/user/types";
import { useTrays } from "react-native-trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PostComponent = ({ post }: { post: Post }) => {
  return (
    <CustomView variant="colorBase100" className="rounded-3xl">
      <Link
        href={{
          pathname: "/post/view/[id]",
          params: { id: post.id },
        }}
        asChild
        key={post.id}
      >
        <Pressable className="flex-1">
          <CustomView
            variant="colorBase100"
            className="flex flex-1 gap-2 p-4 rounded-xl"
          >
            <View className="flex flex-row gap-3 items-center">
              <CustomText color="colorBaseContent">
                <FontAwesome6 name="user-circle" size={16} />
              </CustomText>
              <CustomText color="colorBaseContent">
                {post.user?.first_name} {post.user?.last_name}
              </CustomText>
            </View>
            <CustomText className="text-3xl" variant="bold">
              {post.title}
            </CustomText>
            {post.tags.length > 0 && (
              <View className="flex flex-row gap-2 items-center">
                {post.tags.map((tag) => (
                  <CustomView
                    key={tag.tag_id}
                    variant="colorPrimary"
                    className="px-6 py-1 rounded-3xl"
                  >
                    <CustomText color="colorPrimaryContent">
                      {tag.tag.tag_name}
                    </CustomText>
                  </CustomView>
                ))}
              </View>
            )}
          </CustomView>
        </Pressable>
      </Link>
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
  );
};

export default function Page() {
  const { currentScheme } = useTheme();

  const useSearchTray = useTrays<MyTraysProps>("DismissibleStickToTopTray");
  const useNotificationTray = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["recent-posts"],
    queryFn: async ({ pageParam = null }) => {
      const { data: posts } = await _API_INSTANCE.get("/forum/posts/recent", {
        params: { cursor: pageParam, limit: 6 },
        timeout: 5 * 60 * 1000,
      });
      return posts;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        rightSideChildren={
          <>
            <Pressable
              onPress={() =>
                useSearchTray.push("SearchTray", {
                  close: useSearchTray.pop,
                })
              }
            >
              <CustomText>
                <FontAwesome5 name="search" size={20} />
              </CustomText>
            </Pressable>

            <Pressable
              onPress={() =>
                useNotificationTray.push("NotificationTray", {
                  close: useNotificationTray.pop,
                })
              }
            >
              <CustomText>
                <FontAwesome6 name="bell" size={22} />
              </CustomText>
            </Pressable>
          </>
        }
      />

      <CustomView
        className="flex-1 p-4 rounded-tr-3xl rounded-tl-3xl"
        variant="colorBase300"
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data?.pages.flatMap((page) => page.posts) ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostComponent post={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
            />
          }
          contentContainerStyle={{ gap: 16 }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      </CustomView>

      <Link asChild href={"/post/create"}>
        <CustomPressable
          variant="colorPrimary"
          className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="post-add" size={32} />
          </CustomText>
        </CustomPressable>
      </Link>
    </SafeAreaView>
  );
}
