import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import FlippableCard from "@/components/FlippableCard";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { toast } from "sonner-native";
import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/types/user/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import _FONTS from "@/types/theme/Font";

export default function Page() {
  const { currentScheme } = useTheme();
  const { id: flashcardId } = useLocalSearchParams<{ id?: string }>();
  const pagerViewRef = useRef<PagerView>(null);

  const {
    data: flashcardData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["view-flashcard", flashcardId],
    queryFn: async () => {
      const { data } = await _API_INSTANCE.get<Flashcard>(
        `/flashcard/${flashcardId}`
      );
      return data;
    },
    retry: 3,
    enabled: Boolean(flashcardId),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [index, setIndex] = useState(0);

  // Pre-fill form values once flashcard data is loaded
  useEffect(() => {
    if (flashcardData) {
      setTitle(flashcardData.title ?? "");
      setDescription(flashcardData.description ?? "");
      setCards(flashcardData.flashcards ?? []);
    }
  }, [flashcardData]);

  const handleAddCard = () => {
    if (!front.trim() || !back.trim()) {
      toast("Both front and back are required.");
      return;
    }
    setCards((prev) => [...prev, { front, back }]);
    setFront("");
    setBack("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { status } = await _API_INSTANCE.put(
        `/flashcard/update`,
        {
          flashcard_id: flashcardId,
          title,
          description,
          flashcards: cards,
        },
        {
          timeout: 8 * 60 * 1000,
        }
      );

      if (status === 200) {
        toast("Flashcard updated.");
        router.back();
      } else {
        toast("Unexpected server response.");
      }
    } catch (err: any) {
      toast(`Error updating flashcard: ${err.message ?? "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

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
        style={{ flex: 1, backgroundColor: currentScheme.colorBase200 }}
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
      style={{ flex: 1, backgroundColor: currentScheme.colorBase200 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-2 items-center">
          <Pressable
            onPress={() => {
              if (index === 1) {
                setIndex(0);
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
          <CustomText>Edit Flashcard</CustomText>
        </View>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase300"
          onPress={() => {
            if (!title.trim()) {
              toast("Title is required.");
              return;
            }
            if (cards.length < 2) {
              toast("At least 2 cards required.");
              return;
            }

            toast.promise(handleSave(), {
              loading: "Saving flashcards...",
              error: "Error saving flashcards.",
              success: (data) => "Flashcards saved.",
            });
          }}
          disabled={isSaving}
        >
          <CustomText>
            <MaterialCommunityIcons name="content-save" size={20} />
          </CustomText>
          <CustomText>{isSaving ? "Saving..." : "Save"}</CustomText>
        </CustomPressable>
      </View>
      <View className="flex flex-row gap-2">
        <CustomView
          className="rounded-full flex-1"
          variant={index == 0 ? "colorPrimary" : "colorBase300"}
          style={{ height: 6 }}
        />
        <CustomView
          className="rounded-full flex-1"
          style={{ height: 6 }}
          variant={index == 1 ? "colorPrimary" : "colorBase300"}
        />
      </View>
      <PagerView
        ref={pagerViewRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageScroll={(e) => setIndex(e.nativeEvent.position)}
        scrollEnabled={false}
      >
        <View key={0}>
          <View className="flex-1">
            <CustomTextInput
              style={{
                paddingHorizontal: 0,
                fontFamily: _FONTS.Gabarito_900Black,
              }}
              className="text-4xl"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              multiline
            />
            <CustomTextInput
              style={{
                paddingHorizontal: 0,
                fontFamily: _FONTS.Gabarito_400Regular,
                flex: 1,
              }}
              placeholder="Description"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <CustomPressable
            variant="colorBase300"
            className="rounded-3xl items-center"
            onPress={() => {
              if (!title.trim()) {
                toast("Missing title.");
                return;
              }

              pagerViewRef.current?.setPage(1);
              setIndex(1);
            }}
          >
            <CustomText>Next</CustomText>
          </CustomPressable>
        </View>
        <View key={1} className="gap-4">
          <CustomText variant="black" className="text-5xl">
            Edit Cards
          </CustomText>
          <CustomView variant="colorBase300" className="gap-4 p-4 rounded-3xl">
            <CustomText>Front (Question)</CustomText>
            <CustomTextInput
              value={front}
              onChangeText={setFront}
              placeholder="Edit the front"
              style={{ backgroundColor: currentScheme.colorBase200 }}
              className="rounded-xl"
              multiline
            />
            <CustomText>Back (Answer)</CustomText>
            <CustomTextInput
              value={back}
              onChangeText={setBack}
              placeholder="Edit the back"
              style={{ backgroundColor: currentScheme.colorBase200 }}
              className="rounded-xl"
              multiline
            />
            <CustomPressable
              onPress={handleAddCard}
              className="items-center rounded-xl"
            >
              <CustomText color="colorPrimaryContent">Add Card</CustomText>
            </CustomPressable>
          </CustomView>

          <CustomText variant="bold" className="text-xl">
            Existing Cards
          </CustomText>
          {cards.length > 0 ? (
            <ScrollView
              contentContainerStyle={{
                backgroundColor: currentScheme.colorBase200,
              }}
              contentContainerClassName="gap-4"
            >
              {cards.map((card, index) => (
                <FlippableCard
                  front={card.front}
                  back={card.back}
                  key={index}
                />
              ))}
            </ScrollView>
          ) : (
            <CustomText className="opacity-60">
              No cards yet. Add one above.
            </CustomText>
          )}
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
