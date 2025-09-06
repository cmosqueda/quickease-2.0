import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import PostComponent from "@/components/PostComponent";
import CustomPressable from "@/components/CustomPressable";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Link } from "expo-router";
import { toast } from "sonner-native";
import { useTrays } from "react-native-trays";
import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList, Pressable, RefreshControl } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { isConnected } = useNetInfo();
  const { user } = useAuth();

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
    enabled: !!isConnected,
  });

  useEffect(() => {
    if (!user?.is_verified) {
      toast("Verify your email to post.", { duration: 120000 });
    }
  }, [user?.is_verified]);

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        rightSideChildren={
          isConnected && (
            <>
              <Pressable
                disabled={!isConnected}
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

              {user?.is_verified && (
                <Pressable
                  disabled={!isConnected}
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
              )}
            </>
          )
        }
      />

      <CustomView
        className="flex-1 p-4 rounded-tr-3xl rounded-tl-3xl"
        variant="colorBase300"
      >
        {data && (
          <FlatList
            data={data.pages.flatMap((page) => page.posts)}
            keyExtractor={(post) => post.id.toString()}
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
            onEndReachedThreshold={0.2}
          />
        )}
      </CustomView>

      {user?.is_verified && (
        <Link asChild href={"/post/create"}>
          <CustomPressable
            disabled={!isConnected}
            variant="colorPrimary"
            className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="post-add" size={32} />
            </CustomText>
          </CustomPressable>
        </Link>
      )}
    </SafeAreaView>
  );
}
