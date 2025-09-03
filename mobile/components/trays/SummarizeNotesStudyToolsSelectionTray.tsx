import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { View, Pressable } from "react-native";

const SummarizeNotesStudyToolsSelectionTray = ({
  openUploadDocument,
  openUploadImage,
  close,
}: {
  openUploadDocument: () => void;
  openUploadImage: () => void;
  close: () => void;
}) => {
  const { currentScheme } = useTheme();

  const { user } = useAuth();

  if (!user?.is_verified) {
    return (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
      >
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={close}
            />
          </CustomText>
        </View>
        <View className="gap-2 items-center justify-center">
          <CustomText>
            <MaterialCommunityIcons name="alert-circle" size={64} />
          </CustomText>
          <CustomText className="text-4xl text-center" variant="bold">
            Verify your email
          </CustomText>
          <CustomText className="text-center opacity-70">
            To use AI Study Tools, verify your email. This helps us prevent
            fraudulent activity & spam.
          </CustomText>
        </View>
      </CustomView>
    );
  }

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
    >
      <View className="flex flex-row gap-4 items-center">
        <CustomText>
          <MaterialIcons name="keyboard-arrow-left" size={24} onPress={close} />
        </CustomText>
        <CustomText variant="bold" className="text-xl">
          Notes Study Tools
        </CustomText>
      </View>
      <Pressable
        style={{ backgroundColor: currentScheme.colorBase200 }}
        className="p-6 rounded-xl flex flex-row gap-6 items-center"
        onPress={openUploadDocument}
      >
        <CustomText>
          <MaterialCommunityIcons name="file-upload" size={32} />
        </CustomText>
        <View className="flex-1">
          <CustomText className="text-xl" variant="black">
            Upload document
          </CustomText>
          <CustomText className="opacity-60">
            Generate a summary note by uploading a document.
          </CustomText>
        </View>
      </Pressable>
      <Pressable
        style={{ backgroundColor: currentScheme.colorBase200 }}
        className="p-6 rounded-xl flex flex-row gap-6 items-center"
        onPress={openUploadImage}
      >
        <CustomText>
          <MaterialCommunityIcons name="file-upload" size={32} />
        </CustomText>
        <View className="flex-1">
          <CustomText className="text-xl" variant="black">
            Upload image
          </CustomText>
          <CustomText className="opacity-60">
            Generate a summary note by uploading an image.
          </CustomText>
        </View>
      </Pressable>
    </CustomView>
  );
};

export default SummarizeNotesStudyToolsSelectionTray;
