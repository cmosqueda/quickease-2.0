import useTheme from "@/hooks/useTheme";
import CustomPressable from "@/components/CustomPressable";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import ForumHeader from "@/components/ForumHeader";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useTrays } from "react-native-trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyTraysProps } from "@/types/trays/trays";
import { Pressable, View } from "react-native";
import { Link, router } from "expo-router";

export default function Page() {
  const { currentScheme } = useTheme();
  const { push: openTray, pop: closeTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        title="Quizzes"
        rightSideChildren={
          <>
            <CustomText>
              <MaterialIcons
                name="filter-list"
                size={20}
                onPress={() =>
                  openTray("FilterQuizzesTray", { close: closeTray })
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
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(learner)/(quiz)/view/[id]",
              params: { id: "test" },
            })
          }
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
        </Pressable>
      </CustomView>

      <Link asChild href={{ pathname: "/(learner)/(quiz)/create" }}>
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
