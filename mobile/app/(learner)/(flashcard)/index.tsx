import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Link } from "expo-router";
import { useTrays } from "react-native-trays";
import { Flashcard } from "@/types/user/types";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

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
        className="px-8 flex flex-row justify-evenly items-center relative gap-4"
      >
        <Pressable
          onPress={() => {
            setIndex(0);
            pagerViewRef.current?.setPage(0);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">All</CustomText>
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
          <CustomText className="text-center">By recent</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 1 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setIndex(2);
            pagerViewRef.current?.setPage(2);
          }}
          className="flex-1 gap-2 "
        >
          <CustomText className="text-center">AI-Generated</CustomText>
          <CustomView
            className="rounded-full"
            variant={index === 2 ? "colorPrimary" : "colorBase100"}
            style={{ height: 3 }}
          />
        </Pressable>
      </CustomView>

      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={(e) => {
          setIndex(e.nativeEvent.position);
        }}
      >
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={0}
        >
          {user?.flashcards.map((flashcard: Flashcard) => (
            <Link
              asChild
              href={{
                pathname: "/(learner)/(flashcard)/view/[id]",
                params: { id: flashcard.id },
              }}
              key={flashcard.id}
            >
              <Pressable>
                <CustomView className="p-6 rounded-xl gap-2">
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
                  <CustomText variant="bold" className="text-3xl">
                    {flashcard.title}
                  </CustomText>
                </CustomView>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={1}
        >
          {[...(user?.flashcards ?? [])]
            .sort(
              (a: Flashcard, b: Flashcard) =>
                dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf()
            )
            .map((flashcard: Flashcard) => (
              <Link
                asChild
                key={flashcard.id}
                href={{
                  pathname: "/(learner)/(flashcard)/view/[id]",
                  params: { id: flashcard.id.toString() },
                }}
              >
                <Pressable>
                  <CustomView className="p-6 rounded-xl gap-2">
                    {flashcard.is_ai_generated && (
                      <View className="flex flex-row gap-4 items-center">
                        <MaterialIcons name="info" size={18} />
                        <CustomText>AI-Generated</CustomText>
                      </View>
                    )}
                    <CustomText className="text-sm opacity-40">
                      {dayjs(flashcard.updated_at).format(
                        "hh:mm A / MMMM DD, YYYY"
                      )}
                    </CustomText>
                    <CustomText variant="bold" className="text-3xl">
                      {flashcard.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              </Link>
            ))}
        </ScrollView>
        <ScrollView
          contentContainerClassName="flex flex-col gap-4 px-4 py-4"
          className="rounded-tr-3xl rounded-tl-3xl"
          style={{ backgroundColor: currentScheme.colorBase300 }}
          key={2}
        >
          {user?.flashcards
            .filter(
              (flashcard: Flashcard) => flashcard.is_ai_generated === true
            )
            .map((flashcard: Flashcard) => (
              <Link
                asChild
                href={{
                  pathname: "/(learner)/(flashcard)/view/[id]",
                  params: { id: flashcard.id },
                }}
                key={flashcard.id}
              >
                <Pressable>
                  <CustomView className="p-6 rounded-xl gap-2">
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
                    <CustomText variant="bold" className="text-3xl">
                      {flashcard.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              </Link>
            ))}
        </ScrollView>
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
