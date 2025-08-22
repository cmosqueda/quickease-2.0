import useTheme from "@/hooks/useTheme";
import _FONTS from "@/types/theme/Font";
import _API_INSTANCE from "@/utils/axios";

import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Switch } from "@expo/ui/jetpack-compose";
import { router } from "expo-router";
import { useState } from "react";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, ToastAndroid, View } from "react-native";

interface Question {
  question: string;
  description: string;
  options: string[];
  correctAnswers: number[];
}

export default function Page() {
  const { currentScheme } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      description: "",
      options: ["", "", "", ""],
      correctAnswers: [],
    },
  ]);
  const [quizTitle, setQuizTitle] = useState("Untitled Quiz");
  const [quizDescription, setQuizDescription] = useState("");
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value as never;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerToggle = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    const currentAnswers = newQuestions[qIndex].correctAnswers;
    if (currentAnswers.includes(oIndex)) {
      newQuestions[qIndex].correctAnswers = currentAnswers.filter(
        (i) => i !== oIndex
      );
    } else {
      newQuestions[qIndex].correctAnswers.push(oIndex);
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        description: "",
        options: ["", "", "", ""],
        correctAnswers: [],
      },
    ]);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    //
    if (questions.length < 2) {
      ToastAndroid.show("Must have at least 2 questions.", ToastAndroid.SHORT);
      return;
    }

    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      if (!q.question.trim()) {
        ToastAndroid.show(
          `Question ${index + 1} is empty.`,
          ToastAndroid.SHORT
        );
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        ToastAndroid.show(
          `Question ${index + 1} has an empty option.`,
          ToastAndroid.SHORT
        );
        return;
      }
      if (q.correctAnswers.length === 0) {
        ToastAndroid.show(
          `Question ${index + 1} has no correct answer selected.`,
          ToastAndroid.SHORT
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { status, data } = await _API_INSTANCE.post(
        "/quiz/create",
        {
          title: quizTitle.trim(),
          description: quizDescription.trim(),
          quiz_content: questions,
          is_randomized: isRandomized,
          timed_quiz: isTimedQuiz ? totalSeconds : 0,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status == 201) {
        await checkBadges();
        ToastAndroid.show("Quiz created", ToastAndroid.SHORT);
        router.push({
          pathname: "/(learner)/(quiz)/view/[id]",
          params: {
            id: data.id,
          },
        });
      }
    } catch (err) {
      ToastAndroid.show("Error creating quiz.", ToastAndroid.SHORT);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    <>
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
          if (!quizTitle) {
            ToastAndroid.show("No quiz title?", ToastAndroid.SHORT);
            return;
          }

          setTabIndex(1);
        }}
      >
        <CustomText>Next</CustomText>
      </CustomPressable>
    </>,
    <>
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
                  onChangeText={(val: string) =>
                    handleOptionChange(index, oIndex, val)
                  }
                  className="rounded-xl flex-1"
                />
                <Switch
                  variant="checkbox"
                  value={q.correctAnswers.includes(oIndex)}
                  onValueChange={() => handleCorrectAnswerToggle(index, oIndex)}
                />
              </View>
            ))}
            <CustomPressable
              variant="colorBase100"
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
    </>,
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentScheme.colorBase100 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-2 items-center">
          <Pressable
            onPress={() => {
              if (tabIndex == 1) {
                setTabIndex(0);
                return;
              }

              setTabIndex(0);
              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <CustomText>Create quiz</CustomText>
        </View>
        <CustomPressable
          disabled={isSubmitting}
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase200"
        >
          <CustomText>
            <MaterialCommunityIcons name="content-save" size={20} />
          </CustomText>
          <CustomText>Save</CustomText>
        </CustomPressable>
      </View>
      <View className="flex flex-row gap-2">
        <CustomView
          className="rounded-full flex-1"
          variant={tabIndex == 0 ? "colorPrimary" : "colorBase300"}
          style={{ height: 6 }}
        />
        <CustomView
          className="rounded-full flex-1"
          style={{ height: 6 }}
          variant={tabIndex == 1 ? "colorPrimary" : "colorBase300"}
        />
      </View>
      {tabs[tabIndex]}
    </SafeAreaView>
  );
}
