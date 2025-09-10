import useTheme from "@/hooks/useTheme";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import PostComponent from "@/components/PostComponent";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { View, Pressable, RefreshControl, FlatList } from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { query } = useLocalSearchParams<{ query: string }>();
  const [sort, setSort] = useState("newest");
  const [index, setIndex] = useState(0);

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
        variant="colorBase100"
        className="px-8 flex flex-row justify-evenly items-center relative gap-4"
      >
        <Pressable
          onPress={() => {
            setIndex(0);
            setSort("newest");
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center text-sm">Newest</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 0 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(1);
            setSort("top");
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center text-sm">Top upvotes</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 1 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(2);
            setSort("comments");
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center text-sm">Most comments</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 2 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
      </CustomView>

      <CustomView
        className="p-4 rounded-tr-3xl rounded-tl-3xl flex-1"
        variant="colorBase300"
      >
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
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
            paddingBottom: insets.bottom + 48,
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="flex flex-row gap-4 items-center">
                <CustomText className="text-center py-4">
                  <MaterialCommunityIcons name="ellipse" />
                </CustomText>
                <CustomText className="text-center py-4">
                  <MaterialCommunityIcons name="ellipse" />
                </CustomText>
                <CustomText className="text-center py-4">
                  <MaterialCommunityIcons name="ellipse" />
                </CustomText>
                <CustomText className="text-center py-4">
                  <MaterialCommunityIcons name="ellipse" />
                </CustomText>
              </View>
            ) : null
          }
        />
      </CustomView>
    </SafeAreaView>
  );
}
