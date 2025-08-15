import Entypo from "@expo/vector-icons/Entypo";
import CustomText from "./CustomText";
import useTheme from "@/hooks/useTheme";
import CustomView from "./CustomView";

import { Pressable, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function ForumHeader({
  title = "QuickEase",
  rightSideChildren,
}: {
  title?: string;
  rightSideChildren: React.ReactNode;
}) {
  const { currentScheme } = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <CustomView
        variant="colorBase100"
        className="flex flex-row justify-between items-center px-4 pt-2"
      >
        <View className="flex flex-row gap-4 items-center ">
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <CustomText>
              <Entypo name="menu" size={26} />
            </CustomText>
          </Pressable>
          <CustomText variant="bold" className="text-xl">
            {title}
          </CustomText>
        </View>
        <View className="flex flex-row gap-6 items-center">
          {rightSideChildren}
        </View>
      </CustomView>
    </>
  );
}
