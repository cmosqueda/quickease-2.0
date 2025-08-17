import CustomText from "@/components/CustomText";
import useTheme from "@/hooks/useTheme";
import Entypo from "@expo/vector-icons/Entypo";

import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { currentScheme } = useTheme();
  const navigation = useNavigation();

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
    </SafeAreaView>
  );
}
