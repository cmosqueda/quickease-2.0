import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "../CustomText";
import CustomView from "../CustomView";
import CustomPressable from "../CustomPressable";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { View, Pressable } from "react-native";

const PomodoroComponent = () => {
  const { isRunning, mode, pause, reset, start, time } = useTimer();

  return (
    <CustomView variant="colorBase100" className="p-4 gap-2 rounded-3xl">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row gap-4 items-center">
          <View>
            <CustomText variant="bold" className="">
              {mode === "study" ? "Study Mode" : "Short Break Mode"}
            </CustomText>
            <CustomText className="text-xs" style={{ opacity: 0.5 }}>
              Current mode
            </CustomText>
          </View>
        </View>
        <Pressable
          onPress={() => {
            reset();
            useTimer.setState((state) => {
              state.mode = "study";
            });
          }}
        >
          <CustomText>
            <MaterialCommunityIcons name="refresh" size={24} />
          </CustomText>
        </Pressable>
      </View>

      <View className="flex flex-row gap-4 items-center justify-between">
        <View className="items-center">
          <CustomText variant="black" className="text-3xl">
            {formatTime(time)}
          </CustomText>
        </View>
        <View className="flex flex-row gap-2 justify-center">
          {isRunning && (
            <CustomPressable
              className="flex flex-row gap-2 items-center justify-center rounded-3xl"
              variant="colorBase300"
              onPress={() => pause()}
            >
              <CustomText>
                <MaterialIcons name="pause" size={20} />
              </CustomText>
            </CustomPressable>
          )}
          {!isRunning && (
            <CustomPressable
              className="flex flex-row gap-2 items-center justify-center rounded-3xl"
              variant="colorBase300"
              onPress={() => start()}
            >
              <CustomText>
                <MaterialIcons name="play-arrow" size={20} />
              </CustomText>
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
          </CustomPressable>
        </View>
      </View>
    </CustomView>
  );
};

export default PomodoroComponent;
