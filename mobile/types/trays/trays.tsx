/* eslint-disable react-hooks/rules-of-hooks */
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import useTimer from "@/hooks/useTimer";
import PagerView from "react-native-pager-view";
import formatTime from "@/utils/format_time";
import CustomText from "@/components/CustomText";
import CustomView from "@/components/CustomView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomPressable from "@/components/CustomPressable";
import CustomTextInput from "@/components/CustomTextInput";
import CommentComponent from "@/components/CommentComponent";
import * as DocumentPicker from "expo-document-picker";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { toast } from "sonner-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Picker } from "@expo/ui/jetpack-compose";
import { useQuery } from "@tanstack/react-query";
import { rgbaToHex } from "@/utils/colors";
import { useComment } from "@/hooks/useComment";
import { TimerPicker } from "react-native-timer-picker";
import { Asset, useAssets } from "expo-asset";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Comment, Note, Notification, Post, User } from "../user/types";

import {
  RichText,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import _THEMES from "../theme/Themes";
import _API_INSTANCE from "@/utils/axios";
import _EDITOR_BRIDGE_EXTENSIONS from "../theme/TenTapThemes";

import { _AVATAR_ASSET_MAP } from "../user/avatars";
import { _BADGE_ASSET_MAP, _BADGE_MAP } from "../user/badges";

export type MyTraysProps = {
  SearchTray: { close: () => void };
  NotificationTray: { close: () => void };
  FilterQuizzesTray: { close: () => void };
  FilterNotesTray: {
    close: () => void;
    notes?: Note[];
    setNotes: SetStateAction<Dispatch<Note[]>>;
  };
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
  RepliesTray: {
    comment: Comment;
    close: () => void;
  };
  CommentOnPostTray: {
    post: Post;
    close: () => void;
  };
  ViewOtherProfileTray: {
    user: User;
    close: () => void;
  };
  StudyToolsSelectionTray: {
    openGenerateFromNotes: () => void;
    openUploadFile: () => void;
    close: () => void;
    type: "quiz" | "flashcard";
  };
  SummarizeNotesStudyToolsSelectionTray: {
    openUploadDocument: () => void;
    openUploadImage: () => void;
    close: () => void;
  };
  GenerateFromNotesTray: {
    close: () => void;
    type: "quiz" | "flashcard";
  };
  GenerateFromDocumentTray: {
    close: () => void;
    type: "quiz" | "flashcard" | "summary-notes";
  };
  GenerateFromImageTray: {
    close: () => void;
    type: "quiz" | "flashcard" | "summary-notes";
  };
};

const _TRAYS = {
  SearchTray: {
    component: ({ close }: { close: () => void }) => {
      const [query, setQuery] = useState("");

      return (
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
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => {
                router.push({
                  pathname: "/search/[query]",
                  params: { query: query },
                });
                close();
              }}
            />
          </View>
        </CustomView>
      );
    },
  },
  NotificationTray: {
    component: ({ close }: { close: () => void }) => {
      const { user } = useAuth();
      const { data, isFetching, isError, refetch } = useQuery({
        queryKey: [user?.id, "user-notifications"],
        queryFn: async () => {
          try {
            const { data } =
              await _API_INSTANCE.get<Notification[]>("notifications");

            return data;
          } catch (err) {
            throw err;
          }
        },
        enabled: !!user?.id,
      });

      return (
        <CustomView
          variant="colorBase100"
          style={{ height: Dimensions.get("screen").height / 1.1, gap: 8 }}
          className="p-8"
        >
          <CustomText>
            <MaterialIcons name="close" size={24} onPress={close} />
          </CustomText>
          <View className="flex flex-row items-center justify-between">
            <CustomText variant="bold" className="text-4xl">
              Notifications
            </CustomText>
            <Pressable>
              <CustomText>
                <MaterialCommunityIcons name="refresh" size={24} />
              </CustomText>
            </Pressable>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="gap-4"
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
                tintColor={
                  useTheme.getState().currentScheme.colorPrimaryContent
                }
                titleColor={
                  useTheme.getState().currentScheme.colorPrimaryContent
                }
                colors={[useTheme.getState().currentScheme.colorPrimaryContent]}
                progressBackgroundColor={
                  useTheme.getState().currentScheme.colorPrimary
                }
              />
            }
            renderItem={({ item }) => (
              <CustomView
                variant="colorBase200"
                className="p-6 flex flex-row gap-4 items-center rounded-xl"
              >
                <CustomText>
                  <MaterialIcons name="notifications" size={24} />
                </CustomText>
                <CustomText className="flex-1">{item.message}</CustomText>
              </CustomView>
            )}
          />
        </CustomView>
      );
    },
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
    component: ({
      close,
      notes,
      setNotes,
    }: {
      close: () => void;
      notes?: Note[];
      setNotes: SetStateAction<Dispatch<Note[]>>;
    }) => (
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
          toast(err.message || "Error updating avatar.");
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
  RepliesTray: {
    component: ({
      comment,
      close,
    }: {
      comment: Comment;
      close: () => void;
    }) => {
      if (comment.replies.length > 0) {
        return (
          <CustomView
            variant="colorBase100"
            className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
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
                    Replies
                  </CustomText>
                </View>
              </View>
            </View>
            <ScrollView contentContainerClassName="gap-4">
              {comment.replies.map((reply: Comment) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  invalidateKey={["view-post", comment.post_id]}
                  disableCommentBtn
                />
              ))}
            </ScrollView>
          </CustomView>
        );
      }
    },
  },
  CommentOnPostTray: {
    component: ({ post, close }: { post: Post; close: () => void }) => {
      const [isSubmitting, setIsSubmitting] = useState(false);

      const editor = useEditorBridge({
        theme: {
          webview: {
            padding: 8,
            backgroundColor: useTheme.getState().currentScheme.colorBase100,
          },
        },
        bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
        dynamicHeight: true,
      });

      const editorContent = useEditorContent(editor, {
        type: "html",
      });

      const { mutate: createComment, isPending } = useComment([
        ["view-post", post.id],
      ]);

      const handleSubmit = () => {
        if (!editorContent) {
          toast("Empty comment?");
          return;
        }
        setIsSubmitting(true);

        createComment(
          {
            body: editorContent,
            post_id: post.id,
          },
          {
            onSuccess: () => {
              close();
              setIsSubmitting(false);
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      };

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl p-4 gap-4 flex-1"
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
                  Comment to
                </CustomText>
                <CustomText className="text-sm">{post.title}</CustomText>
              </View>
            </View>
          </View>
          <KeyboardAvoidingView
            style={{
              minHeight: Dimensions.get("screen").height / 2,
              maxHeight: Dimensions.get("screen").height / 1.5,
            }}
          >
            {editor && <RichText editor={editor} />}
          </KeyboardAvoidingView>
          <CustomPressable
            className="rounded-3xl items-center"
            variant="colorBase300"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <CustomText>Comment</CustomText>
          </CustomPressable>
        </CustomView>
      );
    },
  },
  ViewOtherProfileTray: {
    component: ({ user, close }: { user: User; close: () => void }) => {
      const pagerViewRef = useRef<PagerView>(null);

      const { data: _USER } = useQuery({
        enabled: !!user?.id,
        queryKey: user?.id ? [user.id] : [],
        queryFn: async () => {
          try {
            const { data } = await _API_INSTANCE.get(`/users/view/${user.id}`);

            return data;
          } catch (err) {
            close();
            throw err;
          }
        },
        retry: 3,
      });

      const PostComponent = ({ post }: { post: Post }) => {
        const { currentScheme } = useTheme();
        const editor = useEditorBridge({
          theme: {
            webview: {
              padding: 8,
              backgroundColor: currentScheme.colorBase300,
            },
          },
          bridgeExtensions: _EDITOR_BRIDGE_EXTENSIONS,
          dynamicHeight: true,
          editable: false,
          initialContent: post.post_body,
        });

        if (editor) {
          return (
            <View>
              <CustomText
                variant="bold"
                className="text-2xl"
                color="colorBaseContent"
              >
                {post.title}
              </CustomText>
              <CustomView
                key={post.id}
                variant="colorBase300"
                className="p-4 rounded-3xl"
              >
                <RichText editor={editor} />
              </CustomView>
            </View>
          );
        }
      };

      const Badges = ({ user }: { user: User }) => {
        const badgeIds = Object.keys(_BADGE_ASSET_MAP);
        const [assets] = useAssets(Object.values(_BADGE_ASSET_MAP));

        if (!assets) return null;

        return (
          <ScrollView contentContainerClassName="flex flex-col gap-4">
            {user?.badges.map(
              (badge: { id: string; title: string; description: string }) => {
                const badgeMeta = _BADGE_MAP[badge.id];

                if (!badgeMeta) return null;

                const index = badgeIds.indexOf(badge.id);
                if (index === -1) return null;

                const asset = assets[index];

                return (
                  <CustomView
                    key={badge.id}
                    variant="colorBase300"
                    className="p-4 flex flex-row gap-4 items-center rounded-3xl"
                  >
                    <Image
                      source={{ uri: asset.localUri ?? asset.uri }}
                      style={{ width: 84, height: 84, aspectRatio: 1 }}
                    />
                    <View className="flex-1">
                      <CustomText
                        variant="bold"
                        className="text-lg"
                        color="colorBaseContent"
                      >
                        {badgeMeta.name}
                      </CustomText>
                      <CustomText color="colorBaseContent">
                        {badgeMeta.description}
                      </CustomText>
                    </View>
                  </CustomView>
                );
              }
            )}
          </ScrollView>
        );
      };

      const Posts = ({ posts }: { posts: Post[] }) => {
        if (posts.length === 0) {
          return (
            <CustomView className="flex items-center justify-center p-4">
              <CustomText>No posts yet.</CustomText>
            </CustomView>
          );
        }

        return (
          <ScrollView
            contentContainerClassName="flex flex-col gap-4"
            style={{ maxHeight: Dimensions.get("screen").height / 1.5 }}
          >
            {posts.map((post) => {
              return <PostComponent post={post} key={post.id} />;
            })}
          </ScrollView>
        );
      };

      const Avatar = ({ user }: { user: User }) => {
        const { height } = useWindowDimensions();

        const avatarIds = Object.keys(_AVATAR_ASSET_MAP);
        const [assets] = useAssets(Object.values(_AVATAR_ASSET_MAP));

        if (!assets) return null;

        // Fallback if user.avatar is missing/invalid
        const avatarId =
          user?.avatar && avatarIds.includes(user.avatar)
            ? user.avatar
            : "blue";

        const avatarIndex = avatarIds.indexOf(avatarId);
        const avatarAsset = assets[avatarIndex];

        return (
          <View
            style={{ height: height / 6 }}
            className="flex gap-4 items-center justify-center"
          >
            {avatarAsset && (
              <Image
                source={{ uri: avatarAsset.localUri ?? avatarAsset.uri }}
                style={{ aspectRatio: 1, width: 96, height: 96 }}
              />
            )}

            <View className="items-center">
              <CustomText variant="bold" className="text-3xl">
                {user?.first_name} {user?.last_name}
              </CustomText>
            </View>
          </View>
        );
      };

      if (_USER) {
        return (
          <CustomView
            variant="colorBase100"
            className="rounded-tr-3xl rounded-tl-3xl p-4 gap-4"
          >
            <CustomText className="p-4">
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                onPress={close}
              />
            </CustomText>
            <Avatar user={user} />
            <PagerView
              ref={pagerViewRef}
              style={{ height: Dimensions.get("screen").height / 2, gap: 16 }}
            >
              <Badges key={0} user={_USER} />
              <Posts key={1} posts={_USER.posts} />
            </PagerView>
          </CustomView>
        );
      }
    },
  },
  StudyToolsSelectionTray: {
    component: ({
      openGenerateFromNotes,
      openUploadFile,
      close,
      type,
    }: {
      openGenerateFromNotes: () => void;
      openUploadFile: () => void;
      close: () => void;
      type: "quiz" | "flashcard";
    }) => {
      const { currentScheme } = useTheme();

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
        >
          <View className="flex flex-row gap-4 items-center">
            <CustomText>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                onPress={close}
              />
            </CustomText>
            <CustomText variant="bold" className="text-xl">
              {type === "quiz" ? "Quiz" : "Flashcard"} Study Tools
            </CustomText>
          </View>
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase200 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
            onPress={openGenerateFromNotes}
          >
            <CustomText>
              <MaterialCommunityIcons name="note-multiple" size={32} />
            </CustomText>
            <Pressable className="flex-1">
              <CustomText className="text-xl" variant="black">
                Select from notes
              </CustomText>
              <CustomText className="opacity-60">
                Generate a {type} from selecting one of your notes.
              </CustomText>
            </Pressable>
          </Pressable>
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase200 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
            onPress={openUploadFile}
          >
            <CustomText>
              <MaterialCommunityIcons name="file-upload" size={32} />
            </CustomText>
            <View className="flex-1">
              <CustomText className="text-xl" variant="black">
                Upload file
              </CustomText>
              <CustomText className="opacity-60">
                Generate a {type} by uploading a document.
              </CustomText>
            </View>
          </Pressable>
        </CustomView>
      );
    },
  },
  SummarizeNotesStudyToolsSelectionTray: {
    component: ({
      openUploadDocument,
      openUploadImage,
      close,
    }: {
      openUploadDocument: () => void;
      openUploadImage: () => void;
      close: () => void;
    }) => {
      const { currentScheme } = useTheme();

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
        >
          <View className="flex flex-row gap-4 items-center">
            <CustomText>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                onPress={close}
              />
            </CustomText>
            <CustomText variant="bold" className="text-xl">
              Notes Study Tools
            </CustomText>
          </View>
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase200 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
            onPress={openUploadDocument}
          >
            <CustomText>
              <MaterialCommunityIcons name="file-upload" size={32} />
            </CustomText>
            <View className="flex-1">
              <CustomText className="text-xl" variant="black">
                Upload document
              </CustomText>
              <CustomText className="opacity-60">
                Generate a summary note by uploading a document.
              </CustomText>
            </View>
          </Pressable>
          <Pressable
            style={{ backgroundColor: currentScheme.colorBase200 }}
            className="p-6 rounded-xl flex flex-row gap-6 items-center"
            onPress={openUploadImage}
          >
            <CustomText>
              <MaterialCommunityIcons name="file-upload" size={32} />
            </CustomText>
            <View className="flex-1">
              <CustomText className="text-xl" variant="black">
                Upload image
              </CustomText>
              <CustomText className="opacity-60">
                Generate a summary note by uploading an image.
              </CustomText>
            </View>
          </Pressable>
        </CustomView>
      );
    },
  },
  GenerateFromNotesTray: {
    component: ({
      close,
      type,
    }: {
      close: () => void;
      type: "quiz" | "flashcard";
    }) => {
      const { user } = useAuth();

      const [index, setIndex] = useState(0);

      const handleGenerateQuiz = async (id: string) => {
        setIndex(1);

        try {
          const { data } = await _API_INSTANCE.post(
            "/ai/generate-quiz-from-note",
            {
              note_id: id,
            },
            { timeout: 8 * 60 * 1000 }
          );

          await AsyncStorage.setItem(
            "app-ai-generated-quiz",
            JSON.stringify(data)
          );

          router.push("/(learner)/(quiz)/ai/generated");
          close();
        } catch (err) {
          toast.error("Error generating content.");
          throw err;
        }
      };

      const handleGenerateFlashcards = async (id: string) => {
        setIndex(1);

        try {
          const { data } = await _API_INSTANCE.post(
            "/ai/generate-flashcards-from-note",
            {
              note_id: id,
            },
            { timeout: 8 * 60 * 1000 }
          );

          await AsyncStorage.setItem(
            "app-ai-generated-flashcards",
            JSON.stringify(data)
          );

          router.push("/(learner)/(flashcard)/ai/generated");
          close();
        } catch (err) {
          toast.error("Error generating content.");
          throw err;
        }
      };

      const tabs = [
        <>
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
                Generate {type === "quiz" ? "quiz" : "flashcards"} from notes
              </CustomText>
              <CustomText className="text-sm opacity-60">
                Select a note
              </CustomText>
            </View>
          </View>
          <ScrollView contentContainerClassName="gap-4">
            {user?.notes
              .filter((note: Note) => note.is_ai_generated === false)
              .map((note: Note) => (
                <Pressable
                  key={note.id}
                  onPress={() => {
                    if (type == "quiz") {
                      handleGenerateQuiz(note.id);
                    } else {
                      handleGenerateFlashcards(note.id);
                    }
                  }}
                >
                  <CustomView
                    variant="colorPrimary"
                    className="p-6 rounded-xl gap-2"
                  >
                    {note.is_ai_generated && (
                      <View className="flex flex-row gap-4 items-center">
                        <CustomText color="colorPrimaryContent">
                          <MaterialIcons name="info" size={18} />
                        </CustomText>
                        <CustomText color="colorPrimaryContent">
                          AI-Generated
                        </CustomText>
                      </View>
                    )}
                    <CustomText
                      color="colorPrimaryContent"
                      className="text-sm opacity-70"
                    >
                      {dayjs(note.updated_at)
                        .format("hh:mm A / MMMM DD, YYYY")
                        .toString()}
                    </CustomText>
                    <CustomText
                      color="colorPrimaryContent"
                      variant="bold"
                      className="text-3xl"
                    >
                      {note.title}
                    </CustomText>
                  </CustomView>
                </Pressable>
              ))}
          </ScrollView>
        </>,
        <>
          <View className="py-8 items-center justify-center">
            <CustomText>
              <ActivityIndicator
                size={72}
                color={useTheme.getState().currentScheme.colorPrimary}
              />
            </CustomText>
            <CustomText variant="bold" className="text-xl">
              Generating...
            </CustomText>
          </View>
        </>,
      ];

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
        >
          {tabs[index]}
        </CustomView>
      );
    },
  },
  GenerateFromDocumentTray: {
    component: ({
      close,
      type,
    }: {
      close: () => void;
      type: "quiz" | "flashcard" | "summary-notes";
    }) => {
      const [document, setDocument] =
        useState<DocumentPicker.DocumentPickerAsset>();

      const handlePick = async () => {
        setDocument(undefined);

        try {
          const document = await DocumentPicker.getDocumentAsync({
            type: [
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/pdf",
            ],
            multiple: false,
          });

          if (document.canceled === false) {
            setDocument(document.assets[0]);
            console.log(document.assets);
          } else {
            toast("Pick atleast one file.");
            close();
          }
        } catch (err) {
          toast("Error picking document file.");
        }
      };

      useEffect(() => {
        handlePick();
      }, []);

      const handleGenerateQuizFromDocument = async () => {
        if (!document) {
          toast("Please pick a document first.");
          return;
        }

        const extension = document.name.split(".").pop()?.toLowerCase();

        try {
          setIndex(1);
          const formData = new FormData();

          formData.append("file", {
            uri: document.uri,
            name: document.name,
            type:
              document.mimeType ||
              (extension === "pdf"
                ? "application/pdf"
                : extension === "docx"
                  ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  : "application/octet-stream"),
          } as any);

          const response = await _API_INSTANCE.post(
            "ai/generate-quiz-from-pdf",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 10 * 60 * 1000,
            }
          );

          if (response.status === 200) {
            const data = response.data;

            await AsyncStorage.setItem(
              "app-ai-generated-quiz",
              JSON.stringify(data)
            );

            router.push("/(learner)/(quiz)/ai/generated");
          } else {
            console.error("Upload failed:", response.data.message);
            toast("Upload failed.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast("Something went wrong uploading file.");
        } finally {
          setIndex(0);
          setDocument(undefined);
          close();
        }
      };

      const handleGenerateFlashcardsFromDocument = async () => {
        if (!document) {
          toast("Please pick a document first.");
          return;
        }

        const extension = document.name.split(".").pop()?.toLowerCase();

        try {
          setIndex(1);
          const formData = new FormData();

          formData.append("file", {
            uri: document.uri,
            name: document.name,
            type:
              document.mimeType ||
              (extension === "pdf"
                ? "application/pdf"
                : extension === "docx"
                  ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  : "application/octet-stream"),
          } as any);

          const response = await _API_INSTANCE.post(
            "ai/generate-flashcards-from-pdf",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 10 * 60 * 1000,
            }
          );

          if (response.status === 200) {
            const data = response.data;

            await AsyncStorage.setItem(
              "app-ai-generated-flashcards",
              JSON.stringify(data)
            );

            router.push("/(learner)/(flashcard)/ai/generated");
          } else {
            console.error("Upload failed:", response.data.message);
            toast("Upload failed.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast("Something went wrong uploading file.");
        } finally {
          setIndex(0);
          setDocument(undefined);
          close();
        }
      };

      const handleGenerateSummaryNotesFromDocument = async () => {
        if (!document) {
          toast("Please pick a document first.");
          return;
        }

        const extension = document.name.split(".").pop()?.toLowerCase();

        try {
          setIndex(1);
          const formData = new FormData();

          formData.append("file", {
            uri: document.uri,
            name: document.name,
            type:
              document.mimeType ||
              (extension === "pdf"
                ? "application/pdf"
                : extension === "docx"
                  ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  : "application/octet-stream"),
          } as any);

          const response = await _API_INSTANCE.post(
            "ai/generate-notes-from-pdf",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 10 * 60 * 1000,
            }
          );

          if (response.status === 200) {
            const data = response.data;

            await AsyncStorage.setItem(
              "app-ai-generated-note",
              JSON.stringify(data)
            );

            router.push("/(learner)/(note)/ai/generated");
          } else {
            console.error("Upload failed:", response.data.message);
            toast("Upload failed.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast("Something went wrong uploading file.");
        } finally {
          setIndex(0);
          setDocument(undefined);
          close();
        }
      };

      const [index, setIndex] = useState(0);
      const tabs = [
        <>
          <View className="flex flex-row gap-4 items-center">
            <CustomText>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                onPress={close}
              />
            </CustomText>
            <View>
              {type === "summary-notes" ? (
                <CustomText variant="bold" className="text-xl">
                  Generate summary notes from document
                </CustomText>
              ) : (
                <CustomText variant="bold" className="text-xl">
                  Generate {type === "quiz" ? "quiz" : "flashcards"} from
                  document
                </CustomText>
              )}
            </View>
          </View>
          {document && (
            <>
              <CustomView
                variant="colorBase200"
                className="flex flex-row gap-4 items-center p-4 rounded-3xl"
              >
                <CustomText>
                  <MaterialCommunityIcons name="file" size={28} />
                </CustomText>
                <View className="flex-1 items-center">
                  <CustomText className="text-lg flex-1" variant="bold">
                    {document.name}
                  </CustomText>
                </View>
              </CustomView>
              <CustomPressable
                variant="colorBase300"
                className="items-center justify-center rounded-2xl"
                onPress={() => {
                  if (type === "quiz") {
                    handleGenerateQuizFromDocument();
                  }

                  if (type === "flashcard") {
                    handleGenerateFlashcardsFromDocument();
                  }

                  if (type === "summary-notes") {
                    handleGenerateSummaryNotesFromDocument();
                  }
                }}
              >
                {type === "summary-notes" ? (
                  <CustomText>Generate summary notes</CustomText>
                ) : (
                  <CustomText>Generate {type}</CustomText>
                )}
              </CustomPressable>
            </>
          )}
        </>,
        <>
          <View className="py-8 items-center justify-center">
            <CustomText>
              <ActivityIndicator
                size={72}
                color={useTheme.getState().currentScheme.colorPrimary}
              />
            </CustomText>
            <CustomText variant="bold" className="text-xl">
              Generating...
            </CustomText>
          </View>
        </>,
      ];

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
        >
          {tabs[index]}
        </CustomView>
      );
    },
  },
  GenerateFromImageTray: {
    component: ({
      close,
      type,
    }: {
      close: () => void;
      type: "quiz" | "flashcard" | "summary-notes";
    }) => {
      const [document, setDocument] =
        useState<DocumentPicker.DocumentPickerAsset>();

      const handlePick = async () => {
        setDocument(undefined);

        try {
          const document = await DocumentPicker.getDocumentAsync({
            type: ["image/jpeg", "image/png", "image/jpg"],
            multiple: false,
          });

          if (document.canceled === false) {
            setDocument(document.assets[0]);
            console.log(document.assets);
          } else {
            toast("Pick atleast one file.");
            close();
          }
        } catch (err) {
          toast("Error picking document file.");
        }
      };

      useEffect(() => {
        handlePick();
      }, []);

      const handleGenerateSummaryNotesFromImage = async () => {
        if (!document) {
          toast("Please pick a image first.");
          return;
        }

        try {
          setIndex(1);
          const formData = new FormData();

          formData.append("file", {
            uri: document.uri,
            name: document.name,
            type: document.mimeType,
          } as any);

          const response = await _API_INSTANCE.post(
            "ai/generate-notes-from-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 10 * 60 * 1000,
            }
          );

          if (response.status === 200) {
            const data = response.data;

            await AsyncStorage.setItem(
              "app-ai-generated-note",
              JSON.stringify(data)
            );

            router.push("/(learner)/(note)/ai/generated");
          } else {
            console.error("Upload failed:", response.data.message);
            toast("Upload failed.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast("Something went wrong uploading file.");
        } finally {
          setIndex(0);
          setDocument(undefined);
          close();
        }
      };

      const [index, setIndex] = useState(0);
      const tabs = [
        <>
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
                Generate {type === "quiz" ? "quiz" : "flashcards"} from notes
              </CustomText>
            </View>
          </View>
          {document && (
            <>
              <CustomView
                variant="colorBase200"
                className="flex flex-row gap-4 items-center p-4 rounded-3xl"
              >
                <CustomText>
                  <MaterialCommunityIcons name="file" size={28} />
                </CustomText>
                <View className="flex-1 items-center">
                  <CustomText className="text-lg flex-1" variant="bold">
                    {document.name}
                  </CustomText>
                </View>
              </CustomView>
              <CustomPressable
                variant="colorBase300"
                className="items-center justify-center rounded-2xl"
                onPress={() => {
                  handleGenerateSummaryNotesFromImage();
                }}
              >
                <CustomText>Generate summary note</CustomText>
              </CustomPressable>
            </>
          )}
        </>,
        <>
          <View className="py-8 items-center justify-center">
            <CustomText>
              <ActivityIndicator
                size={72}
                color={useTheme.getState().currentScheme.colorPrimary}
              />
            </CustomText>
            <CustomText variant="bold" className="text-xl">
              Generating...
            </CustomText>
          </View>
        </>,
      ];

      return (
        <CustomView
          variant="colorBase100"
          className="rounded-tr-3xl rounded-tl-3xl px-4 py-8 gap-4"
        >
          {tabs[index]}
        </CustomView>
      );
    },
  },
};

export default _TRAYS;
