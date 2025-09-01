import useTheme from "@/hooks/useTheme";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import PostComponent from "@/components/PostComponent";

import { MaterialIcons } from "@expo/vector-icons";

import { Post } from "@/types/user/types";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { View, Pressable, RefreshControl, ScrollView } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { query } = useLocalSearchParams<{ query: string }>();
  const [sort, setSort] = useState("newest");

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["recent-posts", query, sort],
    queryFn: async ({ pageParam = 1 }) => {
      const limit = 10;

      const { data } = await _API_INSTANCE.get("/forum/search", {
        params: { query, page: pageParam, limit, sort },
        timeout: 5 * 60 * 1000,
      });

      return {
        posts: data.posts,
        total: data.total,
        query,
        page: pageParam,
        limit,
        sort,
        nextCursor: data.posts.length === limit ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <View className="flex flex-row gap-4 items-center p-4">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <View>
          <CustomText className="text-sm opacity-60">Searched for</CustomText>
          <CustomText className="text-xl" variant="bold">
            {query.toString()}
          </CustomText>
        </View>
      </View>
      <CustomView
        className="p-4 rounded-tr-3xl rounded-tl-3xl"
        variant="colorBase300"
      >
        {data && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isFetchingNextPage}
                onRefresh={refetch}
              />
            }
            contentContainerClassName="gap-4 flex flex-col"
          >
            {data?.pages.flatMap((page) =>
              page.posts.map((post: Post) => (
                <PostComponent post={post} key={post.id} disableBottomBar />
              ))
            )}
          </ScrollView>
        )}
      </CustomView>
    </SafeAreaView>
  );
}
