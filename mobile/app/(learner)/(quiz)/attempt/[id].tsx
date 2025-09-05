import dayjs from "dayjs";
import useTheme from "@/hooks/useTheme";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, Pressable } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

export default function Page() {
  const { currentScheme } = useTheme();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data } = useQuery({
    queryKey: ["quiz-view-attempt", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(`/quiz/attempt/${id}`);

        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  if (!data) {
    return <SafeAreaView className="flex-1 bg-white p-4"></SafeAreaView>;
  }

  const totalQuestions = data.answer_data.length;
  const correctCount = data.answer_data.reduce((acc: any, item: any) => {
    const correct = item.question.correctAnswers;
    const user = item.user_answer;
    const isCorrect =
      correct.length === user.length &&
      correct.every((val: any) => user.includes(val));
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  return (
    <SafeAreaView
      className="flex-1 p-4 gap-4"
      style={{
        backgroundColor: currentScheme.colorBase200,
      }}
    >
      <ScrollView
        contentContainerClassName="gap-6"
        showsVerticalScrollIndicator={false}
      >
        <CustomView
          variant="colorBase200"
          className="flex flex-row justify-between items-center"
        >
          <Pressable onPress={() => router.back()}>
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <View className="items-end">
            <CustomText className="text-xs opacity-60">
              {dayjs(data.started_at).format("MMM DD, YYYY h:mm A")}
            </CustomText>
            <CustomText className="text-xl" variant="bold">
              Score: {correctCount}/{totalQuestions}
            </CustomText>
          </View>
        </CustomView>

        <View className="gap-4">
          {data.is_ai_generated && (
            <View className="flex-row items-center gap-2">
              <CustomText className="opacity-60">
                <MaterialIcons name="info" size={16} />
              </CustomText>
              <CustomText className="text-sm opacity-60">
                AI-generated
              </CustomText>
            </View>
          )}
          <View>
            <CustomText className="text-3xl" variant="black">
              {data.quiz.title}
            </CustomText>
            <CustomText className="opacity-60">
              {data.quiz.description || "No description provided"}
            </CustomText>
          </View>
        </View>

        <View className="gap-6">
          {data.answer_data.map((entry: any, index: number) => {
            const { question, user_answer } = entry;

            return (
              <CustomView
                key={index}
                className="flex flex-col gap-4 p-4 rounded-3xl"
              >
                <View className="gap-2">
                  <CustomText className="text-lg">
                    Question {index + 1}: {question.question}
                  </CustomText>
                  {question.description && (
                    <CustomText className="opacity-60">
                      {question.description}
                    </CustomText>
                  )}
                </View>

                <View className="flex flex-col gap-2">
                  {question.options.map((option: any, oIndex: number) => {
                    const isCorrect = question.correctAnswers.includes(oIndex);
                    const isUserChoice = user_answer.includes(oIndex);

                    return (
                      <CustomView
                        key={oIndex}
                        className="p-4 rounded-3xl flex-1"
                        variant={isCorrect ? "colorSuccess" : "colorBase200"}
                      >
                        <CustomText>{option}</CustomText>
                        {isUserChoice && !isCorrect && (
                          <CustomText>(your answer)</CustomText>
                        )}
                        {isCorrect && (
                          <CustomText className="text-xs opacity-60">
                            (Correct)
                          </CustomText>
                        )}
                      </CustomView>
                    );
                  })}
                </View>
              </CustomView>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
