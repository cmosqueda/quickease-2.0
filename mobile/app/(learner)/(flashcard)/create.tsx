import useAuth from "@/hooks/useAuth";
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
import { router } from "expo-router";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";

import _API_INSTANCE from "@/utils/axios";
import _FONTS from "@/types/theme/Font";

export default function Page() {
  const { user, addFlashcard } = useAuth();
  const { currentScheme } = useTheme();
  const pagerViewRef = useRef<PagerView>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddCard = () => {
    if (!front && !back) {
      toast("Invalid input values.");
      return;
    }

    setCards([...cards, { front, back }]);
    setFront("");
    setBack("");
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { status, data } = await _API_INSTANCE.post("flashcard/create", {
        title,
        description,
        flashcards: cards,
        user_id: user?.id,
      });

      if (status === 201) {
        addFlashcard(data);
        await checkBadges();
        toast("Flashcard created.");
        router.back();
      }
    } catch (err: any) {
      toast(`Error creating flashcard: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentScheme.colorBase100 }}
      className="p-4 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-2 items-center">
          <Pressable
            onPress={() => {
              if (index == 1) {
                pagerViewRef.current?.setPage(0);
                setIndex(0);
                return;
              }

              router.back();
            }}
          >
            <CustomText>
              <MaterialIcons name="keyboard-arrow-left" size={36} />
            </CustomText>
          </Pressable>
          <CustomText>Create flashcard</CustomText>
        </View>
        <CustomPressable
          className="flex flex-row gap-2 items-center rounded-3xl"
          variant="colorBase200"
          onPress={() => {
            if (cards.length < 2) {
              toast("The flashcards must contain at least 2.");
              return;
            }

            toast.promise(handleSave(), {
              loading: "Saving flashcards..,",
              error: "Error saving flashcards.",
              success: (data) => "Flashcards saved.",
            });
          }}
        >
          <CustomText>
            <MaterialCommunityIcons name="content-save" size={20} />
          </CustomText>
          <CustomText>Save</CustomText>
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
        onPageScroll={(e) => setIndex(e.nativeEvent.position)}
        style={{ flex: 1 }}
        scrollEnabled={false}
      >
        <View key={0}>
          <View className="flex-1">
            <CustomTextInput
              style={{
                backgroundColor: "",
                paddingHorizontal: 0,
                fontFamily: _FONTS.Gabarito_900Black,
              }}
              className="text-4xl"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <CustomTextInput
              style={{
                backgroundColor: null as any,
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
              if (!title) {
                toast("No flashcard title?");
                return;
              }

              pagerViewRef.current?.setPage(1);
              setIndex(1);
            }}
          >
            <CustomText>Next</CustomText>
          </CustomPressable>
        </View>
        <View key={1}>
          <CustomText variant="black" className="text-5xl">
            Questions
          </CustomText>
          <CustomView variant="colorBase300" className="gap-4 p-4 rounded-3xl">
            <CustomText>Front (Question)</CustomText>
            <CustomTextInput
              value={front}
              onChangeText={setFront}
              placeholder="Enter the front of the card"
              style={{ backgroundColor: currentScheme.colorBase200 }}
              className="rounded-xl"
              multiline
            />
            <CustomText>Back (Answer)</CustomText>
            <CustomTextInput
              value={back}
              onChangeText={setBack}
              placeholder="Enter the back of the card"
              style={{ backgroundColor: currentScheme.colorBase200 }}
              className="rounded-xl"
              multiline
            />
            <CustomPressable
              onPress={handleAddCard}
              className="items-center rounded-xl"
            >
              <CustomText color="colorPrimaryContent">Add</CustomText>
            </CustomPressable>
          </CustomView>

          <CustomText variant="bold" className="text-xl">
            Previews
          </CustomText>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: currentScheme.colorBase100,
            }}
            contentContainerClassName="gap-4"
          >
            {cards.map((card, index) => (
              <FlippableCard front={card.front} back={card.back} key={index} />
            ))}
          </ScrollView>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}
