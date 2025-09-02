import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialIcons } from "@expo/vector-icons";

import { View } from "react-native";
import { Picker } from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";

const PomodoroSettingsTray = ({ back }: { back: () => void }) => {
  const { settings } = useTimer();

  const [index, setIndex] = useState(0);

  const tabs = [
    <View key={0} className="flex gap-4">
      <TimerPicker
        initialValue={{ seconds: settings.study }}
        styles={{
          backgroundColor: useTheme.getState().currentScheme.colorBase100,
          text: {
            color: useTheme.getState().currentScheme.colorBaseContent,
          },
        }}
      />
      <CustomText variant="bold" className="text-sm" style={{ opacity: 0.5 }}>
        Study session is currently set to {formatTime(settings.study)} minutes
      </CustomText>
    </View>,
    <View key={1} className="flex gap-4">
      <TimerPicker
        initialValue={{ seconds: settings.shortBreak }}
        styles={{
          backgroundColor: useTheme.getState().currentScheme.colorBase100,
          text: {
            color: useTheme.getState().currentScheme.colorBaseContent,
          },
        }}
      />
      <CustomText variant="bold" className="text-sm" style={{ opacity: 0.5 }}>
        Break session is currently set to {formatTime(settings.shortBreak)}{" "}
        minutes
      </CustomText>
    </View>,
  ]; // 0 - Study | 1 - Break

  return (
    <CustomView variant="colorBase100" className="p-8 gap-6">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              onPress={back}
            />
          </CustomText>
          <View>
            <CustomText variant="bold" className="text-xl">
              Settings
            </CustomText>
            <CustomText className="text-sm" style={{ opacity: 0.5 }}>
              {index == 0 ? "Study" : "Break"} session
            </CustomText>
          </View>
        </View>
        <Picker
          options={["Study", "Break"]}
          selectedIndex={index}
          onOptionSelected={({ nativeEvent: { index } }) => {
            setIndex(index);
          }}
          variant="segmented"
        />
      </View>
      {tabs[index]}
      <CustomPressable
        variant="colorBase200"
        className="rounded-3xl justify-center items-center"
      >
        <CustomText>Save</CustomText>
      </CustomPressable>
    </CustomView>
  );
};

export default PomodoroSettingsTray;
