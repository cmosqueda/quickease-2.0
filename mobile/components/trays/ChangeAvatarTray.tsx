import useAuth from "@/hooks/useAuth";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { User } from "@/types/user/types";
import { Image } from "expo-image";
import { toast } from "sonner-native";
import { Asset } from "expo-asset";
import { useState } from "react";
import { View, Pressable } from "react-native";

import _API_INSTANCE from "@/utils/axios";

const ChangeAvatarTray = ({
  avatars,
  close,
}: {
  avatars: Asset[];
  close: () => void;
}) => {
  const { user, setUser } = useAuth();
  const avatarIndex = [
    "blue",
    "green",
    "orange",
    "purple",
    "black_green",
    "dark_blue",
    "gold",
    "hot_pink",
    "red",
    "turquoise",
  ];

  const initialIndex = user ? avatarIndex.indexOf(user?.avatar!) : 0;
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    const temp = user as User;

    try {
      const { status } = await _API_INSTANCE.put(
        "/users/change-avatar",
        {
          avatar_id: avatarIndex[selectedAvatar],
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status === 200) {
        setUser({ ...temp, avatar: avatarIndex[selectedAvatar] });
        close();
      }
    } catch (err: any) {
      toast(err.message || "Error updating avatar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-8 gap-8"
    >
      <CustomText>
        <MaterialIcons name="close" size={24} onPress={close} />
      </CustomText>

      <View className="gap-4 flex flex-row items-center justify-center flex-wrap">
        {avatars.map((avatar: any, index: number) => (
          <Pressable
            key={index}
            className="relative"
            onPress={() => setSelectedAvatar(index)}
          >
            {selectedAvatar === index && (
              <CustomText color="colorBase300" className="absolute top-0 z-50">
                <MaterialCommunityIcons name="check-circle" size={24} />
              </CustomText>
            )}

            <Image
              source={avatar.localUri}
              style={{ width: 64, height: 64, aspectRatio: "1/1" }}
            />
          </Pressable>
        ))}
      </View>

      <CustomPressable
        variant="colorBase200"
        className="rounded-3xl items-center"
        disabled={isSaving}
        onPress={handleUpdate}
      >
        <CustomText>{isSaving ? "Saving..." : "Save"}</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default ChangeAvatarTray;
