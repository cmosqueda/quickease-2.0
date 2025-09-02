import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";
import CustomTextInput from "../CustomTextInput";

import { MaterialIcons } from "@expo/vector-icons";

import { View } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";

const ChangeNameTray = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  close,
}: {
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  close: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <CustomView
      variant="colorBase100"
      className="rounded-tr-3xl rounded-tl-3xl p-8 gap-4"
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={close}
            />
          </CustomText>
          <View>
            <CustomText variant="bold" className="text-xl">
              Change name
            </CustomText>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <CustomText className="text-sm" style={{ opacity: 0.5 }}>
          First Name
        </CustomText>
        <CustomTextInput
          value={firstName}
          onChangeText={setFirstName}
          className="rounded-xl"
        />
      </View>
      <View className="gap-1">
        <CustomText className="text-sm" style={{ opacity: 0.5 }}>
          Last Name
        </CustomText>
        <CustomTextInput
          value={lastName}
          onChangeText={setLastName}
          className="rounded-xl"
        />
      </View>
      <CustomPressable
        disabled={isUpdating}
        variant="colorBase200"
        className="rounded-3xl items-center"
      >
        <CustomText>Update</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default ChangeNameTray;
