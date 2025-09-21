import clsx from "clsx";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import UserAvatar from "@/components/UserAvatar";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import FlippableCard from "@/components/FlippableCard";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/types/user/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState, useMemo, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Pressable, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";

export default function Page() {
  const { currentScheme } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  /**
   * Fetches flashcard data for a given `id` using React Query.
   *
   * @remarks
   * - Uses the `useQuery` hook to asynchronously retrieve a flashcard from the API.
   * - The query is enabled only if a valid `id` is provided.
   * - Retries the request up to 3 times in case of failure.
   *
   * @returns
   * An object containing:
   * - `flashcardData`: The fetched flashcard data of type `Flashcard`.
   * - `isFetching`: Boolean indicating if the query is currently loading.
   * - `isError`: Boolean indicating if an error occurred during fetching.
   */
  const {
    data: flashcardData,
    isFetching,
    isError,
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
  const [flipped, setFlipped] = useState(false);

  /**
   * Computes a safe index for accessing flashcards.
   * Ensures the index is within the valid range:
   * - Returns 0 if `flashcardIndex` is less than 0.
   * - Returns the last valid index (`totalFlashcards - 1`) if `flashcardIndex` exceeds the total.
   * - Otherwise, returns the current `flashcardIndex`.
   *
   * @param flashcardIndex - The current index of the flashcard.
   * @param totalFlashcards - The total number of flashcards available.
   * @returns A valid flashcard index within bounds.
   */
  const safeIndex = useMemo(() => {
    if (flashcardIndex < 0) return 0;
    if (flashcardIndex >= totalFlashcards) return totalFlashcards - 1;
    return flashcardIndex;
  }, [flashcardIndex, totalFlashcards]);

  useEffect(() => {
    if (flashcardData && !flashcardData.is_public) {
      setTimeout(() => {
        router.replace("/(learner)/(flashcard)");
      }, 3000);
    }
  }, [flashcardData, id]);

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
      </SafeAreaView>
    );
  }

  if (!flashcardData) {
    return null;
  }

  if (!flashcardData.is_public) {
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
            The user made this flashcard private.
          </CustomText>
          <CustomText className="text-sm opacity-70 text-center px-8">
            Sorry, we can&apos;t display this flashcard. The user either made
            this flashcard private or made changes on it.
          </CustomText>
          <CustomText
            className="opacity-70 text-center my-4 px-8"
            variant="bold"
          >
            You&apos;ll be redirected to your flashcard tab in a few seconds...
          </CustomText>
        </View>
      </SafeAreaView>
    );
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
            router.replace("/(learner)/(flashcard)");
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

          <CustomView variant="colorBase100" className="p-6 rounded-3xl">
            <CustomText variant="black" className="text-4xl">
              {flashcardData?.title ?? "Untitled"}
            </CustomText>
          </CustomView>

          {flashcardData?.description && (
            <CustomView variant="colorBase100" className="p-6 rounded-3xl">
              <CustomText>{flashcardData.description}</CustomText>
            </CustomView>
          )}

          <View className="flex-1" />
          {totalFlashcards > 0 && (
            <CustomPressable
              variant="colorPrimary"
              className="rounded-3xl items-center"
              onPress={() => {
                setTabIndex(1);
                pagerViewRef.current?.setPage(1);
              }}
            >
              <CustomText color="colorPrimaryContent">
                View flashcards
              </CustomText>
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
                  flipped={flipped}
                  setFlipped={setFlipped}
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
                  onPress={() => {
                    setFlashcardIndex((prev) => Math.max(prev - 1, 0));
                    setFlipped(false);
                  }}
                >
                  <CustomText color="colorSecondaryContent">
                    <MaterialCommunityIcons name="arrow-left" size={24} />
                  </CustomText>
                </CustomPressable>
                <CustomPressable
                  className="rounded-3xl flex-1 items-center"
                  disabled={safeIndex === totalFlashcards - 1}
                  onPress={() => {
                    setFlashcardIndex((prev) =>
                      Math.min(prev + 1, totalFlashcards - 1)
                    );
                    setFlipped(false);
                  }}
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
