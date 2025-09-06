import React from "react";
import useAuth from "@/hooks/useAuth";

import { Image } from "expo-image";
import { useAssets } from "expo-asset";
import { ViewStyle } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

type Props = {
  avatar?: string;
  size?: number;
  style?: ViewStyle;
};

export default function UserAvatar({
  avatar = useAuth.getState().user?.avatar,
  size = 28,
  style,
}: Props) {
  const [assets] = useAssets([
    require("../assets/images/avatars/blue.svg"),
    require("../assets/images/avatars/orange.svg"),
    require("../assets/images/avatars/purple.svg"),
    require("../assets/images/avatars/green.svg"),
    require("../assets/images/avatars/black_green.svg"),
    require("../assets/images/avatars/dark_blue.svg"),
    require("../assets/images/avatars/gold.svg"),
    require("../assets/images/avatars/hot_pink.svg"),
    require("../assets/images/avatars/red.svg"),
    require("../assets/images/avatars/turquoise.svg"),
  ]);

  const avatarMap: Record<string, any> = {
    blue: assets?.[0],
    orange: assets?.[1],
    purple: assets?.[2],
    green: assets?.[3],
    black_green: assets?.[4],
    dark_blue: assets?.[5],
    gold: assets?.[6],
    hot_pink: assets?.[7],
    red: assets?.[8],
    turquoise: assets?.[9],
  };

  const avatarSource = avatarMap[avatar!] ?? assets?.[0];

  if (avatarSource) {
    return (
      <Image source={avatarSource} style={{ width: size, height: size }} />
    );
  }

  return <FontAwesome6 name="user-circle" size={size} style={style} />;
}
