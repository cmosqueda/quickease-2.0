import CustomText from "./CustomText";
import CustomView from "./CustomView";
import UserAvatar from "./UserAvatar";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Post } from "@/types/user/types";
import { Link } from "expo-router";
import { useVote } from "@/hooks/useVote";
import { useNetInfo } from "@react-native-community/netinfo";
import { Pressable, View } from "react-native";
import useAuth from "@/hooks/useAuth";

export default function PostComponent({
  post,
  disableBottomBar = false,
}: {
  post: Post;
  disableBottomBar?: boolean;
}) {
  const { user } = useAuth();
  const { isConnected } = useNetInfo();
  const { mutate: voteOnPost, isPending } = useVote([["recent-posts"]]);

  if (!post) return null;

  return (
    <CustomView variant="colorBase100" className="rounded-3xl">
      <Link
        href={{
          pathname: "/post/view/[id]",
          params: { id: post.id },
        }}
        asChild
        className="rounded-3xl"
      >
        <Pressable
          className="disabled:opacity-50 rounded-3xl"
          disabled={!isConnected}
        >
          <CustomView variant="colorBase100" className="gap-2 p-4 rounded-3xl">
            <View className="flex flex-row gap-3 items-center">
              <UserAvatar avatar={post.user?.avatar!} />
              <CustomText color="colorBaseContent">
                {post.user?.first_name} {post.user?.last_name}
              </CustomText>
            </View>

            <CustomText className="text-2xl" variant="bold">
              {post.title}
            </CustomText>

            {post.tags.length > 0 && (
              <View className="flex flex-row flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <CustomView
                    key={tag.tag_id}
                    variant="colorPrimary"
                    className="px-4 py-1 rounded-3xl"
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

      {isConnected && !disableBottomBar && (
        <CustomView
          variant="colorPrimary"
          className="flex flex-row gap-4 items-center px-6 py-4 rounded-3xl"
        >
          <Pressable
            disabled={isPending}
            onPress={() => voteOnPost({ post_id: post.id, vote_type: 1 })}
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="keyboard-arrow-up" size={24} />
            </CustomText>
          </Pressable>

          <CustomText variant="bold" color="colorPrimaryContent">
            {post.vote_sum}
          </CustomText>

          <Pressable
            disabled={isPending}
            onPress={() => voteOnPost({ post_id: post.id, vote_type: -1 })}
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="keyboard-arrow-down" size={24} />
            </CustomText>
          </Pressable>

          <View className="flex-1" />

          <View className="flex flex-row items-center gap-4">
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
                  <CustomText color="colorPrimaryContent">
                    <MaterialCommunityIcons name="clipboard-edit" size={24} />
                  </CustomText>
                  <CustomText color="colorPrimaryContent">Edit</CustomText>
                </Pressable>
              </Link>
            )}

            <Link
              href={{
                pathname: "/post/view/[id]",
                params: { id: post.id },
              }}
              asChild
              className="rounded-3xl"
            >
              <Pressable className="flex flex-row gap-2 items-center">
                <CustomText color="colorPrimaryContent">
                  <MaterialCommunityIcons name="comment" size={24} />
                </CustomText>
                <CustomText color="colorPrimaryContent">
                  {post.comments.length}
                </CustomText>
              </Pressable>
            </Link>
          </View>
        </CustomView>
      )}
    </CustomView>
  );
}
