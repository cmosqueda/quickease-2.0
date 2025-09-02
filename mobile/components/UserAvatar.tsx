import React from "react";

import { Image } from "expo-image";
import { useAssets } from "expo-asset";
import { ViewStyle } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";

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
  ]);

  const avatarMap: Record<string, any> = {
    blue: assets?.[0],
    orange: assets?.[1],
    purple: assets?.[2],
    green: assets?.[3],
  };

  const avatarSource = avatarMap[avatar!] ?? assets?.[0];

  if (avatarSource) {
    return <Image source={avatarSource} style={{ width: 28, height: 28 }} />;
  }

  return <FontAwesome6 name="user-circle" size={size} style={style} />;
}
