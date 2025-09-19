import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { useQuery } from "@tanstack/react-query";
import { QuizAttempt } from "@/types/user/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Pressable, useWindowDimensions } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [index, setIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  const { data } = useQuery({
    queryKey: ["quiz-view-attempt", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get<QuizAttempt>(
          `/quiz/attempt/${id}`
        );

        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  if (!data) {
    return <SafeAreaView className="flex-1 bg-white p-4"></SafeAreaView>;
  }

  const correctCount = data.answer_data.reduce((acc: any, item: any) => {
    const correct = item.question.correctAnswers;
    const user = item.user_answer;
    const isCorrect =
      correct.length === user.length &&
      correct.every((val: any) => user.includes(val));
    return acc + (isCorrect ? 1 : 0);
  }, 0);
  const percent =
    data.answer_data.length > 0
      ? Math.round((correctCount / data.answer_data.length) * 100)
      : 0;

  return (
    <SafeAreaView
      className="flex-1 p-4 gap-4"
      style={{
        backgroundColor: currentScheme.colorBase300,
      }}
    >
      <PagerView
        initialPage={0}
        style={{ flex: 1 }}
        onPageScroll={(e) => setIndex(e.nativeEvent.position)}
        ref={pagerViewRef}
      >
        <View key={0} className="flex-1 gap-4">
          <View className="gap-2">
            <Pressable onPress={() => router.back()}>
              <CustomText>
                <MaterialIcons name="keyboard-arrow-left" size={36} />
              </CustomText>
            </Pressable>
            {data.quiz.is_ai_generated && (
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
              {data.quiz.description && (
                <CustomText className="opacity-60">
                  {data.quiz.description}
                </CustomText>
              )}
            </View>
          </View>
          <CustomView
            className="self-center p-8 rounded-3xl items-center justify-center"
            variant="colorBase100"
            style={{ width: width / 1.1 }}
          >
            <CustomText>
              <MaterialCommunityIcons name="close" size={64} />
            </CustomText>
            <CustomText className="opacity-50">
              {correctCount} out of {data.answer_data.length}
            </CustomText>
            <CustomText className="text-3xl" variant="bold">
              {percent}%
            </CustomText>
          </CustomView>
          <Pressable
            style={{
              backgroundColor: currentScheme.colorPrimary,
            }}
            className="flex flex-row gap-4 items-center p-4 rounded-3xl"
            onPress={() => {
              setIndex(1);
              pagerViewRef.current?.setPage(1);
            }}
          >
            <CustomText color="colorPrimaryContent">
              <MaterialCommunityIcons name="eye-refresh" size={32} />
            </CustomText>
            <CustomText color="colorPrimaryContent" variant="bold">
              Review quiz
            </CustomText>
          </Pressable>
        </View>
        <ScrollView
          key={1}
          contentContainerClassName="gap-6"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()}>
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <View className="gap-2">
            {data.quiz.is_ai_generated && (
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
              {data.quiz.description && (
                <CustomText className="opacity-60">
                  {data.quiz.description}
                </CustomText>
              )}
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
                      const isCorrect =
                        question.correctAnswers.includes(oIndex);
                      const isUserChoice = user_answer.includes(oIndex);

                      return (
                        <CustomView
                          key={oIndex}
                          className="p-4 rounded-3xl flex-1"
                          variant={isCorrect ? "colorSuccess" : "colorBase200"}
                        >
                          <CustomText
                            color={
                              isCorrect
                                ? "colorSuccessContent"
                                : "colorBaseContent"
                            }
                          >
                            {option}
                          </CustomText>
                          {isUserChoice && !isCorrect && (
                            <CustomText color="colorSuccessContent">
                              (your answer)
                            </CustomText>
                          )}
                          {isCorrect && (
                            <CustomText
                              color="colorSuccessContent"
                              className="text-xs opacity-60"
                            >
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
      </PagerView>
    </SafeAreaView>
  );
}
