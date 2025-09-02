import PagerView from "react-native-pager-view";
import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons } from "@expo/vector-icons";

import { useRef } from "react";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { User, Post } from "@/types/user/types";
import { useEditorBridge, RichText } from "@10play/tentap-editor";

import {
  View,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from "react-native";

import { _AVATAR_ASSET_MAP } from "@/types/user/avatars";
import { _BADGE_ASSET_MAP, _BADGE_MAP } from "@/types/user/badges";

import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "@/types/theme/TenTapThemes";

const ViewOtherProfileTray = ({
  user,
  close,
}: {
  user: User;
  close: () => void;
}) => {
  const pagerViewRef = useRef<PagerView>(null);

  const { data: _USER } = useQuery({
    enabled: !!user?.id,
    queryKey: user?.id ? [user.id] : [],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(`/users/view/${user.id}`);

        return data;
      } catch (err) {
        close();
        throw err;
      }
    },
    retry: 3,
  });

  const PostComponent = ({ post }: { post: Post }) => {
    const { currentScheme } = useTheme();
    const editor = useEditorBridge({
      theme: {
        webview: {
          padding: 8,
          backgroundColor: currentScheme.colorBase300,
        },
      },
      bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
      dynamicHeight: true,
      editable: false,
      initialContent: post.post_body,
    });

    if (editor) {
      return (
        <View>
          <CustomText
            variant="bold"
            className="text-2xl"
            color="colorBaseContent"
          >
            {post.title}
          </CustomText>
          <CustomView
            key={post.id}
            variant="colorBase300"
            className="p-4 rounded-3xl"
          >
            <RichText editor={editor} />
          </CustomView>
        </View>
      );
    }
  };

  const Badges = ({ user }: { user: User }) => {
    const badgeIds = Object.keys(_BADGE_ASSET_MAP);
    const [assets] = useAssets(Object.values(_BADGE_ASSET_MAP));

    if (!assets) return null;

    return (
      <ScrollView contentContainerClassName="flex flex-col gap-4">
        {user?.badges.map(
          (badge: { id: string; title: string; description: string }) => {
            const badgeMeta = _BADGE_MAP[badge.id];

            if (!badgeMeta) return null;

            const index = badgeIds.indexOf(badge.id);
            if (index === -1) return null;

            const asset = assets[index];

            return (
              <CustomView
                key={badge.id}
                variant="colorBase300"
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

  const Posts = ({ posts }: { posts: Post[] }) => {
    if (posts.length === 0) {
      return (
        <CustomView className="flex items-center justify-center p-4">
          <CustomText>No posts yet.</CustomText>
        </CustomView>
      );
    }

    return (
      <ScrollView
        contentContainerClassName="flex flex-col gap-4"
        style={{ maxHeight: Dimensions.get("screen").height / 1.5 }}
      >
        {posts.map((post) => {
          return <PostComponent post={post} key={post.id} />;
        })}
      </ScrollView>
    );
  };

  const Avatar = ({ user }: { user: User }) => {
    const { height } = useWindowDimensions();

    const avatarIds = Object.keys(_AVATAR_ASSET_MAP);
    const [assets] = useAssets(Object.values(_AVATAR_ASSET_MAP));

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
        {avatarAsset && (
          <Image
            source={{ uri: avatarAsset.localUri ?? avatarAsset.uri }}
            style={{ aspectRatio: 1, width: 96, height: 96 }}
          />
        )}

        <View className="items-center">
          <CustomText variant="bold" className="text-3xl">
            {user?.first_name} {user?.last_name}
          </CustomText>
        </View>
      </View>
    );
  };

  if (_USER) {
    return (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl p-4 gap-4"
      >
        <CustomText className="p-4">
          <MaterialIcons name="keyboard-arrow-left" size={24} onPress={close} />
        </CustomText>
        <Avatar user={user} />
        <PagerView
          ref={pagerViewRef}
          style={{ height: Dimensions.get("screen").height / 2, gap: 16 }}
        >
          <Badges key={0} user={_USER} />
          <Posts key={1} posts={_USER.posts} />
        </PagerView>
      </CustomView>
    );
  }
};

export default ViewOtherProfileTray;
