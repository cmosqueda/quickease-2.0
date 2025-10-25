import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";
import CustomTextInput from "../CustomTextInput";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Dispatch, SetStateAction, useState } from "react";
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
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (!tag.trim()) return;
    setTags((prev: any) => [...prev, tag.trim()]);
    setTag("");
    close();
  };

  const removeTag = (index: number) => {
    setTags((prev: any[]) => prev.filter((_, i) => i !== index));
    close();
  };


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
          <CustomTextInput
            className="rounded-xl flex-1"
            value={tag}
            onChangeText={setTag}
            enterKeyHint="done"
            onSubmitEditing={addTag}
          />
          <CustomPressable
            variant="colorBase200"
            style={{ paddingHorizontal: 16, paddingVertical: 16 }}
            className="rounded-3xl"
            onPress={addTag}
          >
            <MaterialCommunityIcons name="plus" />
          </CustomPressable>
        </View>
      </View>
      {tags && tags.length > 0 && (
        <View className="gap-2">
          <CustomText>Tags</CustomText>
          <View className="flex flex-row flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <CustomView
                key={idx}
                variant="colorPrimary"
                className="px-6 py-2 rounded-full flex flex-row gap-2 items-center"
              >
                <CustomText color="colorPrimaryContent">{tag}</CustomText>
                <Pressable onPress={() => removeTag(idx)}>
                  <CustomText color="colorPrimaryContent">
                    <MaterialCommunityIcons name="close" />
                  </CustomText>
                </Pressable>
              </CustomView>
            ))}
          </View>
        </View>
      )}
    </CustomView>
  );
};

export default TagsTray;
