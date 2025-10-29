import dayjs from "dayjs";
import useTheme from "@/hooks/useTheme";
import useAuth from "@/hooks/useAuth";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialIcons } from "@expo/vector-icons";

import { Note } from "@/types/user/types";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import _API_INSTANCE from "@/utils/axios";

const GenerateFromNotesTray = ({
  close,
  type,
}: {
  close: () => void;
  type: "quiz" | "flashcard";
}) => {
  const { user } = useAuth();
  const { height } = useWindowDimensions();
  const { currentScheme } = useTheme();

  const [index, setIndex] = useState(0);

  const handleGenerateQuiz = async (id: string) => {
    setIndex(1);

    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-quiz-from-note",
        {
          note_id: id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      await AsyncStorage.setItem("app-ai-generated-quiz", JSON.stringify(data));

      router.push("/(learner)/(quiz)/ai/generated");
      close();
    } catch (err) {
      toast.error("Error generating content.");
      throw err;
    }
  };

  const handleGenerateFlashcards = async (id: string) => {
    setIndex(1);

    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-flashcards-from-note",
        {
          note_id: id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      await AsyncStorage.setItem(
        "app-ai-generated-flashcards",
        JSON.stringify(data)
      );

      router.push("/(learner)/(flashcard)/ai/generated");
      close();
    } catch (err) {
      toast.error("Error generating content.");
      throw err;
    }
  };

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
          <CustomText className="text-sm opacity-60">Select a note</CustomText>
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-4">
        {user?.notes
          .map((note: Note) => (
            <Pressable
              key={note.id}
              onPress={() => {
                if (type == "quiz") {
                  handleGenerateQuiz(note.id);
                } else {
                  handleGenerateFlashcards(note.id);
                }
              }}
            >
              <CustomView
                variant="colorPrimary"
                className="p-6 rounded-xl gap-2"
              >
                {note.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText color="colorPrimaryContent">
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText color="colorPrimaryContent">
                      AI-Generated
                    </CustomText>
                  </View>
                )}
                <CustomText
                  color="colorPrimaryContent"
                  className="text-sm opacity-70"
                >
                  {dayjs(note.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
                <CustomText
                  color="colorPrimaryContent"
                  variant="bold"
                  className="text-3xl"
                >
                  {note.title}
                </CustomText>
              </CustomView>
            </Pressable>
          ))}
      </ScrollView>
    </>,
    <>
      <View className="py-8 items-center justify-center">
        <CustomText>
          <ActivityIndicator size={72} color={currentScheme.colorPrimary} />
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
      style={{ maxHeight: height / 1.2 }}
    >
      {tabs[index]}
    </CustomView>
  );
};

export default GenerateFromNotesTray;
