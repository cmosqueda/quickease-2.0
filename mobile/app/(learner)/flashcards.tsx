import CustomModal from "@/components/CustomModal";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";
import useTheme from "@/hooks/useTheme";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();

  const [modalVisibility, setModalVisibility] = useState(false);

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
                onPress={() => setModalVisibility(true)}
              />
            </CustomText>
          </>
        }
      />
      <CustomView
        variant="colorBase300"
        className="flex-col gap-4 flex-1 px-4 py-4"
      >
        <CustomView className="p-6 rounded-xl gap-2">
          <View className="gap-2">
            <View className="flex flex-row gap-4 items-center">
              <CustomText>
                <MaterialIcons name="info" size={18} />
              </CustomText>
              <CustomText>AI-Generated</CustomText>
            </View>
            <CustomText className="text-sm opacity-40">01/01/1970</CustomText>
          </View>
          <CustomText variant="bold" className="text-3xl">
            Title
          </CustomText>
        </CustomView>
      </CustomView>
      <CustomModal
        modalVisibility={modalVisibility}
        setModalVisibility={setModalVisibility}
      >
        <CustomView
          variant="colorBase100"
          style={{ height: height / 2, gap: 8 }}
          className="rounded-tr-3xl rounded-tl-3xl p-8"
        >
          <CustomText>
            <MaterialIcons
              name="close"
              size={24}
              onPress={() => setModalVisibility(false)}
            />
          </CustomText>
          <CustomText variant="bold" className="text-4xl">
            Filter
          </CustomText>
        </CustomView>
      </CustomModal>
    </SafeAreaView>
  );
}
