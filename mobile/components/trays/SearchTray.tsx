import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomTextInput from "../CustomTextInput";

import { MaterialIcons } from "@expo/vector-icons";

import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

const SearchTray = ({
  close,
  type,
}: {
  close: () => void;
  type: "note" | "quiz" | "flashcard" | "forum";
}) => {
  const [query, setQuery] = useState("");

  const handleRedirect = () => {
    if (type === "forum") {
      router.push({
        pathname: "/(learner)/(forum)/search/[query]",
        params: { query: query },
      });
      close();
    }

    if (type === "note") {
      router.push({
        pathname: "/(learner)/(note)/search/[query]",
        params: { query: query },
      });
      close();
    }

    if (type === "flashcard") {
      router.push({
        pathname: "/(learner)/(flashcard)/search/[query]",
        params: { query: query },
      });
      close();
    }

    if (type === "quiz") {
      router.push({
        pathname: "/(learner)/(quiz)/search/[query]",
        params: { query: query },
      });
      close();
    }
  };

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-8 gap-4"
    >
      <Pressable onPress={close}>
        <CustomText>
          <MaterialIcons name="close" size={24} />
        </CustomText>
      </Pressable>

      <CustomText variant="bold" className="text-4xl">
        Search
      </CustomText>
      <View className="flex flex-row gap-2 items-center">
        <CustomTextInput
          className="rounded-xl flex-1"
          autoFocus={true}
          enterKeyHint="go"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleRedirect}
        />
      </View>
    </CustomView>
  );
};

export default SearchTray;
