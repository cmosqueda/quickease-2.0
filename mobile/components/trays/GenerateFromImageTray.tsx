import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { toast } from "sonner-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";

const GenerateFromImageTray = ({
  close,
  type,
}: {
  close: () => void;
  type: "quiz" | "flashcard" | "summary-notes";
}) => {
  const [document, setDocument] =
    useState<DocumentPicker.DocumentPickerAsset>();

  const handlePick = async () => {
    setDocument(undefined);

    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        multiple: false,
      });

      if (document.canceled === false) {
        setDocument(document.assets[0]);
        console.log(document.assets);
      } else {
        toast("Pick atleast one file.");
        close();
      }
    } catch (err) {
      toast("Error picking document file.");
    }
  };

  useEffect(() => {
    handlePick();
  }, []);

  const handleGenerateSummaryNotesFromImage = async () => {
    if (!document) {
      toast("Please pick a image first.");
      return;
    }

    try {
      setIndex(1);
      const formData = new FormData();

      formData.append("file", {
        uri: document.uri,
        name: document.name,
        type: document.mimeType,
      } as any);

      const response = await _API_INSTANCE.post(
        "ai/generate-notes-from-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10 * 60 * 1000,
        }
      );

      if (response.status === 200) {
        const data = response.data;

        await AsyncStorage.setItem(
          "app-ai-generated-note",
          JSON.stringify(data)
        );

        router.push("/(learner)/(note)/ai/generated");
      } else {
        console.error("Upload failed:", response.data.message);
        toast("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast("Something went wrong uploading file.");
    } finally {
      setIndex(0);
      setDocument(undefined);
      close();
    }
  };

  const [index, setIndex] = useState(0);
  const tabs = [
    <>
      <View className="flex flex-row gap-4 items-center">
        <CustomText>
          <MaterialIcons name="keyboard-arrow-left" size={24} onPress={close} />
        </CustomText>
        <View>
          <CustomText variant="bold" className="text-xl">
            Generate {type === "quiz" ? "quiz" : "flashcards"} from notes
          </CustomText>
        </View>
      </View>
      {document && (
        <>
          <CustomView
            variant="colorBase200"
            className="flex flex-row gap-4 items-center p-4 rounded-3xl"
          >
            <CustomText>
              <MaterialCommunityIcons name="file" size={28} />
            </CustomText>
            <View className="flex-1 items-center">
              <CustomText className="text-lg flex-1" variant="bold">
                {document.name}
              </CustomText>
            </View>
          </CustomView>
          <CustomPressable
            variant="colorBase300"
            className="items-center justify-center rounded-2xl"
            onPress={() => {
              handleGenerateSummaryNotesFromImage();
            }}
          >
            <CustomText>Generate summary note</CustomText>
          </CustomPressable>
        </>
      )}
    </>,
    <>
      <View className="py-8 items-center justify-center">
        <CustomText>
          <ActivityIndicator
            size={72}
            color={useTheme.getState().currentScheme.colorPrimary}
          />
        </CustomText>
        <CustomText variant="bold" className="text-xl">
          Generating...
        </CustomText>
      </View>
    </>,
  ];

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
    >
      {tabs[index]}
    </CustomView>
  );
};

export default GenerateFromImageTray;
