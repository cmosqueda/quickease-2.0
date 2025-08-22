import useTheme from "@/hooks/useTheme";
import _API_INSTANCE from "@/utils/axios";

import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Switch } from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ToastAndroid, Pressable, View, Alert } from "react-native";

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
  const params = useLocalSearchParams<{ id: string }>();

  const [quizData, setQuizData] = useState<{
    id: string;
    title: string;
    description: string;
    is_ai_generated: boolean;
    quiz_content: QuizQuestion[];
  }>({
    id: params.id || "demo",
    title: "Sample Quiz",
    description: "This is a test quiz.",
    is_ai_generated: false,
    quiz_content: [
      {
        question: "What is 2+2?",
        description: "Simple math",
        options: ["1", "2", "3", "4"],
        correctAnswers: [3],
      },
      {
        question: "Select prime numbers",
        description: "",
        options: ["2", "3", "4", "5"],
        correctAnswers: [0, 1, 3],
      },
    ],
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    quizData.quiz_content.map((q) => ({
      question: q,
      user_answer: [],
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizData.quiz_content[questionIndex];

  const handleOptionToggle = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      const q = updated[qIdx].question;

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
    } catch (err) {
      ToastAndroid.show("Error submitting quiz.", ToastAndroid.SHORT);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <View className="gap-2">
        <CustomText>Questions</CustomText>
        <CustomView className="p-4 rounded-3xl flex flex-row gap-2">
          {quizData.quiz_content.map((_, idx) => (
            <CustomPressable
              key={idx}
              onPress={() => setQuestionIndex(idx)}
              className="items-center justify-center rounded-xl p-2"
              variant={
                userAnswers[idx].user_answer.length > 0
                  ? "colorPrimary"
                  : "colorBase300"
              }
            >
              <CustomText>{idx + 1}</CustomText>
            </CustomPressable>
          ))}
        </CustomView>
      </View>

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
              <CustomView
                variant="colorBase200"
                className="rounded-xl p-4 gap-2"
              >
                {currentQuestion.options.map((opt, oIdx) => (
                  <Pressable
                    key={oIdx}
                    onPress={() => handleOptionToggle(questionIndex, oIdx)}
                    className="flex flex-row gap-2 items-center"
                  >
                    <Switch
                      variant="checkbox"
                      value={userAnswers[questionIndex].user_answer.includes(
                        oIdx
                      )}
                      onValueChange={() =>
                        handleOptionToggle(questionIndex, oIdx)
                      }
                    />
                    <CustomText>{opt}</CustomText>
                  </Pressable>
                ))}
              </CustomView>
            </CustomView>
          ) : (
            <CustomText>No question found</CustomText>
          )}
        </View>
      </CustomView>
    </SafeAreaView>
  );
}
