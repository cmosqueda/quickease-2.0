import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { useLocalSearchParams, router, Link } from "expo-router";
import { ScrollView, Pressable, View, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function LearnerQuizPage() {
  const { currentScheme } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: quizData } = useQuery({
    queryKey: ["view-quiz", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(`/quiz/${id}`);

        return data;
      } catch (err) {
        throw err;
      }
    },
    retry: 3,
    enabled: !!id,
  });

  const pagerViewRef = useRef<PagerView>(null);

  const [tabIndex, setTabIndex] = useState(0);

  const handleAnswerQuiz = () => {
    router.push({
      pathname: "/(learner)/(quiz)/answer/[id]",
      params: { id: id },
    });
  };

  const handleEditQuiz = () => {
    router.push({
      pathname: "/(learner)/(quiz)/edit/[id]",
      params: { id: id },
    });
  };

  const renderAttempts = () =>
    quizData?.attempts.map((entry: any, index: any) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc: any, item: any) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans: any) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <Link
          href={{
            pathname: "/(learner)/(quiz)/attempt/[id]",
            params: { id: entry.id },
          }}
          key={entry.id}
          asChild
        >
          <Pressable>
            <CustomView
              variant="colorBase100"
              className="flex flex-row justify-between items-center p-4 rounded-2xl"
            >
              <CustomView className="flex flex-row gap-4">
                <CustomText>{index + 1}</CustomText>
                <CustomView>
                  <CustomText variant="bold" className="text-xl">
                    {user?.first_name} {user?.last_name}
                  </CustomText>
                  <CustomText>
                    {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
                  </CustomText>
                </CustomView>
              </CustomView>
              <CustomText variant="bold" className="text-xl">
                {correctCount}/{totalQuestions}
              </CustomText>
            </CustomView>
          </Pressable>
        </Link>
      );
    });

  const renderLeaderboard = () =>
    quizData?.leaderboard.map((entry: any, index: any) => {
      const totalQuestions = entry.answer_data.length;
      const correctCount = entry.answer_data.reduce((acc: any, item: any) => {
        const { correctAnswers } = item.question;
        const userAnswers = item.user_answer;
        const isCorrect =
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans: any) => userAnswers.includes(ans));
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      return (
        <CustomView
          key={entry.id}
          variant="colorBase100"
          className="flex flex-row justify-between items-center p-4 rounded-2xl"
        >
          <CustomView className="flex flex-row gap-4">
            <CustomText>{index + 1}</CustomText>
            <CustomView>
              <CustomText variant="bold" className="text-xl">
                {entry.user.first_name} {entry.user.last_name}
              </CustomText>
              <CustomText>
                {dayjs(entry.completed_at).format("MMMM DD YYYY / hh:mm A")}
              </CustomText>
            </CustomView>
          </CustomView>
          <CustomText variant="bold" className="text-xl">
            {correctCount}/{totalQuestions}
          </CustomText>
        </CustomView>
      );
    });

  if (!quizData) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: currentScheme.colorBase200 }}
      >
        <ActivityIndicator color={currentScheme.colorPrimary} size={96} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 p-4 gap-4"
      style={{
        backgroundColor: currentScheme.colorBase200,
      }}
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
        <Pressable onPress={handleEditQuiz}>
          <CustomText>
            <MaterialCommunityIcons name="layers-edit" size={28} />
          </CustomText>
        </Pressable>
      </CustomView>

      <CustomView variant="colorBase100" className="gap-4 p-4 rounded-3xl">
        {quizData.is_ai_generated && (
          <View className="flex flex-row items-center gap-2">
            <CustomText className="opacity-75">
              <MaterialIcons name="info" size={16} />
            </CustomText>
            <CustomText className="opacity-50">AI-generated</CustomText>
          </View>
        )}
        <CustomText variant="black" className="text-4xl">
          {quizData.title || "Untitled"}
        </CustomText>
        <CustomText>
          {quizData.description || "No description provided"}
        </CustomText>
      </CustomView>

      <View className="flex flex-row gap-4">
        {quizData.attempts.length > 0 && (
          <CustomPressable
            className={clsx(
              "flex-1 items-center rounded-3xl",
              tabIndex === 0 ? "opacity-100" : "opacity-50"
            )}
            onPress={() => {
              pagerViewRef.current?.setPage(0);
              setTabIndex(0);
            }}
          >
            <CustomText
              color={
                tabIndex === 0 ? "colorPrimaryContent" : "colorBaseContent"
              }
            >
              Your attempts
            </CustomText>
          </CustomPressable>
        )}
        <CustomPressable
          className={clsx(
            "flex-1 items-center rounded-3xl",
            tabIndex === 1 ? "opacity-100" : "opacity-50"
          )}
          onPress={() => {
            pagerViewRef.current?.setPage(1);
            setTabIndex(1);
          }}
        >
          <CustomText
            color={tabIndex === 1 ? "colorPrimaryContent" : "colorBaseContent"}
          >
            Leaderboard
          </CustomText>
        </CustomPressable>
      </View>

      <PagerView
        style={{ flex: 1 }}
        ref={pagerViewRef}
        onPageSelected={(e) => {
          setTabIndex(e.nativeEvent.position);
        }}
      >
        <ScrollView contentContainerClassName="flex flex-col gap-4" key={0}>
          {renderAttempts()}
        </ScrollView>
        <ScrollView contentContainerClassName="flex flex-col gap-4" key={1}>
          {renderLeaderboard()}
        </ScrollView>
      </PagerView>

      <CustomPressable
        className="flex flex-row gap-4 items-center justify-center rounded-3xl"
        onPress={handleAnswerQuiz}
      >
        <CustomText variant="bold" color="colorPrimaryContent">
          Start
        </CustomText>
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="arrow-forward" size={20} />
        </CustomText>
      </CustomPressable>
    </SafeAreaView>
  );
}
