import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";
import CustomModal from "@/components/CustomModal";
import useTheme from "@/hooks/useTheme";
import _FONTS from "@/types/theme/Font";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dispatch, SetStateAction, useState } from "react";

const TagsModal = ({
  tags,
  setTags,
  modalVisibility,
  setModalVisibility,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string>>;
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
}) => {
  const { height } = useWindowDimensions();

  return (
    <CustomModal
      animationType="fade"
      modalVisibility={modalVisibility}
      setModalVisibility={setModalVisibility}
    >
      <KeyboardAvoidingView
        behavior="position"
      >
        <CustomView
          variant="colorBase100"
          style={{ maxHeight: height / 1.5, gap: 8 }}
          className="px-8 py-12 gap-4 rounded-tl-3xl rounded-tr-3xl"
        >
          <View className="flex flex-row gap-4 items-center">
            <CustomText>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                onPress={() => setModalVisibility(false)}
              />
            </CustomText>
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
          {tags && (
            <View className="gap-2">
              <CustomText>Tags</CustomText>
            </View>
          )}
        </CustomView>
      </KeyboardAvoidingView>
    </CustomModal>
  );
};

export default function Page() {
  const navigate = useNavigation();
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();

  const [tagsModalVisibility, setTagsModalVisibility] = useState(false);

  return (
    <SafeAreaView
      className="flex flex-1 p-4 gap-2"
      edges={["left", "right", "top"]}
      style={{ backgroundColor: currentScheme.colorBase100 }}
    >
      <View className="flex flex-row gap-2 items-center justify-between">
        <Pressable onPress={() => navigate.dispatch(CommonActions.goBack())}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <CustomPressable className="rounded-3xl" variant="colorBase300">
          <CustomText>
            <MaterialCommunityIcons name="send" size={20} />
          </CustomText>
        </CustomPressable>
      </View>
      <CustomTextInput
        style={{
          backgroundColor: "",
          paddingHorizontal: 0,
          fontFamily: _FONTS.Gabarito_900Black,
        }}
        className="text-4xl"
        placeholder="Title"
      />
      <View className="flex flex-row">
        <CustomPressable
          variant="colorBase300"
          className="rounded-3xl"
          onPress={() => setTagsModalVisibility(true)}
        >
          <CustomText>Add tags</CustomText>
        </CustomPressable>
      </View>
      <CustomTextInput
        style={{
          backgroundColor: "",
          paddingHorizontal: 0,
          fontFamily: _FONTS.Gabarito_400Regular,
        }}
        placeholder="Questions?"
      />
      <View className="flex-1" />
      <CustomView className="rounded-3xl flex flex-row gap-4 items-center">
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="copy1" size={24} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="unknowfile1" size={24} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
        >
          <CustomText>
            <AntDesign name="profile" size={24} />
          </CustomText>
        </CustomPressable>
      </CustomView>
      <TagsModal
        modalVisibility={tagsModalVisibility}
        setModalVisibility={setTagsModalVisibility}
      />
    </SafeAreaView>
  );
}
