import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomView from "@/components/CustomView";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router, Link } from "expo-router";
import { ScrollView, Pressable, View, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import { toast } from "sonner-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LearnerQuizPage() {
  const { currentScheme } = useTheme();
  const { user, deleteQuiz } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: quizData } = useQuery({
    queryKey: ["view-quiz", id],
    queryFn: async () => {
      try {
        const { data } = await _API_INSTANCE.get(`/quiz/${id}`);
        console.log(data);

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

  const handleDeleteQuiz = async () => {
    try {
      const { status } = await _API_INSTANCE.delete(`/quiz/delete`, {
        data: {
          quiz_id: quizData.id,
        },
      });

      if (status == 200) {
        deleteQuiz(quizData.id);
        toast.success("Quiz deleted.");
        router.replace({
          pathname: "/(learner)/(quiz)",
        });
      }
    } catch {
      toast.error("Failed to delete.");
      return;
    }
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

  useEffect(() => {
    if (quizData && !quizData.is_public) {
      setTimeout(() => {
        router.replace("/(learner)/(quiz)");
      }, 3000);
    }
  }, [quizData, id]);

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

  if (!quizData.is_public) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center gap-6"
        style={{ backgroundColor: currentScheme.colorBase200 }}
      >
        <CustomText>
          <MaterialCommunityIcons name="alert-circle" size={96} />
        </CustomText>
        <View className="flex flex-col gap-1">
          <CustomText className="text-xl text-center" variant="bold">
            The user made this quiz private.
          </CustomText>
          <CustomText className="text-sm opacity-70 text-center px-8">
            Sorry, we can&apos;t display this quiz. The user either made this
            quiz private or made changes on it.
          </CustomText>
          <CustomText
            className="opacity-70 text-center my-4 px-8"
            variant="bold"
          >
            You&apos;ll be redirected to your quiz tab in a few seconds...
          </CustomText>
        </View>
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
        <Pressable onPress={() => router.replace("/(learner)/(quiz)")}>
          <CustomText>
            <MaterialIcons name="keyboard-arrow-left" size={36} />
          </CustomText>
        </Pressable>
        {quizData.user_id === user?.id && (
          <View className="flex flex-row gap-4 items-center">
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/(learner)/(quiz)/edit/[id]",
                  params: { id: quizData.id },
                })
              }
            >
              <CustomText>
                <MaterialIcons name="edit" size={24} />
              </CustomText>
            </Pressable>
            <Pressable onPress={handleDeleteQuiz}>
              <CustomText>
                <MaterialIcons name="delete" size={24} />
              </CustomText>
            </Pressable>
          </View>
        )}
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
