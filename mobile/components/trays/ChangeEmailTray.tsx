import useAuth from "@/hooks/useAuth";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";
import CustomTextInput from "../CustomTextInput";

import { MaterialIcons } from "@expo/vector-icons";

import { User } from "@/types/user/types";
import { View } from "react-native";
import { toast } from "sonner-native";
import { useState } from "react";

import _API_INSTANCE from "@/utils/axios";

const ChangeEmailTray = ({ close }: { close: () => void }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const [email, setEmail] = useState(user?.email!);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const temp = user as User;

    try {
      const { data } = await _API_INSTANCE.put(
        "/users/edit-email",
        {
          email,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      useAuth.setState({
        user: {
          ...temp,
          email: data.user.email,
        },
      });

      close();
      toast.success("Email updated!");
    } catch {
      toast.error("Error updating email.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-8 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={close}
            />
          </CustomText>
          <View>
            <CustomText variant="bold" className="text-xl">
              Change email
            </CustomText>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <CustomText className="text-sm" style={{ opacity: 0.5 }}>
          Email
        </CustomText>
        <CustomTextInput
          value={email}
          onChangeText={setEmail}
          className="rounded-xl"
        />
      </View>
      <CustomPressable
        disabled={isUpdating}
        variant="colorBase200"
        className="rounded-3xl items-center"
        onPress={handleUpdate}
      >
        <CustomText>Update</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default ChangeEmailTray;
