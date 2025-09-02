import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialIcons } from "@expo/vector-icons";

import { rgbaToHex } from "@/utils/colors";
import { View, Pressable } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const PomodoroTray = ({
  close,
  openSettings,
}: {
  close: () => void;
  openSettings: () => void;
}) => {
  const { isRunning, mode, pause, reset, start, time } = useTimer();

  const colors: any = [
    rgbaToHex(useTheme.getState().currentScheme.colorPrimary) as any,
    rgbaToHex(useTheme.getState().currentScheme.colorSecondary) as any,
    rgbaToHex(useTheme.getState().currentScheme.colorBase300) as any,
    rgbaToHex(useTheme.getState().currentScheme.colorBase200) as any,
  ];

  return (
    <CustomView variant="colorBase100" className="p-8 gap-6">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <CustomText>
            <MaterialIcons name="close" size={24} onPress={close} />
          </CustomText>
          <View>
            <CustomText variant="bold" className="text-xl">
              {mode === "study" ? "Study Mode" : "Short Break Mode"}
            </CustomText>
            <CustomText className="text-sm" style={{ opacity: 0.5 }}>
              Current mode
            </CustomText>
          </View>
        </View>
        <Pressable onPress={openSettings}>
          <CustomText>
            <MaterialIcons name="settings" size={24} />
          </CustomText>
        </Pressable>
      </View>

      <View className="items-center">
        <CountdownCircleTimer
          isPlaying={isRunning}
          duration={time}
          colors={colors}
          colorsTime={[60, 30, 15, 0]}
          isSmoothColorTransition={true}
          strokeLinecap="round"
          trailColor={useTheme.getState().currentScheme.colorBase300 as any}
        >
          {({ remainingTime }) => (
            <CustomText variant="black" className="text-3xl">
              {formatTime(remainingTime)}
            </CustomText>
          )}
        </CountdownCircleTimer>
      </View>
      <View className="flex flex-row gap-4 justify-center">
        {isRunning && (
          <CustomPressable
            className="flex flex-row gap-2 items-center justify-center rounded-3xl"
            variant="colorBase300"
            onPress={() => pause()}
          >
            <CustomText>
              <MaterialIcons name="pause" size={24} />
            </CustomText>
            <CustomText>Pause</CustomText>
          </CustomPressable>
        )}
        {!isRunning && (
          <CustomPressable
            className="flex flex-row gap-2 items-center justify-center rounded-3xl"
            variant="colorBase300"
            onPress={() => start()}
          >
            <CustomText>
              <MaterialIcons name="play-arrow" size={24} />
            </CustomText>
            <CustomText>Start</CustomText>
          </CustomPressable>
        )}

        <CustomPressable
          className="flex flex-row gap-2 items-center justify-center rounded-3xl"
          variant="colorBase300"
          onPress={() => reset()}
        >
          <CustomText>
            <MaterialIcons name="stop" size={24} />
          </CustomText>
          <CustomText>Stop</CustomText>
        </CustomPressable>
      </View>
    </CustomView>
  );
};

export default PomodoroTray;
