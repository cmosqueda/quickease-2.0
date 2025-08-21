/* eslint-disable react-hooks/rules-of-hooks */
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Dimensions, Pressable, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { rgbaToHex } from "@/utils/colors";

export type MyTraysProps = {
  SearchTray: { close: () => void };
  NotificationTray: { close: () => void };
  FilterQuizzesTray: { close: () => void };
  FilterNotesTray: { close: () => void };
  FilterFlashcardsTray: { close: () => void };
  PomodoroTray: { close: () => void };
};

const _TRAYS = {
  SearchTray: {
    component: ({ close }: { close: () => void }) => (
      <CustomView
        variant="colorBase100"
        className="rounded-tr-3xl rounded-tl-3xl p-8 gap-4"
      >
        <Pressable onPress={close}>
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
    component: ({ close }: { close: () => void }) => (
      <CustomView
        variant="colorBase100"
        style={{ height: Dimensions.get("screen").height / 1.1, gap: 8 }}
        className="px-8 py-12"
      >
        <CustomText>
          <MaterialIcons name="close" size={24} onPress={close} />
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
  FilterQuizzesTray: {
    component: ({ close }: { close: () => void }) => (
      <CustomView
        variant="colorBase100"
        style={{ height: Dimensions.get("screen").height / 2, gap: 8 }}
        className="rounded-tr-3xl rounded-tl-3xl p-8"
      >
        <CustomText>
          <MaterialIcons name="close" size={24} onPress={close} />
        </CustomText>
        <CustomText variant="bold" className="text-4xl">
          Filter
        </CustomText>
      </CustomView>
    ),
  },
  FilterNotesTray: {
    component: ({ close }: { close: () => void }) => (
      <CustomView
        variant="colorBase100"
        style={{ height: Dimensions.get("screen").height / 2, gap: 8 }}
        className="rounded-tr-3xl rounded-tl-3xl p-8"
      >
        <CustomText>
          <MaterialIcons name="close" size={24} onPress={close} />
        </CustomText>
        <CustomText variant="bold" className="text-4xl">
          Filter
        </CustomText>
      </CustomView>
    ),
  },
  FilterFlashcardsTray: {
    component: ({ close }: { close: () => void }) => (
      <CustomView
        variant="colorBase100"
        style={{ height: Dimensions.get("screen").height / 2, gap: 8 }}
        className="rounded-tr-3xl rounded-tl-3xl p-8"
      >
        <CustomText>
          <MaterialIcons name="close" size={24} onPress={close} />
        </CustomText>
        <CustomText variant="bold" className="text-4xl">
          Filter
        </CustomText>
      </CustomView>
    ),
  },
  PomodoroTray: {
    component: ({ close }: { close: () => void }) => {
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
                  {mode[0].toUpperCase()}
                  {mode.slice(1)} Mode
                </CustomText>
                <CustomText className="text-sm" style={{ opacity: 0.5 }}>
                  Current mode
                </CustomText>
              </View>
            </View>
            <CustomText>
              <MaterialIcons name="settings" size={24} />
            </CustomText>
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
    },
  },
};

export default _TRAYS;
