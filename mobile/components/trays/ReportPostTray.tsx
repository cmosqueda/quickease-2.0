import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialIcons } from "@expo/vector-icons";

import { Post } from "@/types/user/types";
import { toast } from "sonner-native";
import { useState } from "react";
import { View, Dimensions } from "react-native";

import CustomTextInput from "../CustomTextInput";
import _API_INSTANCE from "@/utils/axios";

const ReportPostTray = ({ post, close }: { post: Post; close: () => void }) => {
  const { currentScheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason) {
      toast("No reason at all?");
      return;
    }
    setIsSubmitting(true);

    try {
      await _API_INSTANCE.put(
        "/forum/post/report",
        {
          description: reason,
          post_id: post?.id,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );
      toast.success("Reported.");
    } catch (err) {
      toast.error("Error reporting post.");
    } finally {
      setIsSubmitting(false);
      close();
    }
  };

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-4 gap-4 flex-1"
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
              Report post
            </CustomText>
            <CustomText className="text-sm">{post.title}</CustomText>
          </View>
        </View>
      </View>
      <CustomTextInput
        multiline={true}
        verticalAlign="top"
        style={{
          backgroundColor: currentScheme.colorBase100,
          maxHeight: Dimensions.get("screen").height / 2.8,
        }}
        placeholder="Reasons why?"
        value={reason}
        onChangeText={setReason}
      />
      <CustomPressable
        className="rounded-3xl items-center"
        variant="colorBase300"
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <CustomText>Report</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default ReportPostTray;
