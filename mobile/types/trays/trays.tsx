import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomView from "@/components/CustomView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Dimensions, Pressable, View } from "react-native";

const _TRAYS = {
  SearchTray: {
    component: (props: any) => (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl p-8 gap-4"
      >
        <Pressable onPress={props.close}>
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
          />
        </View>
      </CustomView>
    ),
  },
  NotificationTray: {
    component: (props: any) => (
      <CustomView
        variant="colorBase100"
        style={{ height: Dimensions.get("screen").height / 1.1, gap: 8 }}
        className="px-8 py-12"
      >
        <CustomText>
          <MaterialIcons name="close" size={24} onPress={props.close} />
        </CustomText>
        <CustomText variant="bold" className="text-4xl">
          Notifications
        </CustomText>
        <CustomView
          variant="colorBase200"
          className="p-6 flex flex-row gap-4 items-center rounded-xl"
        >
          <CustomText>
            <MaterialIcons name="notifications" size={24} />
          </CustomText>
          <CustomText>Test</CustomText>
        </CustomView>
      </CustomView>
    ),
  },
};

export default _TRAYS;
