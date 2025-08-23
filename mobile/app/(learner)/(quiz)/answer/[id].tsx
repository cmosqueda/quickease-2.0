import useTheme from "@/hooks/useTheme";
import _API_INSTANCE from "@/utils/axios";

import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Quiz } from "@/types/user/types";
import { Switch } from "@expo/ui/jetpack-compose";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ToastAndroid,
  Pressable,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

interface QuizQuestion {
  question: string;
  description?: string;
  options: string[];
  correctAnswers: number[];
}

interface UserAnswer {
  question: QuizQuestion;
  user_answer: number[];
}

export default function LearnerAnswerQuizPage() {
  const { currentScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: quizData, isFetching } = useQuery<Quiz>({
    queryKey: ["answer-quiz", id],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Quiz>(`/quiz/${id}`);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: !!id,
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizData?.quiz_content) {
      setUserAnswers(
        quizData.quiz_content.map((q) => ({
          question: q,
          user_answer: [],
        }))
      );
    }
  }, [quizData]);

  const currentQuestion: QuizQuestion | null =
    quizData?.quiz_content?.[questionIndex] ?? null;

  const handleOptionToggle = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      const q = updated[qIdx]?.question;

      if (!q) return prev; // guard

      if (q.correctAnswers.length > 1) {
        const selected = new Set(updated[qIdx].user_answer);
        selected.has(optIdx) ? selected.delete(optIdx) : selected.add(optIdx);
        updated[qIdx].user_answer = Array.from(selected);
      } else {
        updated[qIdx].user_answer = [optIdx];
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!quizData) return;
    setIsSubmitting(true);

    const correctCount = userAnswers.reduce((acc, ans) => {
      const correct = ans.question.correctAnswers;
      const user = ans.user_answer;
      const isCorrect =
        correct.length === user.length &&
        correct.every((v) => user.includes(v));
      return acc + (isCorrect ? 1 : 0);
    }, 0);

    try {
      const { status, data } = await _API_INSTANCE.post(
        "/quiz/submit",
        {
          quiz_id: quizData.id,
          answer_data: userAnswers,
          score: correctCount,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status === 200) {
        await checkBadges();
        ToastAndroid.show("Quiz submitted!", ToastAndroid.SHORT);
        router.push({
          pathname: "/(learner)/(quiz)/attempt/[id]",
          params: { id: data.id },
        });
      }
    } catch {
      ToastAndroid.show("Error submitting quiz.", ToastAndroid.SHORT);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: currentScheme.colorBase200 }}
      >
        <ActivityIndicator color={currentScheme.colorPrimary} size={96} />
      </SafeAreaView>
    );
  }

  if (!quizData?.quiz_content?.length) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: currentScheme.colorBase200 }}
        className="items-center justify-center"
      >
        <CustomText>No quiz data found.</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentScheme.colorBase200 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row justify-between items-center">
        <Pressable
          onPress={() => {
            Alert.alert(
              "Are you sure?",
              "By clicking yes, you agree to abandon your attempt."
            );
            router.back();
          }}
        >
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        <CustomPressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          variant="colorPrimary"
          className="flex-row gap-2 items-center rounded-3xl px-4 py-2"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialCommunityIcons name="check" size={20} />
          </CustomText>
          <CustomText color="colorPrimaryContent">Submit</CustomText>
        </CustomPressable>
      </View>

      <CustomView
        variant="colorBase100"
        className="flex-row gap-4 p-4 rounded-3xl"
      >
        <View className="flex-1 gap-4">
          {currentQuestion ? (
            <CustomView className="gap-2">
              <CustomText variant="black" className="text-xl">
                {questionIndex + 1}. {currentQuestion.question}
              </CustomText>
              <CustomText>
                {currentQuestion.description || "No description"}
              </CustomText>
              {currentQuestion.correctAnswers.length > 1 && (
                <CustomText color="colorBaseContent" className="text-sm">
                  (Multiple answers allowed)
                </CustomText>
              )}
              <CustomView variant="colorBase200" className="rounded-xl p-4">
                {currentQuestion.options.map((opt, oIdx) => (
                  <Pressable
                    key={oIdx}
                    onPress={() => handleOptionToggle(questionIndex, oIdx)}
                    className="flex flex-row gap-1 items-center"
                  >
                    <Switch
                      variant="checkbox"
                      value={userAnswers[questionIndex]?.user_answer.includes(
                        oIdx
                      )}
                    />
                    <CustomText className="flex-1">{opt}</CustomText>
                  </Pressable>
                ))}
              </CustomView>
            </CustomView>
          ) : (
            <CustomText>No question found</CustomText>
          )}
        </View>
      </CustomView>

      <View className="flex flex-row gap-2 justify-end self-end">
        {questionIndex > 0 && (
          <CustomPressable
            onPress={() => setQuestionIndex((p) => p - 1)}
            variant="colorBase300"
            className="rounded-3xl px-4 py-2"
          >
            <CustomText>Previous</CustomText>
          </CustomPressable>
        )}
        {questionIndex < quizData.quiz_content.length - 1 && (
          <CustomPressable
            onPress={() => setQuestionIndex((p) => p + 1)}
            variant="colorPrimary"
            className="rounded-3xl px-4 py-2"
          >
            <CustomText color="colorPrimaryContent">Next</CustomText>
          </CustomPressable>
        )}
      </View>
    </SafeAreaView>
  );
}
