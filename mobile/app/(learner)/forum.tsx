import useTheme from "@/hooks/useTheme";
import ForumHeader from "@/components/ForumHeader";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function Page() {
  const { currentScheme } = useTheme();

  return (
    <SafeAreaView
      className="flex flex-1"
      style={{
        backgroundColor: currentScheme?.colorBase100,
      }}
    >
      <ForumHeader
        rightSideChildren={
          <>
            <CustomText>
              <FontAwesome5 name="search" size={20} />
            </CustomText>
            <CustomText>
              <FontAwesome6 name="bell" size={22} />
            </CustomText>
          </>
        }
      />
      <CustomView variant="colorBase300" className="flex-1 px-4 py-4">
        <CustomView
          variant="colorBase100"
          className="flex gap-2 p-4 rounded-xl"
        >
          <View className="flex flex-row gap-3 items-center">
            <CustomText className="text-xl" color="colorBaseContent">
              <FontAwesome6 name="user-circle" size={20} />
            </CustomText>
            <CustomText
              variant="bold"
              className="text-xl"
              color="colorBaseContent"
            >
              Jhon Lloyd Viernes
            </CustomText>
          </View>
          <CustomView
            variant="colorBase200"
            className="flex flex-col gap-2 p-4 rounded-xl"
            style={{
              borderColor: currentScheme.colorBase300,
            }}
          ></CustomView>
        </CustomView>
      </CustomView>

      <CustomPressable
        variant="colorPrimary"
        className="absolute bottom-4 right-4 rounded-3xl px-4 py-4 flex-row items-center gap-2 shadow"
      >
        <CustomText color="colorPrimaryContent">
          <MaterialIcons name="post-add" size={32} />
        </CustomText>
      </CustomPressable>
    </SafeAreaView>
  );
}
