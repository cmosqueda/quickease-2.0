import useTheme from "@/hooks/useTheme";
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

export default function Page() {
  const navigation = useNavigation();
  const { currentScheme } = useTheme();
  const { height } = useWindowDimensions();

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
        className="flex-1 p-4 mt-8 rounded-tl-3xl rounded-tr-3xl"
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
      </CustomView>
    </SafeAreaView>
  );
}
