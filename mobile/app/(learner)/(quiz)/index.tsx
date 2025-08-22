import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Quiz } from "@/types/user/types";
import { useTrays } from "react-native-trays";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Pressable, View } from "react-native";

export default function Page() {
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  const { user } = useAuth();

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        title="Quizzes"
        rightSideChildren={
          <>
            <CustomText>
              <MaterialIcons
                name="filter-list"
                size={20}
                onPress={() =>
                  openTray("FilterQuizzesTray", { close: closeTray })
                }
              />
            </CustomText>
          </>
        }
      />

      {user?.quizzes &&
        user.quizzes.length > 0 &&
        user.quizzes.map((quiz: Quiz) => (
          <CustomView
            key={quiz.id}
            variant="colorBase300"
            className="flex-col gap-4 flex-1 px-4 py-4"
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(learner)/(quiz)/view/[id]",
                  params: { id: quiz.id },
                })
              }
            >
              <CustomView className="p-6 rounded-xl gap-2">
                <View className="gap-2">
                  {quiz.is_ai_generated && (
                    <View className="flex flex-row gap-4 items-center">
                      <CustomText>
                        <MaterialIcons name="info" size={18} />
                      </CustomText>
                      <CustomText>AI-Generated</CustomText>
                    </View>
                  )}
                  <CustomText className="text-sm opacity-40">
                    {dayjs(quiz.updated_at).format("hh:mm A / MMMM DD YYYY")}
                  </CustomText>
                </View>
                <CustomText variant="bold" className="text-3xl">
                  {quiz.title}
                </CustomText>
              </CustomView>
            </Pressable>
          </CustomView>
        ))}

      <Link asChild href={{ pathname: "/(learner)/(quiz)/create" }}>
        <CustomPressable
          variant="colorPrimary"
          className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
        >
          <CustomText color="colorPrimaryContent">
            <MaterialIcons name="post-add" size={32} />
          </CustomText>
        </CustomPressable>
      </Link>
    </SafeAreaView>
  );
}
