/* eslint-disable react-hooks/rules-of-hooks */
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import formatTime from "@/utils/format_time";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { User } from "../user/types";
import { Image } from "expo-image";
import { Asset } from "expo-asset";
import { Picker } from "@expo/ui/jetpack-compose";
import { rgbaToHex } from "@/utils/colors";
import { TimerPicker } from "react-native-timer-picker";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Dimensions, Pressable, ToastAndroid, View } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";

import _THEMES from "../theme/Themes";
import _API_INSTANCE from "@/utils/axios";

export type MyTraysProps = {
  SearchTray: { close: () => void };
  NotificationTray: { close: () => void };
  FilterQuizzesTray: { close: () => void };
  FilterNotesTray: { close: () => void };
  FilterFlashcardsTray: { close: () => void };
  PomodoroTray: {
    close: () => void;
    openSettings: () => void;
  };
  PomodoroSettingsTray: { back: () => void };
  TagsTray: {
    tags: any[];
    setTags: Dispatch<SetStateAction<any>>;
    close: () => void;
  };
  ChangeThemesTray: { close: () => void };
  ChangeAvatarTray: { avatars: Asset[]; close: () => void };
  ChangeNameTray: {
    firstName: string;
    setFirstName: Dispatch<SetStateAction<string>>;
    lastName: string;
    setLastName: Dispatch<SetStateAction<string>>;

    close: () => void;
  };
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
        className="p-8"
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
    component: ({
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
                  {mode[0].toUpperCase()}
                  {mode.slice(1)} Mode
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
    },
  },
  PomodoroSettingsTray: {
    component: ({ back }: { back: () => void }) => {
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
          <CustomText
            variant="bold"
            className="text-sm"
            style={{ opacity: 0.5 }}
          >
            Study session is currently set to {formatTime(settings.study)}{" "}
            minutes
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
          <CustomText
            variant="bold"
            className="text-sm"
            style={{ opacity: 0.5 }}
          >
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
    },
  },
  TagsTray: {
    component: ({
      tags,
      setTags,
      close,
    }: {
      tags: any[];
      setTags: Dispatch<SetStateAction<any>>;
      close: () => void;
    }) => {
      return (
        <CustomView
          variant="colorBase100"
          style={{ maxHeight: Dimensions.get("screen").height / 1.5, gap: 8 }}
          className="p-8 gap-4 rounded-tl-3xl rounded-tr-3xl"
        >
          <View className="flex flex-row gap-4 items-center">
            <Pressable onPress={close}>
              <CustomText>
                <MaterialIcons name="keyboard-arrow-left" size={24} />
              </CustomText>
            </Pressable>
            <CustomText variant="bold" className="text-4xl">
              Tags
            </CustomText>
          </View>
          <View className="gap-2">
            <CustomText>Add tag</CustomText>
            <View className="flex flex-row gap-4 items-center">
              <CustomTextInput className="rounded-xl flex-1" />
              <CustomPressable
                variant="colorBase200"
                style={{ paddingHorizontal: 16, paddingVertical: 16 }}
                className="rounded-3xl"
              >
                <MaterialCommunityIcons name="plus" />
              </CustomPressable>
            </View>
          </View>
          {tags && tags.length > 0 && (
            <View className="gap-2">
              <CustomText>Tags</CustomText>
            </View>
          )}
        </CustomView>
      );
    },
  },
  ChangeThemesTray: {
    component: ({ close }: { close: () => void }) => {
      const { setCurrentScheme } = useTheme();

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl p-8 gap-8"
        >
          <CustomText>
            <MaterialIcons name="close" size={24} onPress={close} />
          </CustomText>

          <View className="gap-4">
            <CustomText>Light</CustomText>
            <CustomView
              variant="colorBase200"
              className="flex flex-row gap-4 flex-wrap p-4 rounded-3xl justify-center"
            >
              {Object.values(_THEMES)
                .filter((theme) => theme.colorscheme === "light")
                .map((theme) => (
                  <Pressable
                    onPress={() => setCurrentScheme(theme.name)}
                    key={theme.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase100 }}
                      />
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase200 }}
                      />
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorPrimary }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: theme.colorSecondary,
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
            </CustomView>
          </View>

          <View className="gap-4">
            <CustomText>Dark</CustomText>
            <CustomView
              variant="colorBase200"
              className="flex flex-row gap-4 flex-wrap p-4 rounded-3xl justify-center"
            >
              {Object.values(_THEMES)
                .filter((theme) => theme.colorscheme === "dark")
                .map((theme) => (
                  <Pressable
                    onPress={() => setCurrentScheme(theme.name)}
                    key={theme.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase100 }}
                      />
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorBase200 }}
                      />
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{ flex: 1, backgroundColor: theme.colorPrimary }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: theme.colorSecondary,
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
            </CustomView>
          </View>
        </CustomView>
      );
    },
  },
  ChangeAvatarTray: {
    component: ({
      avatars,
      close,
    }: {
      avatars: Asset[];
      close: () => void;
    }) => {
      const [selectedAvatar, setSelectedAvatar] = useState(0);
      const avatarIndex = ["blue.svg", "green.svg", "orange.svg", "purple.svg"];

      const [isSaving, setIsSaving] = useState(false);

      const handleUpdate = async () => {
        setIsSaving(true);
        const temp = useAuth.getState().user as User;

        try {
          const { status } = await _API_INSTANCE.put(
            "/users/change-avatar",
            {
              avatar_id: avatarIndex[selectedAvatar]?.replace(".svg", ""),
            },
            {
              timeout: 8 * 60 * 1000,
            }
          );

          if (status === 200) {
            useAuth.setState({
              user: {
                ...temp,
                avatar: avatarIndex[selectedAvatar]!.replace(".svg", ""),
              },
            });

            close();
          }
        } catch (err) {
          ToastAndroid.show(
            err.message || "Error updating avatar.",
            ToastAndroid.SHORT
          );
        } finally {
          setIsSaving(false);
        }
      };

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl p-8 gap-8"
        >
          <CustomText>
            <MaterialIcons name="close" size={24} onPress={close} />
          </CustomText>

          <View className="gap-4 flex flex-row items-center justify-center flex-wrap">
            {avatars.map((avatar: any, index: number) => (
              <Pressable
                key={index}
                className="relative"
                onPress={() => setSelectedAvatar(index)}
              >
                {selectedAvatar == index && (
                  <CustomText
                    color="colorBase300"
                    className="absolute top-0 z-50"
                  >
                    <MaterialCommunityIcons name="check-circle" size={24} />
                  </CustomText>
                )}

                <Image
                  source={avatar.localUri}
                  style={{ width: 64, height: 64, aspectRatio: "1/1" }}
                />
              </Pressable>
            ))}
          </View>
          <CustomPressable
            variant="colorBase200"
            className="rounded-3xl items-center"
            disabled={isSaving}
            onPress={handleUpdate}
          >
            <CustomText>{isSaving ? "Saving..." : "Save"}</CustomText>
          </CustomPressable>
        </CustomView>
      );
    },
  },
  ChangeNameTray: {
    component: ({
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
    },
  },
};

export default _TRAYS;
