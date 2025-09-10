import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { useTrays } from "react-native-trays";
import { useAssets } from "expo-asset";
import { useNetInfo } from "@react-native-community/netinfo";
import { Post, User } from "@/types/user/types";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useRef, useState } from "react";
import { RichText, useEditorBridge } from "@10play/tentap-editor";
import { View, Pressable, useWindowDimensions, ScrollView } from "react-native";

import { _AVATAR_ASSET_MAP } from "@/types/user/avatars";
import { _BADGE_ASSET_MAP, _BADGE_MAP } from "@/types/user/badges";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

const PostComponent = ({ post }: { post: Post }) => {
  const { currentScheme } = useTheme();
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
    initialContent: post.post_body,
  });

  if (editor) {
    return (
      <Link
        asChild
        href={{
          pathname: "/(learner)/(forum)/post/view/[id]",
          params: { id: post.id },
        }}
      >
        <Pressable>
          <CustomText
            variant="bold"
            className="text-2xl"
            color="colorBaseContent"
          >
            {post.title}
          </CustomText>
          <CustomView
            key={post.id}
            variant="colorBase100"
            className="p-4 rounded-3xl"
          >
            <RichText editor={editor} />
          </CustomView>
        </Pressable>
      </Link>
    );
  }
};

const Badges = ({ user }: { user: User }) => {
  const badgeIds = Object.keys(_BADGE_ASSET_MAP);
  const [assets] = useAssets(Object.values(_BADGE_ASSET_MAP));

  if (!assets) return null;

  if (!user.badges) {
    return (
      <CustomView className="flex items-center justify-center p-4 rounded-3xl">
        <CustomText>No badges yet.</CustomText>
      </CustomView>
    );
  }

  return (
    <ScrollView contentContainerClassName="flex flex-col gap-4">
      {user.badges &&
        user?.badges.map(
          (badge: { id: string; title: string; description: string }) => {
            const badgeMeta = _BADGE_MAP[badge.id];

            if (!badgeMeta) return null;

            const index = badgeIds.indexOf(badge.id);
            if (index === -1) return null;

            const asset = assets[index];

            return (
              <CustomView
                key={badge.id}
                variant="colorBase100"
                className="p-4 flex flex-row gap-4 items-center rounded-3xl"
              >
                <Image
                  source={{ uri: asset.localUri ?? asset.uri }}
                  style={{ width: 84, height: 84, aspectRatio: 1 }}
                />
                <View className="flex-1">
                  <CustomText
                    variant="bold"
                    className="text-lg"
                    color="colorBaseContent"
                  >
                    {badgeMeta.name}
                  </CustomText>
                  <CustomText color="colorBaseContent">
                    {badgeMeta.description}
                  </CustomText>
                </View>
              </CustomView>
            );
          }
        )}
    </ScrollView>
  );
};

const Posts = ({ user }: { user: User }) => {
  const { isConnected } = useNetInfo();
  const { data, isFetching, isError } = useQuery<Post[]>({
    queryKey: [user.id, "user-posts"],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Post[]>("forum/");
      return data;
    },
    enabled: !!isConnected,
    retry: 3,
  });

  if (isFetching) {
    return (
      <CustomView className="flex items-center justify-center p-4 rounded-3xl">
        <CustomText>Loading posts…</CustomText>
      </CustomView>
    );
  }

  if (isError || !data) {
    return (
      <CustomView className="flex items-center justify-center p-4">
        <CustomText>Failed to load posts.</CustomText>
      </CustomView>
    );
  }

  if (data.length === 0) {
    return (
      <CustomView className="flex items-center justify-center p-4 rounded-3xl">
        <CustomText>No posts yet.</CustomText>
      </CustomView>
    );
  }

  return (
    <ScrollView contentContainerClassName="flex flex-col gap-4">
      {data.map((post) => {
        return <PostComponent post={post} key={post.id} />;
      })}
    </ScrollView>
  );
};

const Avatar = ({ user }: { user: User }) => {
  const { height } = useWindowDimensions();
  const { currentScheme } = useTheme();

  const avatarIds = Object.keys(_AVATAR_ASSET_MAP);
  const [assets] = useAssets(Object.values(_AVATAR_ASSET_MAP));

  const { push: openAvatarTray, pop: closeAvatarTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  if (!assets) return null;

  // Fallback if user.avatar is missing/invalid
  const avatarId =
    user?.avatar && avatarIds.includes(user.avatar) ? user.avatar : "blue";

  const avatarIndex = avatarIds.indexOf(avatarId);
  const avatarAsset = assets[avatarIndex];

  return (
    <View
      style={{ height: height / 6 }}
      className="flex gap-4 items-center justify-center"
    >
      <Pressable
        className="relative"
        onPress={() =>
          openAvatarTray("ChangeAvatarTray", {
            close: closeAvatarTray,
            avatars: assets,
          })
        }
      >
        <CustomText
          className="bottom-0 absolute z-50 p-1 rounded-full"
          style={{
            backgroundColor: currentScheme.colorBase300,
          }}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={16} />
        </CustomText>

        {avatarAsset && (
          <Image
            source={{ uri: avatarAsset.localUri ?? avatarAsset.uri }}
            style={{ aspectRatio: 1, width: 96, height: 96 }}
          />
        )}
      </Pressable>

      <View className="items-center">
        <CustomText variant="bold" className="text-3xl">
          {user?.first_name} {user?.last_name}
        </CustomText>
        {user?.flashcards &&
          user?.quizzes &&
          user!.flashcards.length > 0 &&
          user!.quizzes.length > 0 && (
            <View className="flex flex-row items-center justify-evenly gap-2">
              <CustomText>
                {user?.flashcards.length} flashcards created
              </CustomText>
              <CustomText>•</CustomText>
              <CustomText>{user?.quizzes.length} quiz created</CustomText>
            </View>
          )}
      </View>
    </View>
  );
};

export default function Page() {
  const { user } = useAuth();
  const { currentScheme } = useTheme();

  const navigation = useNavigation();
  const pagerViewRef = useRef<PagerView>(null);

  const [index, setIndex] = useState(0);

  if (!user) return null;

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <View className="flex flex-row justify-between items-center px-4 py-2">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <CustomText>
            <Entypo name="menu" size={26} />
          </CustomText>
        </Pressable>
      </View>
      <Avatar user={user} />
      <CustomView
        className="flex-1 p-4 mt-8 rounded-tl-3xl rounded-tr-3xl gap-4"
        variant="colorBase200"
      >
        <View className="flex flex-row gap-2">
          <CustomPressable
            variant={index == 0 ? "colorPrimary" : "colorBase300"}
            className="flex-1 rounded-3xl flex flex-row gap-2 justify-center"
            onPress={() => {
              setIndex(0);
              pagerViewRef.current?.setPage(0);
            }}
          >
            <CustomText
              color={index == 0 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Badges
            </CustomText>
          </CustomPressable>
          <CustomPressable
            variant={index == 1 ? "colorPrimary" : "colorBase300"}
            className="flex-1 rounded-3xl flex flex-row gap-2 justify-center"
            onPress={() => {
              setIndex(1);
              pagerViewRef.current?.setPage(1);
            }}
          >
            <CustomText
              color={index == 1 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Posts
            </CustomText>
          </CustomPressable>
        </View>
        <PagerView style={{ flex: 1 }} scrollEnabled={false} ref={pagerViewRef}>
          <Badges key={0} user={user} />
          <Posts key={1} user={user} />
        </PagerView>
      </CustomView>
    </SafeAreaView>
  );
}
