import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { router } from "expo-router";
import { Flashcard, Note, Quiz } from "@/types/user/types";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

const PostAttachmentsSelectionTray = ({
  selectedFlashcards,
  setSelectedFlashcards,
  selectedNotes,
  setSelectedNotes,
  selectedQuizzes,
  setSelectedQuizzes,
  close,
}: {
  selectedFlashcards: Flashcard[];
  setSelectedFlashcards: Dispatch<SetStateAction<Flashcard[]>>;
  selectedNotes: Note[];
  setSelectedNotes: Dispatch<SetStateAction<Note[]>>;
  selectedQuizzes: Quiz[];
  setSelectedQuizzes: Dispatch<SetStateAction<Quiz[]>>;
  close: () => void;
}) => {
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();
  const { currentScheme } = useTheme();
  const [index, setIndex] = useState(0);

  const handleToggle = <T extends { id: string }>(
    item: T,
    selected: T[],
    setSelected: Dispatch<SetStateAction<T[]>>
  ) => {
    const isSelected = selected.some((i) => i.id === item.id);
    if (isSelected) {
      setSelected((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSelected((prev) => [...prev, item]);
    }

    close();
  };

  const tabs = [
    // Notes
    <Fragment key={"notes"}>
      <View className="flex gap-4 px-4">
        <CustomText className="text-3xl" variant="bold">
          Notes
        </CustomText>
      </View>
      <ScrollView
        contentContainerClassName="flex flex-col gap-4 px-4 py-4"
        className="rounded-tr-3xl rounded-tl-3xl"
        style={{ backgroundColor: currentScheme.colorBase300 }}
        key={0}
      >
        {user?.notes.map((note: Note) => {
          const isSelected = selectedNotes.some((n) => n.id === note.id);

          return (
            <Pressable
              key={note.id}
              className="disabled:opacity-70 relative"
              onPress={() =>
                handleToggle(note, selectedNotes, setSelectedNotes)
              }
            >
              <CustomView className="p-6 rounded-xl gap-2 ">
                {note.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText>
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText>AI-Generated</CustomText>
                  </View>
                )}
                <CustomText className="text-sm opacity-40">
                  {dayjs(note.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
                <CustomText variant="bold" className="text-3xl">
                  {note.title}
                </CustomText>
              </CustomView>
              {isSelected && (
                <CustomText className="absolute right-4 top-4">
                  <MaterialCommunityIcons name="check" size={24} />
                </CustomText>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Fragment>,
    // Quizzes
    <Fragment key={"quizzes"}>
      <View className="flex gap-4 px-4">
        <CustomText className="text-3xl" variant="bold">
          Quizzes
        </CustomText>
      </View>
      <ScrollView
        contentContainerClassName="flex flex-col gap-4 px-4 py-4"
        className="rounded-tr-3xl rounded-tl-3xl"
        style={{ backgroundColor: currentScheme.colorBase300 }}
        key={1}
      >
        {user?.quizzes.map((quiz: Quiz) => {
          const isSelected = selectedQuizzes.some((q) => q.id === quiz.id);
          return (
            <Pressable
              key={quiz.id}
              className="disabled:opacity-70 relative"
              onPress={() =>
                handleToggle(quiz, selectedQuizzes, setSelectedQuizzes)
              }
              onLongPress={() =>
                router.push({
                  pathname: "/(learner)/(quiz)/view/[id]",
                  params: { id: quiz.id },
                })
              }
            >
              <CustomView className="p-6 rounded-xl gap-2">
                {quiz.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText>
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText>AI-Generated</CustomText>
                  </View>
                )}
                <CustomText className="text-sm opacity-40">
                  {dayjs(quiz.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
                <CustomText variant="bold" className="text-3xl">
                  {quiz.title}
                </CustomText>
              </CustomView>
              {isSelected && (
                <CustomText className="absolute right-4 top-4">
                  <MaterialCommunityIcons name="check" size={24} />
                </CustomText>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Fragment>,
    // Flashcards
    <Fragment key={"flashcards"}>
      <View className="flex gap-4 px-4">
        <CustomText className="text-3xl" variant="bold">
          Flashcards
        </CustomText>
      </View>
      <ScrollView
        contentContainerClassName="flex flex-col gap-4 px-4 py-4"
        className="rounded-tr-3xl rounded-tl-3xl"
        style={{ backgroundColor: currentScheme.colorBase300 }}
        key={2}
      >
        {user?.flashcards.map((flashcard: Flashcard) => {
          const isSelected = selectedFlashcards.some(
            (f) => f.id === flashcard.id
          );
          return (
            <Pressable
              key={flashcard.id}
              className="disabled:opacity-70 relative"
              onPress={() =>
                handleToggle(
                  flashcard,
                  selectedFlashcards,
                  setSelectedFlashcards
                )
              }
              onLongPress={() =>
                router.push({
                  pathname: "/(learner)/(flashcard)/view/[id]",
                  params: { id: flashcard.id },
                })
              }
            >
              <CustomView className="p-6 rounded-xl gap-2">
                {flashcard.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText>
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText>AI-Generated</CustomText>
                  </View>
                )}
                <CustomText className="text-sm opacity-40">
                  {dayjs(flashcard.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
                <CustomText variant="bold" className="text-3xl">
                  {flashcard.title}
                </CustomText>
              </CustomView>
              {isSelected && (
                <CustomText className="absolute right-4 top-4">
                  <MaterialCommunityIcons name="check" size={24} />
                </CustomText>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Fragment>,
  ];

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl gap-4"
      style={{ maxHeight: height / 1.1 }}
    >
      <View className="flex flex-row gap-4 items-center px-4 pt-8">
        <CustomText>
          <MaterialIcons name="keyboard-arrow-left" size={24} onPress={close} />
        </CustomText>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl flex-1 justify-center"
          variant={index === 0 ? "colorPrimary" : "colorBase300"}
          onPress={() => setIndex(0)}
        >
          <CustomText
            color={index === 0 ? "colorPrimaryContent" : "colorBaseContent"}
          >
            <AntDesign name="copy1" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl flex-1 justify-center"
          variant={index === 1 ? "colorPrimary" : "colorBase300"}
          onPress={() => setIndex(1)}
        >
          <CustomText
            color={index === 1 ? "colorPrimaryContent" : "colorBaseContent"}
          >
            <AntDesign name="unknowfile1" size={20} />
          </CustomText>
        </CustomPressable>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl flex-1 justify-center"
          variant={index === 2 ? "colorPrimary" : "colorBase300"}
          onPress={() => setIndex(2)}
        >
          <CustomText
            color={index === 2 ? "colorPrimaryContent" : "colorBaseContent"}
          >
            <AntDesign name="profile" size={20} />
          </CustomText>
        </CustomPressable>
      </View>
      {tabs[index]}
    </CustomView>
  );
};

export default PostAttachmentsSelectionTray;
