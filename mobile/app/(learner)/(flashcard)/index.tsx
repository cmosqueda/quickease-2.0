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

import { useTrays } from "react-native-trays";
import { Flashcard } from "@/types/user/types";
import { MyTraysProps } from "@/types/trays/trays";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
        variant="colorBase100"
        className="px-4 flex flex-row justify-evenly items-center relative gap-4"
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

      <PagerView style={{ flex: 1 }} ref={pagerViewRef}>
        <CustomView
          variant="colorBase300"
          className="flex-col gap-4 flex-1 px-4 py-4"
          key={0}
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
        <CustomView
          key={1}
          variant="colorBase300"
          className="flex-col gap-4 flex-1 px-4 py-4"
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
                Generate flashcards from selecting one of your notes.
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
                Generate flashcards by uploading a document.
              </CustomText>
            </View>
          </Pressable>
        </CustomView>
      </PagerView>

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
