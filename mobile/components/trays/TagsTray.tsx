import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";
import CustomTextInput from "../CustomTextInput";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Dispatch, SetStateAction } from "react";
import { Dimensions, View, Pressable } from "react-native";

const TagsTray = ({
  tags,
  setTags,
  close,
}: {
  tags: any[];
  setTags: Dispatch<SetStateAction<any>>;
  close: () => void;
}) => {
  return (
    <CustomView
      variant="colorBase100"
      style={{ maxHeight: Dimensions.get("screen").height / 1.5, gap: 8 }}
      className="p-8 gap-4 rounded-tl-3xl rounded-tr-3xl"
    >
      <View className="flex flex-row gap-4 items-center">
        <Pressable onPress={close}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={24} />
          </CustomText>
        </Pressable>
        <CustomText variant="bold" className="text-4xl">
          Tags
        </CustomText>
      </View>
      <View className="gap-2">
        <CustomText>Add tag</CustomText>
        <View className="flex flex-row gap-4 items-center">
          <CustomTextInput className="rounded-xl flex-1" />
          <CustomPressable
            variant="colorBase200"
            style={{ paddingHorizontal: 16, paddingVertical: 16 }}
            className="rounded-3xl"
          >
            <MaterialCommunityIcons name="plus" />
          </CustomPressable>
        </View>
      </View>
      {tags && tags.length > 0 && (
        <View className="gap-2">
          <CustomText>Tags</CustomText>
        </View>
      )}
    </CustomView>
  );
};

export default TagsTray;
