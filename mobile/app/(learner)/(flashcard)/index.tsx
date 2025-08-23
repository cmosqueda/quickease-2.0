import useTheme from "@/hooks/useTheme";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useTrays } from "react-native-trays";
import { MyTraysProps } from "@/types/trays/trays";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";
import useAuth from "@/hooks/useAuth";
import { Flashcard } from "@/types/user/types";
import dayjs from "dayjs";

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
        title="Flashcards"
        rightSideChildren={
          <>
            <CustomText>
              <MaterialIcons
                name="filter-list"
                size={20}
                onPress={() =>
                  openTray("FilterNotesTray", { close: closeTray })
                }
              />
            </CustomText>
          </>
        }
      />

      <CustomView
        variant="colorBase300"
        className="flex-col gap-4 flex-1 px-4 py-4"
      >
        {user?.flashcards.map((flashcard: Flashcard) => (
          <Pressable
            key={flashcard.id}
            onPress={() =>
              router.push({
                pathname: "/(learner)/(flashcard)/view/[id]",
                params: { id: flashcard.id },
              })
            }
          >
            <CustomView className="p-6 rounded-xl gap-2">
              <View className="gap-2">
                {flashcard.is_ai_generated && (
                  <View className="flex flex-row gap-4 items-center">
                    <CustomText>
                      <MaterialIcons name="info" size={18} />
                    </CustomText>
                    <CustomText>AI-Generated</CustomText>
                  </View>
                )}
                <CustomText className="text-sm opacity-40">
                  {dayjs(flashcard.updated_at)
                    .format("hh:mm A / MMMM DD, YYYY")
                    .toString()}
                </CustomText>
              </View>
              <CustomText variant="bold" className="text-3xl">
                {flashcard.title}
              </CustomText>
              {flashcard.description && (
                <CustomText>{flashcard.description}</CustomText>
              )}
            </CustomView>
          </Pressable>
        ))}
      </CustomView>

      <Link asChild href={"/(learner)/(flashcard)/create"}>
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
