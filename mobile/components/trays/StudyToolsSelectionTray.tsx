import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { View, Pressable } from "react-native";

const StudyToolsSelectionTray = ({
  openGenerateFromNotes,
  openUploadFile,
  close,
  type,
}: {
  openGenerateFromNotes: () => void;
  openUploadFile: () => void;
  close: () => void;
  type: "quiz" | "flashcard";
}) => {
  const { currentScheme } = useTheme();

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
          {type === "quiz" ? "Quiz" : "Flashcard"} Study Tools
        </CustomText>
      </View>
      <Pressable
        style={{ backgroundColor: currentScheme.colorBase200 }}
        className="p-6 rounded-xl flex flex-row gap-6 items-center"
        onPress={openGenerateFromNotes}
      >
        <CustomText>
          <MaterialCommunityIcons name="note-multiple" size={32} />
        </CustomText>
        <Pressable className="flex-1">
          <CustomText className="text-xl" variant="black">
            Select from notes
          </CustomText>
          <CustomText className="opacity-60">
            Generate a {type} from selecting one of your notes.
          </CustomText>
        </Pressable>
      </Pressable>
      <Pressable
        style={{ backgroundColor: currentScheme.colorBase200 }}
        className="p-6 rounded-xl flex flex-row gap-6 items-center"
        onPress={openUploadFile}
      >
        <CustomText>
          <MaterialCommunityIcons name="file-upload" size={32} />
        </CustomText>
        <View className="flex-1">
          <CustomText className="text-xl" variant="black">
            Upload file
          </CustomText>
          <CustomText className="opacity-60">
            Generate a {type} by uploading a document.
          </CustomText>
        </View>
      </Pressable>
    </CustomView>
  );
};

export default StudyToolsSelectionTray;
