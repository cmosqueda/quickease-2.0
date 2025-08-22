import CustomText from "./CustomText";
import CustomView from "./CustomView";

import Entypo from "@expo/vector-icons/Entypo";

import { Pressable, View, ViewProps } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { ReactNode } from "react";
import { useNavigation } from "expo-router";

type ForumHeaderProps = {
  title?: string;
  rightSideChildren?: ReactNode;
  tabChildren?: ReactNode;
} & ViewProps;

export default function ForumHeader({
  title = "QuickEase",
  rightSideChildren,
  tabChildren,
  ...viewProps
}: ForumHeaderProps) {
  const navigation = useNavigation();

  return (
    <View {...viewProps}>
      <CustomView
        variant="colorBase100"
        className="flex flex-row justify-between items-center p-4"
      >
        <View className="flex flex-row gap-4 items-center ">
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <CustomText>
              <Entypo name="menu" size={26} />
            </CustomText>
          </Pressable>
          <CustomText variant="black" className="text-xl">
            {title}
          </CustomText>
        </View>
        {rightSideChildren && (
          <View className="flex flex-row gap-6 items-center">
            {rightSideChildren}
          </View>
        )}
      </CustomView>
      {tabChildren && (
        <CustomView
          variant="colorBase100"
          className="px-8 py-4 flex flex-row gap-4"
        >
          {tabChildren}
        </CustomView>
      )}
    </View>
  );
}
