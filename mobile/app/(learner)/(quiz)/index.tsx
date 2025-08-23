import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Quiz } from "@/types/user/types";
import { useTrays } from "react-native-trays";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Pressable, View } from "react-native";
import { useRef, useState } from "react";

export default function Page() {
  const { user } = useAuth();
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );
  const pagerViewRef = useRef<PagerView>(null);

  const [index, setIndex] = useState(0);

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
      <CustomView
        variant="colorBase100"
        className="px-8 flex flex-row justify-evenly items-center relative gap-4"
      >
        <Pressable
          onPress={() => {
            setIndex(0);
            pagerViewRef.current?.setPage(0);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">Library</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 0 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(1);
            pagerViewRef.current?.setPage(1);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">Study Tools</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 1 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
      </CustomView>

      <PagerView style={{ flex: 1 }} scrollEnabled={false} ref={pagerViewRef}>
        <CustomView
          variant="colorBase300"
          className="flex-col gap-4 flex-1 px-4 py-4 rounded-tr-3xl rounded-tl-3xl"
          key={0}
        >
          {user?.quizzes &&
            user.quizzes.length > 0 &&
            user.quizzes.map((quiz: Quiz) => (
              <Pressable
                key={quiz.id}
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
            ))}
        </CustomView>
        <CustomView
          key={1}
          variant="colorBase300"
          className="flex-col gap-4 flex-1 px-4 py-4 rounded-tr-3xl rounded-tl-3xl"
        >
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase100 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
          >
            <CustomText>
              <MaterialCommunityIcons name="note-multiple" size={32} />
            </CustomText>
            <View className="flex-1">
              <CustomText className="text-xl" variant="black">
                Select from notes
              </CustomText>
              <CustomText className="opacity-60">
                Generate a quiz from selecting one of your notes.
              </CustomText>
            </View>
          </Pressable>
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase100 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
          >
            <CustomText>
              <MaterialCommunityIcons name="file-upload" size={32} />
            </CustomText>
            <View className="flex-1">
              <CustomText className="text-xl" variant="black">
                Upload file
              </CustomText>
              <CustomText className="opacity-60">
                Generate a quiz by uploading a document.
              </CustomText>
            </View>
          </Pressable>
        </CustomView>
      </PagerView>
      <Link asChild href={"/(learner)/(quiz)/create"}>
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
