import useTheme from "@/hooks/useTheme";
import PagerView from "react-native-pager-view";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Image } from "expo-image";
import { useState } from "react";
import { useTrays } from "react-native-trays";
import { useAssets } from "expo-asset";
import { MyTraysProps } from "@/types/trays/trays";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";

import { _BADGES } from "@/types/user/badges";

const Badges = () => {
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

  if (!assets) return null;

  return (
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
          <CustomText>{_BADGES.learningProgress[0].description}</CustomText>
        </View>
      </CustomView>
    </View>
  );
};

const Avatar = () => {
  const { height } = useWindowDimensions();
  const [assets, error] = useAssets([
    require("../../assets/images/avatars/blue.svg"),
    require("../../assets/images/avatars/green.svg"),
    require("../../assets/images/avatars/orange.svg"),
    require("../../assets/images/avatars/purple.svg"),
  ]);
  const { push: openAvatarTray, pop: closeAvatarTray } = useTrays<MyTraysProps>(
    "DismissibleRoundedNoMarginAndSpacingTray"
  );

  if (!assets) return null;

  return (
    <View
      style={{ height: height / 6 }}
      className="flex gap-4 items-center justify-center"
    >
      <Pressable
        className="relative"
        onPress={() =>
          openAvatarTray("ChangeAvatarTray", {
            close: closeAvatarTray,
            avatars: assets,
          })
        }
      >
        <CustomText
          className="bottom-0 absolute z-50 p-1 rounded-full"
          style={{
            backgroundColor: useTheme.getState().currentScheme.colorBase300,
          }}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={16} />
        </CustomText>
        <CustomText>
          <Image
            source={assets![2].localUri}
            style={{ aspectRatio: "1/1", width: 96, height: 96 }}
          />
        </CustomText>
      </Pressable>
      <CustomText variant="bold" className="text-3xl">
        Jhon Lloyd Viernes
      </CustomText>
    </View>
  );
};

export default function Page() {
  const navigation = useNavigation();
  const { currentScheme } = useTheme();

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
      <Avatar />
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
          <Badges />
        </PagerView>
      </CustomView>
    </SafeAreaView>
  );
}
