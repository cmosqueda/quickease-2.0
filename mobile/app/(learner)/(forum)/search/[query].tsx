import useTheme from "@/hooks/useTheme";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import PostComponent from "@/components/PostComponent";

import { MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, Pressable, RefreshControl, FlatList } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { query } = useLocalSearchParams<{ query: string }>();
  const [sort, setSort] = useState("newest");

  const insets = useSafeAreaInsets();

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

      if (data.posts.length === 0) {
        toast("No results found.");
        router.back();
      }

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

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

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
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id.toString()}
          renderItem={({ item }) => (
            <PostComponent post={item} disableBottomBar />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
            />
          }
          contentContainerStyle={{
            gap: 16,
            paddingBottom: insets.bottom + 128,
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingNextPage ? (
              <CustomText className="text-center py-4">
                Loading more...
              </CustomText>
            ) : null
          }
        />
      </CustomView>
    </SafeAreaView>
  );
}
