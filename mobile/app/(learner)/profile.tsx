import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { _BADGES } from "@/types/user/badges";

export default function Page() {
  const navigation = useNavigation();
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();
  const [assets, error] = useAssets([
    require("../../assets/images/badges/achiever-gradient.png"),
    require("../../assets/images/badges/community-favorite-gradient.png"),
    require("../../assets/images/badges/first-post-gradient.png"),
    require("../../assets/images/badges/first-step-gradient.png"),
    require("../../assets/images/badges/flashcard-master-gradient.png"),
    require("../../assets/images/badges/helpful-commenter-gradient.png"),
    require("../../assets/images/badges/master-reviewer-gradient.png"),
    require("../../assets/images/badges/note-taker-gradient.png"),
    require("../../assets/images/badges/perfectionist-gradient.png"),
    require("../../assets/images/badges/quick-learner-gradient.png"),
  ]);

  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <View className="flex flex-row justify-between items-center px-4 py-2">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <CustomText>
            <Entypo name="menu" size={26} />
          </CustomText>
        </Pressable>
      </View>
      <View
        style={{ height: height / 6 }}
        className="flex gap-2 items-center justify-center"
      >
        <Pressable>
          <CustomText>
            <MaterialIcons name="account-circle" size={96} />
          </CustomText>
        </Pressable>
        <CustomText variant="bold" className="text-3xl">
          Jhon Lloyd Viernes
        </CustomText>
      </View>
      <CustomView
        className="flex-1 p-4 mt-8 rounded-tl-3xl rounded-tr-3xl gap-4"
        variant="colorBase200"
      >
        <View className="flex flex-row gap-2">
          <CustomPressable
            variant={index == 0 ? "colorPrimary" : "colorBase300"}
            className="flex-1 rounded-3xl flex flex-row gap-2 justify-center"
            onPress={() => setIndex(0)}
          >
            <CustomText
              color={index == 0 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Badges
            </CustomText>
          </CustomPressable>
          <CustomPressable
            variant={index == 1 ? "colorPrimary" : "colorBase300"}
            className="flex-1 rounded-3xl flex flex-row gap-2 justify-center"
            onPress={() => setIndex(1)}
          >
            <CustomText
              color={index == 1 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Stats
            </CustomText>
          </CustomPressable>
          <CustomPressable
            variant={index == 2 ? "colorPrimary" : "colorBase300"}
            className="flex-1 rounded-3xl flex flex-row gap-2 justify-center"
            onPress={() => setIndex(2)}
          >
            <CustomText
              color={index == 2 ? "colorPrimaryContent" : "colorBaseContent"}
            >
              Posts
            </CustomText>
          </CustomPressable>
        </View>
        <PagerView style={{ flex: 1 }}>
          <View className="flex flex-col gap-4" key={0}>
            <CustomView
              variant="colorBase300"
              className="p-4 flex flex-row gap-4 items-center rounded-3xl"
            >
              <Image
                source={assets![0].localUri}
                style={{ width: 84, height: 84, aspectRatio: "1/1" }}
              />
              <View className="flex-1">
                <CustomText variant="bold" className="text-lg">
                  {_BADGES.learningProgress[0].name}
                </CustomText>
                <CustomText>
                  {_BADGES.learningProgress[0].description}
                </CustomText>
              </View>
            </CustomView>
          </View>
        </PagerView>
      </CustomView>
    </SafeAreaView>
  );
}
