import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import FlippableCard from "@/components/FlippableCard";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/types/user/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Pressable, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import UserAvatar from "@/components/UserAvatar";

export default function Page() {
  const { currentScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  const {
    data: flashcardData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["view-flashcard", id],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Flashcard>(`/flashcard/${id}`);
      return data;
    },
    retry: 3,
    enabled: Boolean(id),
  });

  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const pagerViewRef = useRef<PagerView>(null);

  const totalFlashcards = flashcardData?.flashcards?.length ?? 0;

  const safeIndex = useMemo(() => {
    if (flashcardIndex < 0) return 0;
    if (flashcardIndex >= totalFlashcards) return totalFlashcards - 1;
    return flashcardIndex;
  }, [flashcardIndex, totalFlashcards]);

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

  if (isError) {
    return (
      <SafeAreaView
        style={{ backgroundColor: currentScheme.colorBase200, flex: 1 }}
        className="p-4 justify-center items-center"
      >
        <CustomText variant="bold" className="text-red-600">
          Failed to load flashcard.
        </CustomText>
        {__DEV__ && (
          <CustomText className="text-xs opacity-50">
            {(error as Error)?.message}
          </CustomText>
        )}
      </SafeAreaView>
    );
  }

  if (!flashcardData) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: currentScheme.colorBase200, flex: 1 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row gap-4 justify-between items-center relative">
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
        {user?.id === flashcardData.user_id && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(learner)/(flashcard)/edit/[id]",
                params: { id: id ?? "" },
              })
            }
          >
            <CustomText>
              <MaterialCommunityIcons name="note-edit" size={24} />
            </CustomText>
          </Pressable>
        )}
      </View>

      <PagerView ref={pagerViewRef} style={{ flex: 1 }} scrollEnabled={false}>
        <View className="flex-1 gap-4" key={0}>
          <View className="gap-2">
            <View className="flex flex-row gap-4 items-center">
              <UserAvatar />
              <CustomView variant="colorBase200">
                <CustomText variant="bold">
                  {user?.first_name ?? "Unknown"} {user?.last_name ?? "User"}
                </CustomText>
                <CustomText className="text-sm opacity-40">
                  {flashcardData?.updated_at
                    ? dayjs(flashcardData.updated_at).format(
                        "hh:mm A / MMMM DD, YYYY"
                      )
                    : "No date"}
                </CustomText>
              </CustomView>
            </View>
          </View>

          <CustomView variant="colorBase100" className="p-4 rounded-3xl">
            <CustomText variant="black" className="text-4xl">
              {flashcardData?.title ?? "Untitled"}
            </CustomText>
          </CustomView>

          {flashcardData?.description && (
            <CustomView variant="colorBase100" className="p-4 rounded-3xl">
              <CustomText>{flashcardData.description}</CustomText>
            </CustomView>
          )}

          <View className="flex-1" />
          {totalFlashcards > 0 && (
            <CustomPressable
              variant="colorBase300"
              className="rounded-3xl items-center"
              onPress={() => {
                setTabIndex(1);
                pagerViewRef.current?.setPage(1);
              }}
            >
              <CustomText>View flashcards</CustomText>
            </CustomPressable>
          )}
        </View>

        <View className="flex-1" key={1}>
          {totalFlashcards > 0 ? (
            <>
              <View className="relative">
                <CustomText
                  className="absolute top-6 z-10 left-6"
                  color="colorSecondaryContent"
                  variant="bold"
                >
                  {safeIndex + 1}
                </CustomText>
                <FlippableCard
                  back={flashcardData.flashcards[safeIndex]?.back ?? ""}
                  front={flashcardData.flashcards[safeIndex]?.front ?? ""}
                  height="h-[70vh]"
                />
              </View>
              <View className="flex-1" />
              <View className="flex flex-row gap-2">
                <CustomPressable
                  className="rounded-3xl flex-1 items-center"
                  disabled={safeIndex === 0}
                  onPress={() =>
                    setFlashcardIndex((prev) => Math.max(prev - 1, 0))
                  }
                >
                  <CustomText color="colorSecondaryContent">
                    <MaterialCommunityIcons name="arrow-left" size={24} />
                  </CustomText>
                </CustomPressable>
                <CustomPressable
                  className="rounded-3xl flex-1 items-center"
                  disabled={safeIndex === totalFlashcards - 1}
                  onPress={() =>
                    setFlashcardIndex((prev) =>
                      Math.min(prev + 1, totalFlashcards - 1)
                    )
                  }
                >
                  <CustomText color="colorSecondaryContent">
                    <MaterialCommunityIcons name="arrow-right" size={24} />
                  </CustomText>
                </CustomPressable>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <CustomText>No flashcards available.</CustomText>
            </View>
          )}
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
