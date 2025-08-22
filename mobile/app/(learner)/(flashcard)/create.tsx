import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import _FONTS from "@/types/theme/Font";
import FlippableCard from "@/components/FlippableCard";
import CustomText from "@/components/CustomText";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useState } from "react";
import { View, ScrollView, ToastAndroid, Pressable } from "react-native";
import { checkBadges } from "@/types/user/badges";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Page() {
  const { user } = useAuth();
  const { currentScheme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddCard = () => {
    if (!front && !back) {
      ToastAndroid.show("Invalid input values.", ToastAndroid.SHORT);
      return;
    }

    setCards([...cards, { front, back }]);
    setFront("");
    setBack("");
  };

  const handleSave = async () => {
    if (cards.length < 2) {
      ToastAndroid.show(
        "The flashcards must contain at least 2.",
        ToastAndroid.SHORT
      );
      return;
    }
    setIsSaving(true);

    try {
      const { status } = await _API_INSTANCE.post("flashcard/create", {
        title,
        description,
        flashcards: cards,
        user_id: user?.id,
      });

      if (status === 201) {
        await checkBadges();
        ToastAndroid.show("Flashcard created.", ToastAndroid.SHORT);
      }
    } catch (err: any) {
      ToastAndroid.show(
        `Error creating flashcard: ${err.message}`,
        ToastAndroid.LONG
      );
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    <>
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
            ToastAndroid.show("No flashcard title?", ToastAndroid.SHORT);
            return;
          }

          setIndex(1);
        }}
      >
        <CustomText>Next</CustomText>
      </CustomPressable>
    </>,
    <>
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
        contentContainerStyle={{ backgroundColor: currentScheme.colorBase100 }}
        contentContainerClassName="gap-4"
      >
        {cards.map((card, index) => (
          <FlippableCard front={card.front} back={card.back} key={index} />
        ))}
      </ScrollView>
    </>,
  ];
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
                setIndex(0);
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
        >
          <CustomText>
            <MaterialCommunityIcons name="content-save" size={20} />
          </CustomText>
          <CustomText>Save</CustomText>
        </CustomPressable>
      </View>
      {tabs[index]}
    </SafeAreaView>
  );
}
