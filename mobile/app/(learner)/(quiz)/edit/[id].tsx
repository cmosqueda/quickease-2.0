import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Quiz } from "@/types/user/types";
import { toast } from "sonner-native";
import { Switch } from "@expo/ui/jetpack-compose";
import { useQuery } from "@tanstack/react-query";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";

export interface Question {
  question: string;
  description: string;
  options: string[];
  correctAnswers: number[];
}

export default function Page() {
  const { currentScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pagerViewRef = useRef<PagerView>(null);

  const {
    data: quizData,
    isFetching,
    isError,
  } = useQuery<Quiz>({
    queryKey: ["edit-quiz", id],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Quiz>(`/quiz/${id}`);
      return data;
    },
    retry: 3,
    enabled: !!id,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizData) {
      setQuizTitle(quizData.title ?? "");
      setQuizDescription(quizData.description ?? "");
      setQuestions(
        Array.isArray(quizData.quiz_content) ? quizData.quiz_content : []
      );
      setIsTimedQuiz(quizData.timed_quiz! > 0);
      setTotalSeconds(quizData.timed_quiz ?? 0);
      setIsRandomized(quizData.is_randomized ?? false);
    }
  }, [quizData]);

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (!newQuestions[index]) return prev;
      newQuestions[index][field] = value as never;
      return newQuestions;
    });
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (!newQuestions[qIndex]) return prev;
      newQuestions[qIndex].options[oIndex] = value;
      return newQuestions;
    });
  };

  const handleCorrectAnswerToggle = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      const q = newQuestions[qIndex];
      if (!q) return prev;

      const currentAnswers = q.correctAnswers ?? [];
      if (currentAnswers.includes(oIndex)) {
        q.correctAnswers = currentAnswers.filter((i) => i !== oIndex);
      } else {
        q.correctAnswers = [...currentAnswers, oIndex];
      }
      return newQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        description: "",
        options: ["", "", "", ""],
        correctAnswers: [],
      },
    ]);
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { status } = await _API_INSTANCE.put(
        `/quiz/update`,
        {
          title: quizTitle.trim(),
          description: quizDescription.trim(),
          quiz_content: questions,
          is_randomized: isRandomized,
          timed_quiz: isTimedQuiz ? totalSeconds : 0,
          quiz_id: id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status === 200) {
        await checkBadges();
        toast("Quiz updated");
        router.push({
          pathname: "/(learner)/(quiz)/view/[id]",
          params: { id },
        });
      }
    } catch {
      toast("Error updating quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [tabIndex, setTabIndex] = useState(0);

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

  if (isError || !quizData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: currentScheme.colorBase100 }}
        className="items-center justify-center"
      >
        <CustomText>Failed to load quiz.</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentScheme.colorBase100 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-2 items-center">
          <Pressable
            onPress={() => {
              if (tabIndex === 1) {
                setTabIndex(0);
                pagerViewRef.current?.setPage(0);
                return;
              }
              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <CustomText>Edit quiz</CustomText>
        </View>
        <CustomPressable
          disabled={isSubmitting}
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase200"
          onPress={() => {
            if (questions.length < 2) {
              toast("Must have at least 2 questions.");
              return;
            }

            for (let index = 0; index < questions.length; index++) {
              const q = questions[index];
              if (!q.question.trim()) {
                toast(`Question ${index + 1} is empty.`);
                return;
              }
              if (q.options.some((opt) => !opt.trim())) {
                toast(`Question ${index + 1} has an empty option.`);
                return;
              }
              if (!q.correctAnswers || q.correctAnswers.length === 0) {
                toast(`Question ${index + 1} has no correct answer selected.`);
                return;
              }
            }

            toast.promise(handleSubmit(), {
              loading: "Saving quiz...",
              error: "Error saving quiz.",
              success: (data) => "Quiz saved.",
            });
          }}
        >
          <CustomText>
            <MaterialCommunityIcons name="content-save" size={20} />
          </CustomText>
          <CustomText>{isSubmitting ? "Saving..." : "Save"}</CustomText>
        </CustomPressable>
      </View>

      <View className="flex flex-row gap-2">
        <CustomView
          className="rounded-full flex-1"
          variant={tabIndex === 0 ? "colorPrimary" : "colorBase300"}
          style={{ height: 6 }}
        />
        <CustomView
          className="rounded-full flex-1"
          style={{ height: 6 }}
          variant={tabIndex === 1 ? "colorPrimary" : "colorBase300"}
        />
      </View>

      <PagerView style={{ flex: 1 }} scrollEnabled={false} ref={pagerViewRef}>
        <View key={0}>
          <View className="flex-1">
            <CustomTextInput
              style={{
                backgroundColor: "",
                paddingHorizontal: 0,
                fontFamily: _FONTS.Gabarito_900Black,
              }}
              className="text-4xl"
              placeholder="Title"
              value={quizTitle}
              onChangeText={setQuizTitle}
              multiline
            />
            <CustomTextInput
              style={{
                backgroundColor: null as any,
                paddingHorizontal: 0,
                fontFamily: _FONTS.Gabarito_400Regular,
                flex: 1,
              }}
              placeholder="Description"
              multiline
              textAlignVertical="top"
              value={quizDescription}
              onChangeText={setQuizDescription}
            />
          </View>
          <CustomPressable
            variant="colorBase300"
            className="rounded-3xl items-center"
            onPress={() => {
              if (!quizTitle.trim()) {
                toast("No quiz title?");
                return;
              }
              pagerViewRef.current?.setPage(1);
              setTabIndex(1);
            }}
          >
            <CustomText>Next</CustomText>
          </CustomPressable>
        </View>

        <View key={1} className="flex-1 gap-4">
          <CustomText variant="black" className="text-5xl">
            Questions
          </CustomText>
          <ScrollView contentContainerClassName="gap-4 pb-[5rem]">
            {questions.map((q, index) => (
              <CustomView
                variant="colorBase300"
                key={index}
                className="gap-2 p-4 rounded-3xl"
              >
                <CustomTextInput
                  value={q.question}
                  onChangeText={(val) =>
                    handleQuestionChange(index, "question", val)
                  }
                  placeholder={`Question ${index + 1}`}
                  className="rounded-xl"
                />
                <CustomTextInput
                  placeholder="Description (optional)"
                  value={q.description}
                  onChangeText={(val) =>
                    handleQuestionChange(index, "description", val)
                  }
                  className="h-[6rem] rounded-xl"
                  textAlignVertical="top"
                  multiline
                />
                <CustomText>Answers/Options</CustomText>
                {q.options.map((opt, oIndex) => (
                  <View key={oIndex} className="flex flex-row gap-4">
                    <CustomTextInput
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChangeText={(val) =>
                        handleOptionChange(index, oIndex, val)
                      }
                      className="rounded-xl flex-1"
                    />
                    <Switch
                      variant="checkbox"
                      elementColors={{
                        checkmarkColor: currentScheme.colorPrimary,
                        checkedColor: currentScheme.colorPrimary,
                      }}
                      color={currentScheme.colorBase100}
                      value={q.correctAnswers.includes(oIndex)}
                      onValueChange={() =>
                        handleCorrectAnswerToggle(index, oIndex)
                      }
                    />
                  </View>
                ))}
                <CustomPressable
                  variant="colorBase200"
                  className="items-center rounded-xl"
                  onPress={() => deleteQuestion(index)}
                >
                  <CustomText>Delete</CustomText>
                </CustomPressable>
              </CustomView>
            ))}
          </ScrollView>

          <CustomPressable
            onPress={addQuestion}
            variant="colorPrimary"
            className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
          >
            <CustomText color="colorPrimaryContent">
              <MaterialIcons name="post-add" size={32} />
            </CustomText>
            <CustomText color="colorPrimaryContent">Add question</CustomText>
          </CustomPressable>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
